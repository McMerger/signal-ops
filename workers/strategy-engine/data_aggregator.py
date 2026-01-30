"""
Data Aggregator - Collects data from all 5 sources for strategy evaluation.
"""

from typing import Dict, Any, Optional
import requests
from datetime import datetime, timedelta
import os


class DataAggregator:
    """Aggregate data from all 5 sources for strategy evaluation"""
    
    def __init__(self, config: Optional[Dict[str, str]] = None):
        if config is None:
            config = {}
        
        self.yahoo_api_base = config.get('yahoo_api', 'http://localhost:8080/api/v1/data-sources/yahoo')
        self.dune_api_key = config.get('dune_api_key', os.getenv('DUNE_API_KEY', ''))
        self.polymarket_api = config.get('polymarket_api', 'http://localhost:8080/api/v1/polymarket')
        self.news_api_key = config.get('news_api_key', os.getenv('NEWS_API_KEY', ''))
        self.go_api_base = config.get('go_api_base', 'http://localhost:8080/api/v1')
    
    def gather_all_sources(self, asset: str) -> Dict[str, Any]:
        """
        Gather data from all 5 sources for an asset
        Returns: {source_name: data_dict}
        """
        return {
            'fundamental': self.get_fundamental_data(asset),
            'polymarket': self.get_polymarket_data(asset),
            'onchain': self.get_onchain_data(asset),
            'technical': self.get_technical_data(asset),
            'news': self.get_news_data(asset)
        }
    
    def get_fundamental_data(self, asset: str) -> Dict[str, float]:
        """Fetch fundamental metrics from Yahoo Finance via Go API"""
        try:
            response = requests.get(f'{self.yahoo_api_base}/{asset}', timeout=5)
            if response.status_code == 200:
                data = response.json()
                return {
                    'price_to_book': data.get('price_to_book', 0),
                    'price_to_sales': data.get('price_to_sales', 0),
                    'price_to_earnings': data.get('price_to_earnings', 0),
                    'debt_to_equity': data.get('debt_to_equity', 0),
                    'current_ratio': data.get('current_ratio', 0),
                    'market_cap': data.get('market_cap', 0)
                }
        except Exception as e:
            print(f"Error fetching fundamental data: {e}")
        
        return {}
    
    def get_polymarket_data(self, asset: str) -> Dict[str, float]:
        """Fetch prediction market odds"""
        try:
            response = requests.get(f'{self.polymarket_api}/markets', timeout=5)
            if response.status_code == 200:
                markets = response.json().get('markets', [])
                
                # Extract relevant market probabilities
                result = {}
                for market in markets:
                    if 'recession' in market.get('question', '').lower():
                        result['us_recession_2025_odds'] = market.get('yes_prob', 0)
                    elif 'conflict' in market.get('question', '').lower():
                        result['major_conflict_2025_odds'] = market.get('yes_prob', 0)
                
                return result
        except Exception as e:
            print(f"Error fetching Polymarket data: {e}")
        
        return {}
    
    def get_onchain_data(self, asset: str) -> Dict[str, float]:
        """Fetch on-chain metrics from Dune/DeFiLlama"""
        # Only applicable for crypto assets
        if not asset.endswith('USD') and asset not in ['BTC', 'ETH', 'SOL']:
            return {}
        
        try:
            # Use Go API endpoint for on-chain data
            response = requests.get(f'{self.go_api_base}/data-sources/dune/{asset}', timeout=5)
            if response.status_code == 200:
                data = response.json()
                return {
                    'active_addresses': data.get('active_addresses', 0),
                    'transaction_volume': data.get('transaction_volume', 0),
                    'tvl': data.get('tvl', 0),
                    'whale_concentration': data.get('whale_concentration', 0)
                }
        except Exception as e:
            print(f"Error fetching on-chain data: {e}")
        
        return {}
    
    def get_technical_data(self, asset: str) -> Dict[str, float]:
        """Fetch technical indicators from Go API"""
        try:
            # Fetch RSI
            rsi_response = requests.post(
                f'{self.go_api_base}/indicators/rsi',
                json={'symbol': asset, 'period': 14},
                timeout=5
            )
            
            # Fetch MACD
            macd_response = requests.post(
                f'{self.go_api_base}/indicators/macd',
                json={'symbol': asset},
                timeout=5
            )
            
            result = {}
            
            if rsi_response.status_code == 200:
                result['rsi_14'] = rsi_response.json().get('rsi', 50)
            
            if macd_response.status_code == 200:
                macd_data = macd_response.json()
                result['macd'] = macd_data.get('macd', 0)
                result['macd_signal'] = macd_data.get('signal', 0)
                result['macd_histogram'] = macd_data.get('histogram', 0)
            
            return result
        except Exception as e:
            print(f"Error fetching technical data: {e}")
        
        return {}
    
    def get_news_data(self, asset: str) -> Dict[str, Any]:
        """Fetch news sentiment and event flags"""
        try:
            response = requests.get(
                f'{self.go_api_base}/news/search',
                params={'q': asset, 'days': 7},
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    'avg_sentiment': data.get('avg_sentiment', 0),
                    'article_count': data.get('count', 0),
                    'recent_negative_count': sum(
                        1 for article in data.get('articles', [])
                        if article.get('sentiment', 0) < -0.3
                    )
                }
        except Exception as e:
            print(f"Error fetching news data: {e}")
        
        return {}
