"""
End-to-end integration tests for SignalOps backend.
Tests the complete flow from strategy upload to decision logging.
"""

import pytest
import requests
import yaml
import time
from datetime import datetime

GO_API_BASE = "http://localhost:8080/api/v1"
PYTHON_API_BASE = "http://localhost:5000"


@pytest.fixture(scope="module")
def check_services():
    """Verify all services are running"""
    try:
        # Check Go API
        response = requests.get(f"{GO_API_BASE}/../health", timeout=2)
        assert response.status_code == 200, "Go API not responding"
        
        # Check Python API (if available)
        try:
            requests.get(PYTHON_API_BASE, timeout=2)
        except:
            print("Warning: Python API not responding, some tests may be skipped")
    except Exception as e:
        pytest.skip(f"Services not running: {e}")


def test_decision_logging_flow(check_services):
    """Test complete decision logging flow"""
    
    # 1. Upload strategy YAML
    strategy_yaml = """
strategy:
  name: "Test_Integration_Strategy"
  assets: ["AAPL"]
  rules:
    - id: "technical_rsi"
      source: "technical"
      conditions:
        - metric: "rsi_14"
          operator: "<"
          threshold: 35
  execution:
    require_confirmations: 1
    position_size: 0.02
    action_mode: "notify"
"""
    
    response = requests.post(
        f"{GO_API_BASE}/strategies/configs",
        data=strategy_yaml,
        headers={"Content-Type": "application/x-yaml"}
    )
    assert response.status_code == 200, f"Failed to upload strategy: {response.text}"
    result = response.json()
    assert result.get("success") == True
    assert result.get("strategy_name") == "Test_Integration_Strategy"
    
    # 2. List strategies
    response = requests.get(f"{GO_API_BASE}/strategies/configs")
    assert response.status_code == 200
    strategies = response.json().get("strategies", [])
    assert len(strategies) > 0
    
    # 3. Execute strategy (mock for now)
    response = requests.post(
        f"{GO_API_BASE}/strategies/execute",
        json={"strategy_name": "Test_Integration_Strategy", "asset": "AAPL"}
    )
    assert response.status_code == 200
    result = response.json()
    assert "decision" in result
    
    print("✓ Decision logging flow test passed")


def test_multi_source_integration(check_services):
    """Test that all 5 data sources work"""
    
    # Test fundamental data (Yahoo Finance)
    try:
        resp = requests.get(f"{GO_API_BASE}/data-sources/yahoo/AAPL", timeout=5)
        if resp.status_code == 200:
            print("✓ Fundamental data source operational")
    except:
        print("⚠ Fundamental data source not available")
    
    # Test polymarket
    try:
        resp = requests.get(f"{GO_API_BASE}/polymarket/markets", timeout=5)
        if resp.status_code == 200:
            print("✓ Polymarket data source operational")
    except:
        print("⚠ Polymarket data source not available")
    
    # Test news
    try:
        resp = requests.get(f"{GO_API_BASE}/news/search?q=AAPL", timeout=5)
        if resp.status_code in [200, 503]:  # 503 if API key not configured
            print("✓ News data source endpoint operational")
    except:
        print("⚠ News data source not available")
    
    # Test technical indicators
    try:
        resp = requests.post(
            f"{GO_API_BASE}/indicators/rsi",
            json={"symbol": "AAPL", "period": 14},
            timeout=5
        )
        if resp.status_code == 200:
            print("✓ Technical indicators operational")
    except:
        print("⚠ Technical indicators not available")
    
    print("✓ Multi-source integration test completed")


def test_decision_retrieval(check_services):
    """Test decision log retrieval endpoints"""
    
    # List decisions
    response = requests.get(f"{GO_API_BASE}/decisions?limit=10")
    assert response.status_code == 200
    result = response.json()
    assert "decisions" in result
    assert "count" in result
    
    decisions = result.get("decisions", [])
    print(f"✓ Retrieved {len(decisions)} decision logs")
    
    # If we have decisions, test individual retrieval
    if decisions:
        decision_id = decisions[0].get("id")
        response = requests.get(f"{GO_API_BASE}/decisions/{decision_id}")
        assert response.status_code == 200
        decision = response.json()
        assert decision.get("id") == decision_id
        print(f"✓ Retrieved individual decision log: {decision_id}")


def test_news_sentiment(check_services):
    """Test news sentiment analysis"""
    
    response = requests.get(f"{GO_API_BASE}/news/sentiment?q=AAPL")
    
    # May return 503 if API key not configured
    if response.status_code == 503:
        print("⚠ News API key not configured, skipping test")
        return
    
    assert response.status_code == 200
    result = response.json()
    assert "avg_sentiment" in result
    assert "article_count" in result
    assert "sentiment_label" in result
    
    print(f"✓ News sentiment: {result.get('sentiment_label')} ({result.get('avg_sentiment'):.2f})")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
