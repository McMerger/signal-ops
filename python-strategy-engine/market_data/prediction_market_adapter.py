"""
Prediction market adapter for Polymarket.

Polymarket is crypto-native with broad event coverage: macro, politics, 
crypto, culture. Public API requires no authentication for market data.
"""

import requests
from typing import Dict, Optional, List
from datetime import datetime


class PolymarketAdapter:
    """
    Polymarket API adapter.
    
    Docs: https://docs.polymarket.com/
    Public read access, no API key needed for market data.
    """
    
    def __init__(self):
        self.gamma_url = "https://gamma-api.polymarket.com"
        self.clob_url = "https://clob.polymarket.com"
    
    def get_market_odds(self, condition_id):
        """
        Fetch odds for a Polymarket market.
        
        Args:
            condition_id: Market slug or condition ID
                         Examples: 'will-bitcoin-be-above-100k-by-2025'
                                  or hex ID '0x...'
        """
        try:
            # Try as slug first
            url = f"{self.gamma_url}/markets/{condition_id}"
            resp = requests.get(url, timeout=10)
            
            if not resp.ok:
                print(f"Polymarket error {resp.status_code} for {condition_id}")
                return None
            
            market = resp.json()
            
            # Extract token prices (these ARE the probabilities)
            tokens = market.get('tokens', [])
            
            # Binary markets have YES and NO tokens
            yes_token = next((t for t in tokens if 'yes' in t.get('outcome', '').lower()), None)
            no_token = next((t for t in tokens if 'no' in t.get('outcome', '').lower()), None)
            
            yes_prob = float(yes_token.get('price', 0.5)) if yes_token else 0.5
            no_prob = float(no_token.get('price', 0.5)) if no_token else 0.5
            
            return {
                'source': 'polymarket',
                'market_id': condition_id,
                'title': market.get('question', ''),
                'description': market.get('description', ''),
                'yes_probability': yes_prob,
                'no_probability': no_prob,
                'volume': float(market.get('volume', 0)),
                'liquidity': float(market.get('liquidity', 0)),
                'close_time': market.get('endDate'),
                'updated_at': datetime.now().isoformat(),
                'active': market.get('active', False)
            }
            
        except Exception as e:
            print(f"Failed to fetch Polymarket {condition_id}: {e}")
            return None
    
    def search_markets(self, query=None, limit=20):
        """
        Search for active markets.
        
        Args:
            query: Search string (e.g., 'bitcoin', 'election', 'fed')
            limit: Max results
        """
        try:
            url = f"{self.gamma_url}/markets"
            params = {'limit': limit, 'active': True}
            if query:
                params['query'] = query
            
            resp = requests.get(url, params=params, timeout=10)
            if resp.ok:
                return resp.json()
        except Exception as e:
            print(f"Polymarket search failed: {e}")
        
        return []
    
    def get_trending_markets(self, limit=10):
        """Get currently trending/high-volume markets."""
        try:
            url = f"{self.gamma_url}/markets"
            params = {
                'limit': limit,
                'active': True,
                'order': 'volume',  # Sort by volume
                'ascending': False
            }
            
            resp = requests.get(url, params=params, timeout=10)
            if resp.ok:
                markets = resp.json()
                return [{
                    'slug': m.get('slug'),
                    'title': m.get('question'),
                    'volume': m.get('volume'),
                    'yes_prob': m.get('tokens', [{}])[0].get('price', 0) if m.get('tokens') else 0
                } for m in markets]
        except Exception as e:
            print(f"Failed to get trending: {e}")
        
        return []


class PredictionMarketFeed:
    """
    Main interface for event data.
    Polymarket-only, with mock data fallback for testing.
    """
    
    def __init__(self, use_mock=False):
        self.polymarket = PolymarketAdapter()
        # use_mock is ignored now - Strict Real Data Only
        self.cache = {}
        
    def get_events(self, event_config):
        """
        Fetch multiple event probabilities.
        
        event_config format:
        {
            'btc_100k': 'will-bitcoin-be-above-100k-by-2025',
            'fed_rate': 'fed-rate-above-5-percent',
            'election': 'presidential-election-2024'
        }
        
        Returns dict of event data with probabilities.
        """
        results = {}
        
        for event_name, market_slug in event_config.items():
            # Check cache (5 min TTL)
            cache_key = f"{event_name}_{market_slug}"
            if cache_key in self.cache:
                cached = self.cache[cache_key]
                age = (datetime.now() - datetime.fromisoformat(cached['updated_at'])).seconds
                if age < 300:
                    results[event_name] = cached
                    continue
            
            # Fetch from Polymarket - REAL DATA ONLY
            odds = self.polymarket.get_market_odds(market_slug)
            
            if odds:
                results[event_name] = odds
                self.cache[cache_key] = odds
            else:
                 print(f"Warning: Failed to fetch real data for {event_name}. No mock fallback used.")
                 # Do not add to results
        
        return results
    
    def add_events_to_market_data(self, market_data, event_config):
        """
        Add event probabilities to standard market data.
        This is the key integration point.
        """
        enriched = market_data.copy()
        enriched['events'] = self.get_events(event_config)
        return enriched
    
    def discover_relevant_markets(self, keywords):
        """
        Helper to find relevant Polymarket slugs for your events.
        
        Example:
            feed.discover_relevant_markets(['bitcoin', 'fed', 'election'])
        """
        print("\nDiscovering markets on Polymarket...\n")
        
        for keyword in keywords:
            print(f"Searching for: {keyword}")
            markets = self.polymarket.search_markets(query=keyword, limit=5)
            
            if markets:
                for m in markets[:3]:
                    slug = m.get('slug', 'N/A')
                    title = m.get('question', 'N/A')
                    print(f"  - {slug}")
                    print(f"    {title}\n")
            else:
                print(f"  No markets found\n")
