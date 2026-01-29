"""
Backtesting engine for SignalOps strategies.
Replays historical data and calculates performance metrics.
"""
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import numpy as np

from strategy_evaluator import StrategyEvaluator, Decision

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class Trade:
    """Represents a single trade"""
    timestamp: datetime
    action: str  # BUY, SELL
    price: float
    quantity: float
    pnl: float = 0.0
    

@dataclass
class BacktestResult:
    """Complete backtest results"""
    strategy: str
    symbol: str
    start_date: str
    end_date: str
    total_return: float
    max_drawdown: float
    sharpe_ratio: float
    win_rate: float
    total_trades: int
    winning_trades: int
    losing_trades: int
    avg_win: float
    avg_loss: float
    trades: List[Trade] = field(default_factory=list)
    equity_curve: List[Tuple[datetime, float]] = field(default_factory=list)


class BacktestEngine:
    """
    Backtesting engine for strategy validation.
    Replays historical data and tracks performance.
    """
    
    def __init__(self, initial_capital: float = 100000.0):
        """
        Initialize backtest engine.
        
        Args:
            initial_capital: Starting capital in USD
        """
        self.initial_capital = initial_capital
        self.evaluator = StrategyEvaluator(use_mock=False)  # Strict Real Data
        logger.info(f"Backtest engine initialized with ${initial_capital:,.2f}")
    
    def run_backtest(
        self,
        strategy_name: str,
        symbol: str,
        start_date: str,
        end_date: str,
        price_data: Optional[List[Dict]] = None
    ) -> BacktestResult:
        """
        Run backtest for a strategy.
        
        Args:
            strategy_name: Strategy to test (e.g., 'graham', 'multi_agent')
            symbol: Asset symbol
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            price_data: Optional historical price data
            
        Returns:
            BacktestResult with performance metrics
        """
        logger.info(f"Running backtest: {strategy_name} on {symbol} from {start_date} to {end_date}")
        
        # Generate mock price data if not provided
        if price_data is None:
            price_data = self._generate_mock_price_data(symbol, start_date, end_date)
        
        # Initialize tracking variables
        capital = self.initial_capital
        position = 0.0  # Current position size
        trades: List[Trade] = []
        equity_curve: List[Tuple[datetime, float]] = []
        
        # Replay historical data
        for data_point in price_data:
            timestamp = data_point['timestamp']
            price = data_point['price']
            
            # Evaluate strategy
            evaluation = self.evaluator.evaluate_strategy(
                strategy_name=strategy_name,
                asset=symbol,
                market_data={'price': price}
            )
            
            # Execute trade based on decision
            if evaluation.decision == Decision.BUY and position == 0 and evaluation.final_action == 'APPROVED':
                # Enter long position
                quantity = (capital * 0.95) / price  # Use 95% of capital
                position = quantity
                capital -= quantity * price
                trades.append(Trade(
                    timestamp=timestamp,
                    action='BUY',
                    price=price,
                    quantity=quantity
                ))
                logger.debug(f"BUY {quantity:.4f} @ ${price:.2f}")
                
            elif evaluation.decision == Decision.SELL and position > 0:
                # Exit long position
                capital += position * price
                pnl = (price - trades[-1].price) * position
                trades[-1].pnl = pnl
                trades.append(Trade(
                    timestamp=timestamp,
                    action='SELL',
                    price=price,
                    quantity=position,
                    pnl=pnl
                ))
                logger.debug(f"SELL {position:.4f} @ ${price:.2f}, PnL: ${pnl:.2f}")
                position = 0.0
            
            # Track equity
            current_equity = capital + (position * price if position > 0 else 0)
            equity_curve.append((timestamp, current_equity))
        
        # Close any open position at end
        if position > 0 and price_data:
            final_price = price_data[-1]['price']
            capital += position * final_price
            pnl = (final_price - trades[-1].price) * position
            trades[-1].pnl = pnl
            trades.append(Trade(
                timestamp=price_data[-1]['timestamp'],
                action='SELL',
                price=final_price,
                quantity=position,
                pnl=pnl
            ))
        
        # Calculate metrics
        metrics = self._calculate_metrics(trades, equity_curve, self.initial_capital)
        
        return BacktestResult(
            strategy=strategy_name,
            symbol=symbol,
            start_date=start_date,
            end_date=end_date,
            **metrics,
            trades=trades,
            equity_curve=equity_curve
        )
    
    def _calculate_metrics(
        self,
        trades: List[Trade],
        equity_curve: List[Tuple[datetime, float]],
        initial_capital: float
    ) -> Dict:
        """Calculate performance metrics"""
        if not trades:
            return {
                'total_return': 0.0,
                'max_drawdown': 0.0,
                'sharpe_ratio': 0.0,
                'win_rate': 0.0,
                'total_trades': 0,
                'winning_trades': 0,
                'losing_trades': 0,
                'avg_win': 0.0,
                'avg_loss': 0.0
            }
        
        # Total return
        final_equity = equity_curve[-1][1] if equity_curve else initial_capital
        total_return = ((final_equity - initial_capital) / initial_capital) * 100
        
        # Max drawdown
        peak = initial_capital
        max_dd = 0.0
        for _, equity in equity_curve:
            if equity > peak:
                peak = equity
            dd = ((peak - equity) / peak) * 100
            if dd > max_dd:
                max_dd = dd
        
        # Win rate and average win/loss
        winning_trades = [t for t in trades if t.pnl > 0]
        losing_trades = [t for t in trades if t.pnl < 0]
        
        win_rate = len(winning_trades) / len([t for t in trades if t.action == 'SELL']) if trades else 0.0
        avg_win = np.mean([t.pnl for t in winning_trades]) if winning_trades else 0.0
        avg_loss = np.mean([t.pnl for t in losing_trades]) if losing_trades else 0.0
        
        # Sharpe ratio (simplified)
        if len(equity_curve) > 1:
            returns = [
                (equity_curve[i][1] - equity_curve[i-1][1]) / equity_curve[i-1][1]
                for i in range(1, len(equity_curve))
            ]
            if returns and np.std(returns) > 0:
                sharpe_ratio = (np.mean(returns) / np.std(returns)) * np.sqrt(252)  # Annualized
            else:
                sharpe_ratio = 0.0
        else:
            sharpe_ratio = 0.0
        
        return {
            'total_return': round(total_return, 2),
            'max_drawdown': round(max_dd, 2),
            'sharpe_ratio': round(sharpe_ratio, 2),
            'win_rate': round(win_rate, 2),
            'total_trades': len([t for t in trades if t.action == 'SELL']),
            'winning_trades': len(winning_trades),
            'losing_trades': len(losing_trades),
            'avg_win': round(avg_win, 2),
            'avg_loss': round(avg_loss, 2)
        }
    
    def _generate_mock_price_data(
        self,
        symbol: str,
        start_date: str,
        end_date: str
    ) -> List[Dict]:
        """Generate mock price data for testing"""
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        
        days = (end - start).days
        data = []
        
        # Generate random walk with drift
        np.random.seed(42)  # Reproducible
        base_price = 100.0
        drift = 0.0005  # Slight upward drift
        volatility = 0.02
        
        for i in range(days):
            timestamp = start + timedelta(days=i)
            returns = np.random.normal(drift, volatility)
            base_price *= (1 + returns)
            
            data.append({
                'timestamp': timestamp,
                'price': base_price,
                'volume': np.random.uniform(1000000, 5000000)
            })
        
        return data


# Singleton instance
_backtest_engine: Optional[BacktestEngine] = None


def get_backtest_engine() -> BacktestEngine:
    """Get or create singleton backtest engine"""
    global _backtest_engine
    if _backtest_engine is None:
        _backtest_engine = BacktestEngine()
    return _backtest_engine
