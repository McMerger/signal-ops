"""
Decision logging module for strategy evaluation.
Logs all trading decisions with full audit trail to PostgreSQL.
"""

from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
import json
import psycopg2
from psycopg2.extras import RealDictCursor


@dataclass
class TriggerCondition:
    """Represents a single condition that was evaluated"""
    source: str  # 'fundamental', 'polymarket', 'onchain', 'technical', 'news'
    metric: str
    value: float
    threshold_operator: str  # '<', '>', '<=', '>=', '=='
    threshold_value: float
    status: str  # 'PASS', 'FAIL', 'N/A'
    reasoning: Optional[str] = None


@dataclass
class DecisionLog:
    """Complete decision log with all context"""
    decision_log_id: str
    timestamp: datetime
    strategy_name: str
    asset: str
    decision: str  # 'BUY', 'SELL', 'HOLD'
    confidence: float
    position_size: Optional[float]
    triggers_met: List[TriggerCondition]
    metadata: Dict[str, Any]
    execution_status: str = 'PENDING'
    
    def to_json(self) -> str:
        """Convert to JSON string"""
        data = asdict(self)
        data['timestamp'] = self.timestamp.isoformat()
        data['triggers_met'] = [asdict(t) for t in self.triggers_met]
        return json.dumps(data, indent=2)


class DecisionLogger:
    """Logs strategy decisions to PostgreSQL"""
    
    def __init__(self, db_connection):
        self.db = db_connection
    
    def log_decision(self, decision: DecisionLog) -> str:
        """
        Insert decision log into database
        Returns: decision_log_id
        """
        cursor = self.db.cursor()
        
        try:
            # Insert main decision
            cursor.execute("""
                INSERT INTO decision_logs 
                (id, timestamp, strategy_name, asset, decision, confidence, 
                 position_size, execution_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                decision.decision_log_id,
                decision.timestamp,
                decision.strategy_name,
                decision.asset,
                decision.decision,
                decision.confidence,
                decision.position_size,
                decision.execution_status
            ))
            
            decision_id = cursor.fetchone()[0]
            
            # Insert triggers
            for trigger in decision.triggers_met:
                cursor.execute("""
                    INSERT INTO decision_triggers
                    (decision_log_id, source, metric, value, threshold_operator,
                     threshold_value, status, reasoning)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    decision_id,
                    trigger.source,
                    trigger.metric,
                    trigger.value,
                    trigger.threshold_operator,
                    trigger.threshold_value,
                    trigger.status,
                    trigger.reasoning
                ))
            
            # Insert metadata
            for key, value in decision.metadata.items():
                cursor.execute("""
                    INSERT INTO decision_metadata
                    (decision_log_id, key, value)
                    VALUES (%s, %s, %s)
                """, (decision_id, key, str(value)))
            
            self.db.commit()
            return decision_id
            
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Failed to log decision: {e}")
    
    def get_decision_log(self, decision_id: str) -> Optional[DecisionLog]:
        """Retrieve decision log by ID"""
        cursor = self.db.cursor(cursor_factory=RealDictCursor)
        
        # Get main decision
        cursor.execute("""
            SELECT id, timestamp, strategy_name, asset, decision, confidence,
                   position_size, execution_status
            FROM decision_logs
            WHERE id = %s
        """, (decision_id,))
        
        row = cursor.fetchone()
        if not row:
            return None
        
        # Get triggers
        cursor.execute("""
            SELECT source, metric, value, threshold_operator, threshold_value,
                   status, reasoning
            FROM decision_triggers
            WHERE decision_log_id = %s
            ORDER BY created_at
        """, (decision_id,))
        
        triggers = []
        for trigger_row in cursor.fetchall():
            triggers.append(TriggerCondition(
                source=trigger_row['source'],
                metric=trigger_row['metric'],
                value=float(trigger_row['value']) if trigger_row['value'] else 0,
                threshold_operator=trigger_row['threshold_operator'],
                threshold_value=float(trigger_row['threshold_value']) if trigger_row['threshold_value'] else 0,
                status=trigger_row['status'],
                reasoning=trigger_row['reasoning']
            ))
        
        # Get metadata
        cursor.execute("""
            SELECT key, value
            FROM decision_metadata
            WHERE decision_log_id = %s
        """, (decision_id,))
        
        metadata = {row['key']: row['value'] for row in cursor.fetchall()}
        
        return DecisionLog(
            decision_log_id=row['id'],
            timestamp=row['timestamp'],
            strategy_name=row['strategy_name'],
            asset=row['asset'],
            decision=row['decision'],
            confidence=float(row['confidence']) if row['confidence'] else 0,
            position_size=float(row['position_size']) if row['position_size'] else None,
            triggers_met=triggers,
            metadata=metadata,
            execution_status=row['execution_status']
        )
