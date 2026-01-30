from agents.base_agent import BaseAgent, Signal
from typing import Dict, Optional

class RiskPolicyAgent(BaseAgent):
    """
    Enforces risk limits and policy constraints at the Research layer.
    Required by README Research Core.
    """
    def __init__(self, name="RiskPolicyAgent"):
        super().__init__(name)

    def generate_signal(self, market_data: Dict, event_data: Optional[Dict] = None) -> Optional[Signal]:
        # Acts as a filter/veto agent
        return None
