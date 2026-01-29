#include "signalops/indicators.h"
#include <cmath>
#include <algorithm>
#include <numeric>

namespace signalops {

// SIMD helper: Sum array using AVX2
double Indicators::simd_sum(const double* data, size_t size) {
    __m256d sum_vec = _mm256_setzero_pd();
    
    size_t simd_size = size - (size % 4);
    
    // Process 4 doubles at a time
    for (size_t i = 0; i < simd_size; i += 4) {
        __m256d values = _mm256_loadu_pd(&data[i]);
        sum_vec = _mm256_add_pd(sum_vec, values);
    }
    
    // Horizontal sum of vector
    double sum_array[4];
    _mm256_storeu_pd(sum_array, sum_vec);
    double sum = sum_array[0] + sum_array[1] + sum_array[2] + sum_array[3];
    
    // Handle remaining elements
    for (size_t i = simd_size; i < size; ++i) {
        sum += data[i];
    }
    
    return sum;
}

// SIMD helper: Standard deviation
double Indicators::simd_std_dev(const double* data, size_t size, double mean) {
    __m256d mean_vec = _mm256_set1_pd(mean);
    __m256d sum_sq_vec = _mm256_setzero_pd();
    
    size_t simd_size = size - (size % 4);
    
    for (size_t i = 0; i < simd_size; i += 4) {
        __m256d values = _mm256_loadu_pd(&data[i]);
        __m256d diff = _mm256_sub_pd(values, mean_vec);
        __m256d sq = _mm256_mul_pd(diff, diff);
        sum_sq_vec = _mm256_add_pd(sum_sq_vec, sq);
    }
    
    double sum_sq_array[4];
    _mm256_storeu_pd(sum_sq_array, sum_sq_vec);
    double sum_sq = sum_sq_array[0] + sum_sq_array[1] + sum_sq_array[2] + sum_sq_array[3];
    
    // Handle remaining elements
    for (size_t i = simd_size; i < size; ++i) {
        double diff = data[i] - mean;
        sum_sq += diff * diff;
    }
    
    return std::sqrt(sum_sq / size);
}

// Simple Moving Average (SIMD optimized)
std::vector<double> Indicators::calculate_sma(
    const std::vector<double>& prices,
    size_t period
) {
    std::vector<double> sma;
    sma.reserve(prices.size());
    
    if (prices.size() < period) {
        return sma;
    }
    
    // Calculate first SMA
    double sum = simd_sum(prices.data(), period);
    sma.push_back(sum / period);
    
    // Rolling window
    for (size_t i = period; i < prices.size(); ++i) {
        sum = sum - prices[i - period] + prices[i];
        sma.push_back(sum / period);
    }
    
    return sma;
}

// Exponential Moving Average (SIMD optimized)
std::vector<double> Indicators::calculate_ema(
    const std::vector<double>& prices,
    size_t period
) {
    std::vector<double> ema;
    ema.reserve(prices.size());
    
    if (prices.empty()) {
        return ema;
    }
    
    double multiplier = 2.0 / (period + 1.0);
    
    // Start with SMA
    double sum = simd_sum(prices.data(), std::min(period, prices.size()));
    double current_ema = sum / std::min(period, prices.size());
    ema.push_back(current_ema);
    
    // Calculate EMA for remaining values
    for (size_t i = 1; i < prices.size(); ++i) {
        current_ema = (prices[i] - current_ema) * multiplier + current_ema;
        ema.push_back(current_ema);
    }
    
    return ema;
}

// RSI (Relative Strength Index)
std::vector<double> Indicators::calculate_rsi(
    const std::vector<double>& prices,
    size_t period
) {
    std::vector<double> rsi;
    
    if (prices.size() < period + 1) {
        return rsi;
    }
    
    std::vector<double> gains, losses;
    
    // Calculate price changes
    for (size_t i = 1; i < prices.size(); ++i) {
        double change = prices[i] - prices[i - 1];
        gains.push_back(change > 0 ? change : 0);
        losses.push_back(change < 0 ? -change : 0);
    }
    
    // Calculate average gains and losses using EMA
    auto avg_gains = calculate_ema(gains, period);
    auto avg_losses = calculate_ema(losses, period);
    
    // Calculate RSI
    for (size_t i = 0; i < avg_gains.size(); ++i) {
        if (avg_losses[i] == 0) {
            rsi.push_back(100.0);
        } else {
            double rs = avg_gains[i] / avg_losses[i];
            rsi.push_back(100.0 - (100.0 / (1.0 + rs)));
        }
    }
    
    return rsi;
}

// MACD (Moving Average Convergence Divergence)
Indicators::MACDResult Indicators::calculate_macd(
    const std::vector<double>& prices,
    size_t fast_period,
    size_t slow_period,
    size_t signal_period
) {
    MACDResult result;
    
    if (prices.size() < slow_period) {
        return result;
    }
    
    // Calculate fast and slow EMAs
    auto fast_ema = calculate_ema(prices, fast_period);
    auto slow_ema = calculate_ema(prices, slow_period);
    
    // Calculate MACD line
    size_t min_size = std::min(fast_ema.size(), slow_ema.size());
    result.macd_line.reserve(min_size);
    
    for (size_t i = 0; i < min_size; ++i) {
        result.macd_line.push_back(fast_ema[i] - slow_ema[i]);
    }
    
    // Calculate signal line (EMA of MACD)
    result.signal_line = calculate_ema(result.macd_line, signal_period);
    
    // Calculate histogram
    size_t hist_size = std::min(result.macd_line.size(), result.signal_line.size());
    result.histogram.reserve(hist_size);
    
    for (size_t i = 0; i < hist_size; ++i) {
        result.histogram.push_back(result.macd_line[i] - result.signal_line[i]);
    }
    
    return result;
}

// Bollinger Bands
Indicators::BollingerBands Indicators::calculate_bollinger_bands(
    const std::vector<double>& prices,
    size_t period,
    double num_std_dev
) {
    BollingerBands bands;
    
    if (prices.size() < period) {
        return bands;
    }
    
    // Calculate middle band (SMA)
    bands.middle = calculate_sma(prices, period);
    
    // Calculate upper and lower bands
    bands.upper.reserve(bands.middle.size());
    bands.lower.reserve(bands.middle.size());
    
    for (size_t i = 0; i < bands.middle.size(); ++i) {
        size_t start_idx = i;
        double mean = bands.middle[i];
        double std_dev = simd_std_dev(&prices[start_idx], period, mean);
        
        bands.upper.push_back(mean + (num_std_dev * std_dev));
        bands.lower.push_back(mean - (num_std_dev * std_dev));
    }
    
    return bands;
}

} // namespace signalops
