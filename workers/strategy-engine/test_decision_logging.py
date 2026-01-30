"""
Test suite for decision logging functionality.
"""

import pytest
from decision_logger import DecisionLogger, DecisionLog, TriggerCondition
from datetime import datetime
import uuid
import psycopg2


@pytest.fixture
def db_connection():
    """Create test database connection"""
    conn = psycopg2.connect(
        host="localhost",
        database="signalops_test",
        user="signalops",
        password="signalops_dev_password"
    )
    yield conn
    conn.close()


def test_decision_logging(db_connection):
    """Test complete decision logging flow"""
    logger = DecisionLogger(db_connection)
    
    decision = DecisionLog(
        decision_log_id=str(uuid.uuid4()),
        timestamp=datetime.utcnow(),
        strategy_name="Graham_Defensive",
        asset="AAPL",
        decision="BUY",
        confidence=0.85,
        position_size=0.02,
        triggers_met=[
            TriggerCondition(
                source='fundamental',
                metric='price_to_book',
                value=1.32,
                threshold_operator='<',
                threshold_value=1.5,
                status='PASS',
                reasoning='P/B ratio 1.32'
            ),
            TriggerCondition(
                source='polymarket',
                metric='us_recession_2025_odds',
                value=0.18,
                threshold_operator='<',
                threshold_value=0.25,
                status='PASS',
                reasoning='Recession odds 18%'
            ),
            TriggerCondition(
                source='technical',
                metric='rsi_14',
                value=31.2,
                threshold_operator='<',
                threshold_value=35,
                status='PASS',
                reasoning='RSI 31.2'
            )
        ],
        metadata={'market_price': 150.25, 'strategy_version': '1.0'}
    )
    
    decision_id = logger.log_decision(decision)
    assert decision_id is not None
    
    # Verify retrieval
    retrieved = logger.get_decision_log(decision_id)
    assert retrieved is not None
    assert retrieved.decision == 'BUY'
    assert len(retrieved.triggers_met) == 3
    assert retrieved.confidence == 0.85


def test_decision_with_failed_triggers(db_connection):
    """Test decision logging with failed triggers"""
    logger = DecisionLogger(db_connection)
    
    decision = DecisionLog(
        decision_log_id=str(uuid.uuid4()),
        timestamp=datetime.utcnow(),
        strategy_name="Test_Strategy",
        asset="TSLA",
        decision="HOLD",
        confidence=0.33,
        position_size=None,
        triggers_met=[
            TriggerCondition(
                source='technical',
                metric='rsi_14',
                value=45.0,
                threshold_operator='<',
                threshold_value=35,
                status='FAIL',
                reasoning='RSI 45.0 not oversold'
            )
        ],
        metadata={}
    )
    
    decision_id = logger.log_decision(decision)
    assert decision_id is not None
    
    retrieved = logger.get_decision_log(decision_id)
    assert retrieved.decision == 'HOLD'
    assert retrieved.position_size is None
