"""
YAML Strategy Parser for SignalOps.
Parses and validates strategy configurations from YAML files.
"""

import yaml
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum
from decision_logger import TriggerCondition


class DataSource(Enum):
    FUNDAMENTAL = "fundamental"
    POLYMARKET = "polymarket"
    ONCHAIN = "onchain"
    TECHNICAL = "technical"
    NEWS = "news"


class Operator(Enum):
    LT = "<"
    GT = ">"
    LTE = "<="
    GTE = ">="
    EQ = "=="
    NEQ = "!="


class ActionMode(Enum):
    NOTIFY = "notify"
    AUTO = "auto"
    PAPER = "paper"


@dataclass
class Condition:
    metric: str
    operator: Operator
    threshold: float
    
    def evaluate(self, value: float) -> bool:
        ops = {
            Operator.LT: lambda v, t: v < t,
            Operator.GT: lambda v, t: v > t,
            Operator.LTE: lambda v, t: v <= t,
            Operator.GTE: lambda v, t: v >= t,
            Operator.EQ: lambda v, t: v == t,
            Operator.NEQ: lambda v, t: v != t,
        }
        return ops[self.operator](value, self.threshold)


@dataclass
class Rule:
    id: str
    source: DataSource
    conditions: List[Condition]
    
    def evaluate(self, data: Dict[str, Any]) -> tuple:
        """
        Evaluate all conditions for this rule
        Returns: (all_passed, list of trigger conditions for logging)
        """
        triggers = []
        all_passed = True
        
        for condition in self.conditions:
            value = data.get(condition.metric)
            if value is None:
                all_passed = False
                triggers.append(TriggerCondition(
                    source=self.source.value,
                    metric=condition.metric,
                    value=0,
                    threshold_operator=condition.operator.value,
                    threshold_value=condition.threshold,
                    status='N/A',
                    reasoning=f'Metric {condition.metric} not available'
                ))
                continue
            
            passed = condition.evaluate(value)
            if not passed:
                all_passed = False
            
            triggers.append(TriggerCondition(
                source=self.source.value,
                metric=condition.metric,
                value=value,
                threshold_operator=condition.operator.value,
                threshold_value=condition.threshold,
                status='PASS' if passed else 'FAIL',
                reasoning=f'{condition.metric} {value:.4f} {condition.operator.value} {condition.threshold}'
            ))
        
        return all_passed, triggers


@dataclass
class ExecutionConfig:
    require_confirmations: int
    position_size: float
    action_mode: ActionMode


@dataclass
class Strategy:
    name: str
    assets: List[str]
    rules: List[Rule]
    execution: ExecutionConfig
    version: str = "1.0"


class StrategyParser:
    """Parse YAML strategy configurations"""
    
    @staticmethod
    def parse_yaml_file(filepath: str) -> Strategy:
        with open(filepath, 'r') as f:
            config = yaml.safe_load(f)
        
        return StrategyParser.parse_yaml_dict(config)
    
    @staticmethod
    def parse_yaml_dict(config: Dict) -> Strategy:
        strategy_config = config['strategy']
        
        # Parse rules
        rules = []
        for rule_config in strategy_config['rules']:
            conditions = []
            for cond_config in rule_config['conditions']:
                conditions.append(Condition(
                    metric=cond_config['metric'],
                    operator=Operator(cond_config['operator']),
                    threshold=float(cond_config['threshold'])
                ))
            
            rules.append(Rule(
                id=rule_config['id'],
                source=DataSource(rule_config['source']),
                conditions=conditions
            ))
        
        # Parse execution config
        exec_config = strategy_config['execution']
        execution = ExecutionConfig(
            require_confirmations=exec_config['require_confirmations'],
            position_size=float(exec_config['position_size']),
            action_mode=ActionMode(exec_config['action_mode'])
        )
        
        return Strategy(
            name=strategy_config['name'],
            assets=strategy_config['assets'],
            rules=rules,
            execution=execution
        )
    
    @staticmethod
    def validate_strategy(strategy: Strategy) -> List[str]:
        """Validate strategy configuration, return list of errors"""
        errors = []
        
        if not strategy.name:
            errors.append("Strategy name is required")
        
        if not strategy.assets:
            errors.append("At least one asset is required")
        
        if not strategy.rules:
            errors.append("At least one rule is required")
        
        if strategy.execution.require_confirmations > len(strategy.rules):
            errors.append(
                f"require_confirmations ({strategy.execution.require_confirmations}) "
                f"cannot exceed number of rules ({len(strategy.rules)})"
            )
        
        if not (0 < strategy.execution.position_size <= 1):
            errors.append("position_size must be between 0 and 1")
        
        return errors
