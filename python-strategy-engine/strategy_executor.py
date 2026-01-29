"""
Strategy Executor - Executes YAML-defined strategies with multi-source data.
"""

from strategy_parser import Strategy, StrategyParser
from decision_logger import DecisionLogger, DecisionLog
from typing import Dict, Any
from datetime import datetime
import uuid


class StrategyExecutor:
    """Execute YAML-defined strategies with multi-source data"""
    
    def __init__(self, db_connection):
        self.logger = DecisionLogger(db_connection)
    
    def execute(self, strategy: Strategy, asset: str, data_sources: Dict[str, Any]) -> Dict:
        """
        Execute strategy for a specific asset
        
        Args:
            strategy: Parsed YAML strategy
            asset: Asset symbol to evaluate
            data_sources: Dict of {source_name: data_dict}
                          e.g., {'fundamental': {...}, 'polymarket': {...}}
        
        Returns:
            Decision dict with action, confidence, decision_log_id
        """
        all_triggers = []
        passed_rules = 0
        
        # Evaluate each rule
        for rule in strategy.rules:
            source_data = data_sources.get(rule.source.value, {})
            rule_passed, triggers = rule.evaluate(source_data)
            
            all_triggers.extend(triggers)
            if rule_passed:
                passed_rules += 1
        
        # Determine decision based on confirmations
        decision = 'HOLD'
        if passed_rules >= strategy.execution.require_confirmations:
            decision = 'BUY'  # Could extend to SELL logic
        
        confidence = passed_rules / len(strategy.rules) if strategy.rules else 0
        
        # Create decision log
        log = DecisionLog(
            decision_log_id=str(uuid.uuid4()),
            timestamp=datetime.utcnow(),
            strategy_name=strategy.name,
            asset=asset,
            decision=decision,
            confidence=confidence,
            position_size=strategy.execution.position_size if decision == 'BUY' else None,
            triggers_met=all_triggers,
            metadata={
                'execution_mode': strategy.execution.action_mode.value,
                'rules_passed': passed_rules,
                'rules_total': len(strategy.rules),
                'confirmations_required': strategy.execution.require_confirmations
            }
        )
        
        # Log decision
        self.logger.log_decision(log)
        
        return {
            'decision': decision,
            'decision_log_id': log.decision_log_id,
            'confidence': confidence,
            'triggers': [
                {
                    'source': t.source,
                    'metric': t.metric,
                    'value': t.value,
                    'threshold_operator': t.threshold_operator,
                    'threshold_value': t.threshold_value,
                    'status': t.status,
                    'reasoning': t.reasoning
                }
                for t in all_triggers
            ],
            'rules_passed': passed_rules,
            'rules_total': len(strategy.rules),
            'execution_mode': strategy.execution.action_mode.value
        }
