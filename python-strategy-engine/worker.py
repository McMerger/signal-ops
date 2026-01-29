from js import Response
from strategy_evaluator import get_evaluator
import json

async def on_fetch(request, env):
    """
    Cloudflare Python Worker Entrypoint.
    Routes requests to the StrategyEvaluator.
    """
    url = request.url
    method = request.method
    
    # Initialize evaluator (singleton)
    evaluator = get_evaluator(use_mock=False) # Strict Real Data Only per README

    if method == "GET" and url.endswith("/evaluate"):
        # Default Graham evaluation
        res = evaluator.evaluate_strategy("graham", "BTC")
        return Response.new(json.dumps(res.__dict__))

    if method == "POST" and url.endswith("/evaluate"):
        try:
            body = await request.json()
            strategy_name = body.get("strategy", "graham")
            asset = body.get("asset", "BTC")
            market_data = body.get("market_data", {})
            asset_class = body.get("asset_class", None)
            
            # Inject asset class into market data context
            if asset_class:
                market_data['asset_class'] = asset_class
            
            evaluation = evaluator.evaluate_strategy(strategy_name, asset, market_data)
            
            # Serialize dataclass to dict
            return Response.new(json.dumps(evaluation.__dict__))
        except Exception as e:
            return Response.new(json.dumps({"error": str(e)}), status=400)

    if method == "GET" and "/health" in url:
        return Response.new(json.dumps({"status": "operational", "engine": "python-worker"}))

    return Response.new("SignalOps Strategy Engine: Endpoint not found", status=404)
