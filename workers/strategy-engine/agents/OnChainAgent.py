from agents.base_agent import BaseAgent, Signal
from typing import Dict, Optional

class OnChainAgent(BaseAgent):
    """
    Monitors on-chain flows and protocol metrics.
    Required by README Research Core.
    """
    def __init__(self, name="OnChainAgent"):
        super().__init__(name)

    def generate_signal(self, market_data: Dict, event_data: Optional[Dict] = None) -> Optional[Signal]:
        # Placeholder logic consistent with README description
        # Checks for large transfers, unlock schedules, etc.
        unified = market_data.get('unified', {})
        onchain = unified.get('onchain', {})
        
        if not onchain:
            return None
            
        # Example logic
        sentiment = onchain.get('sentiment', 'NEUTRAL')
        if sentiment == 'BEARISH':
             return Signal(
                timestamp=0,
                symbol=unified.get('symbol', 'UNKNOWN'),
                action='SELL',
                confidence=0.6,
                size=0,
                reason="On-chain outflows detected",
                agent_name=self.name,
                price=0
            )
        return None
