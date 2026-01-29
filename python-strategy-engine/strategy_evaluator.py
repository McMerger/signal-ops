"""
Production-ready strategy evaluator for SignalOps.
Integrates multiple agents and provides unified decision-making interface.
"""
import logging
import os
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
from openai import OpenAI  # Kimi is OpenAI-compatible

from agents.base_agent import BaseAgent
from agents.graham_defensive import GrahamDefensiveStrategy
from agents.event_driven_agent import EventDrivenAgent
from agents.trend_follower import TrendFollowerAgent
from market_data.multi_source_feed import MultiSourceDataFeed

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Decision(str, Enum):
    BUY = "BUY"
    SELL = "SELL"
    HOLD = "HOLD"


@dataclass
class TriggerEvaluation:
    """Represents evaluation of a single trigger/rule"""
    metric: str
    source: str  # fundamental, polymarket, onchain, technical, news
    value: float
    threshold: float
    operator: str  # <, >, <=, >=, ==
    status: str  # PASS, FAIL


@dataclass
class StrategyEvaluation:
    """Complete strategy evaluation result"""
    decision: Decision
    confidence: float
    triggers_evaluated: List[TriggerEvaluation]
    reasoning: Dict[str, str]
    final_action: str  # APPROVED, BLOCKED, PENDING
    timestamp: int
    research_summary: Optional[str] = None # Added for Kimi output


class StrategyEvaluator:
    """
    Unified strategy evaluation engine.
    Coordinates multiple agents and applies Kimi K2.5 research layer.
    """
    
    def __init__(self, use_mock: bool = False, api_key: Optional[str] = None):
        """Initialize evaluator with data feed and Research LLM"""
        self.feed = MultiSourceDataFeed(use_mock=use_mock)
        
        # Initialize Kimi Client (Moonshot AI)
        self.kimi_client = None
        key = api_key or os.getenv("MOONSHOT_API_KEY")
        if key:
            try:
                self.kimi_client = OpenAI(
                    api_key=key,
                    base_url="https://api.moonshot.cn/v1"
                )
                logger.info("Kimi K2.5 Research Core initialized.")
            except Exception as e:
                logger.error(f"Failed to init Kimi client: {e}")
        else:
            logger.warning("MOONSHOT_API_KEY not found. Research Core disabled.")
        
        # Initialize agents
        self.agents: Dict[str, BaseAgent] = {
            'graham': GrahamDefensiveStrategy("Graham"),
            'event_driven': EventDrivenAgent("EventDriven"),
            'trend_follower': TrendFollowerAgent("TrendFollower"),
        }
        
        logger.info(f"Strategy Evaluator initialized with {len(self.agents)} agents")
    
    def evaluate_strategy(
        self,
        strategy_name: str,
        asset: str,
        market_data: Optional[Dict[str, Any]] = None
    ) -> StrategyEvaluation:
        """
        Evaluate a strategy for a given asset.
        
        Args:
            strategy_name: Name of strategy to evaluate (e.g., 'graham', 'multi_agent')
            asset: Asset symbol (e.g., 'AAPL', 'BTC')
            market_data: Optional market data override
            
        Returns:
            StrategyEvaluation with decision, confidence, and reasoning
        """
        logger.info(f"Evaluating {strategy_name} strategy for {asset}")
        
        # Get unified multi-source data
        try:
            unified_data = self.feed.get_unified_data(
                symbol=asset,
                market_data=market_data or {},
                event_config={
                    'recession': 'will-the-us-enter-a-recession-in-2025',
                    'btc_100k': 'will-bitcoin-be-above-100000-on-january-1-2025'
                }
            )
        except Exception as e:
            logger.error(f"Failed to get unified data: {e}")
            unified_data = {}
        
        # Evaluate based on strategy type
        if strategy_name == 'multi_agent':
            return self._evaluate_multi_agent(asset, unified_data)
        elif strategy_name in self.agents:
            return self._evaluate_single_agent(strategy_name, asset, unified_data)
        else:
            # Default: Graham defensive
            return self._evaluate_single_agent('graham', asset, unified_data)
    
    def _evaluate_single_agent(
        self,
        agent_name: str,
        asset: str,
        unified_data: Dict
    ) -> StrategyEvaluation:
        """Evaluate using a single agent"""
        agent = self.agents.get(agent_name)
        if not agent:
            logger.warning(f"Agent {agent_name} not found, using Graham")
            agent = self.agents['graham']
        
        # Generate signal from agent
        signal = agent.generate_signal({'unified': unified_data})
        
        if not signal:
            return StrategyEvaluation(
                decision=Decision.HOLD,
                confidence=0.0,
                triggers_evaluated=[],
                reasoning={'error': 'No signal generated'},
                final_action='BLOCKED',
                timestamp=int(signal.timestamp) if signal else 0
            )
        
        # Convert signal to evaluation
        triggers = self._extract_triggers_from_signal(signal, unified_data)
        
        # Kimi K2.5 Research Layer
        research_summary = None
        if self.kimi_client and signal.confidence > 0.6:
            # Only burn tokens on high-conviction signals
            research_summary = self._generate_kimi_research(
                asset, signal.action, unified_data
            )
        
        return StrategyEvaluation(
            decision=Decision(signal.action),
            confidence=signal.confidence,
            triggers_evaluated=triggers,
            reasoning=signal.metadata.get('reasoning', {}),
            final_action='APPROVED' if signal.confidence > 0.7 else 'PENDING',
            timestamp=int(signal.timestamp),
            research_summary=research_summary
        )

    def _generate_kimi_research(self, asset: str, decision: str, data: Dict) -> str:
        """Call Kimi K2.5 to generate a research summary."""
        try:
            # Construct a data-dense prompt
            context = f"Asset: {asset}\nDecision: {decision}\n"
            context += f"Fundamentals: {data.get('fundamentals', {})}\n"
            context += f"Prediction Markets: {data.get('events', {})}\n"
            context += f"On-Chain: {data.get('onchain', {})}\n"
            
            completion = self.kimi_client.chat.completions.create(
                model="moonshot-v1-8k",
                messages=[
                    {"role": "system", "content": "You are a specialized financial analyst. Summarize the provided data points into a concise 2-sentence rationale for the trade decision."},
                    {"role": "user", "content": context}
                ],
                temperature=0.3
            )
            return completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Kimi research failed: {e}")
            return "Research unavailable"
    
    def _evaluate_multi_agent(
        self,
        asset: str,
        unified_data: Dict
    ) -> StrategyEvaluation:
        """Evaluate using consensus from multiple agents"""
        signals = []
        
        for agent_name, agent in self.agents.items():
            try:
                signal = agent.generate_signal({'unified': unified_data})
                if signal:
                    signals.append((agent_name, signal))
            except Exception as e:
                logger.error(f"Agent {agent_name} failed: {e}")
        
        if not signals:
            return StrategyEvaluation(
                decision=Decision.HOLD,
                confidence=0.0,
                triggers_evaluated=[],
                reasoning={'error': 'No agents produced signals'},
                final_action='BLOCKED',
                timestamp=0
            )
        
        # Consensus logic: majority vote weighted by confidence
        buy_score = sum(s.confidence for _, s in signals if s.action == 'BUY')
        sell_score = sum(s.confidence for _, s in signals if s.action == 'SELL')
        hold_score = sum(s.confidence for _, s in signals if s.action == 'HOLD')
        
        if buy_score > sell_score and buy_score > hold_score:
            decision = Decision.BUY
            confidence = buy_score / len(signals)
        elif sell_score > buy_score and sell_score > hold_score:
            decision = Decision.SELL
            confidence = sell_score / len(signals)
        else:
            decision = Decision.HOLD
            confidence = hold_score / len(signals)
        
        # Aggregate reasoning
        reasoning = {
            f'{name}_recommendation': f"{signal.action} ({signal.confidence:.2f})"
            for name, signal in signals
        }
        
        triggers = []
        for _, signal in signals:
            triggers.extend(self._extract_triggers_from_signal(signal, unified_data))
        
        return StrategyEvaluation(
            decision=decision,
            confidence=confidence,
            triggers_evaluated=triggers,
            reasoning=reasoning,
            final_action='APPROVED' if confidence > 0.65 else 'PENDING',
            timestamp=int(signals[0][1].timestamp)
        )
    
    def _extract_triggers_from_signal(
        self,
        signal,
        unified_data: Dict
    ) -> List[TriggerEvaluation]:
        """Extract trigger evaluations from signal metadata"""
        triggers = []
        
        # Extract from signal metadata if available
        if hasattr(signal, 'metadata') and 'triggers' in signal.metadata:
            for trigger_data in signal.metadata['triggers']:
                triggers.append(TriggerEvaluation(**trigger_data))
        else:
            # Create basic triggers from unified data
            if 'fundamental' in unified_data:
                fund = unified_data['fundamental']
                if 'pe_ratio' in fund:
                    triggers.append(TriggerEvaluation(
                        metric='price_to_earnings',
                        source='fundamental',
                        value=fund['pe_ratio'],
                        threshold=15.0,
                        operator='<',
                        status='PASS' if fund['pe_ratio'] < 15.0 else 'FAIL'
                    ))
            
            if 'polymarket' in unified_data:
                poly = unified_data['polymarket']
                if 'recession_odds' in poly:
                    triggers.append(TriggerEvaluation(
                        metric='recession_probability',
                        source='polymarket',
                        value=poly['recession_odds'],
                        threshold=0.25,
                        operator='<',
                        status='PASS' if poly['recession_odds'] < 0.25 else 'FAIL'
                    ))
        
        return triggers


# Singleton instance for reuse
_evaluator_instance: Optional[StrategyEvaluator] = None


def get_evaluator(use_mock: bool = False, api_key: Optional[str] = None) -> StrategyEvaluator:
    """Get or create singleton evaluator instance"""
    global _evaluator_instance
    if _evaluator_instance is None:
        _evaluator_instance = StrategyEvaluator(use_mock=use_mock, api_key=api_key)
    return _evaluator_instance
