#pragma once

#include <vector>
#include <cstddef>
#include <immintrin.h>  // AVX2/AVX-512 intrinsics

namespace signalops {

// SIMD-optimized technical indicators
class Indicators {
public:
    // RSI (Relative Strength Index)
    // Uses SIMD for fast moving average calculations
    static std::vector<double> calculate_rsi(
        const std::vector<double>& prices,
        size_t period = 14
    );
    
    // MACD (Moving Average Convergence Divergence)
    // SIMD-optimized exponential moving averages
    struct MACDResult {
        std::vector<double> macd_line;
        std::vector<double> signal_line;
        std::vector<double> histogram;
    };
    
    static MACDResult calculate_macd(
        const std::vector<double>& prices,
        size_t fast_period = 12,
        size_t slow_period = 26,
        size_t signal_period = 9
    );
    
    // Simple Moving Average (SIMD vectorized)
    static std::vector<double> calculate_sma(
        const std::vector<double>& prices,
        size_t period
    );
    
    // Exponential Moving Average (SIMD optimized)
    static std::vector<double> calculate_ema(
        const std::vector<double>& prices,
        size_t period
    );
    
    // Bollinger Bands
    struct BollingerBands {
        std::vector<double> upper;
        std::vector<double> middle;
        std::vector<double> lower;
    };
    
    static BollingerBands calculate_bollinger_bands(
        const std::vector<double>& prices,
        size_t period = 20,
        double num_std_dev = 2.0
    );
    
private:
    // SIMD helper functions
    static double simd_sum(const double* data, size_t size);
    static void simd_multiply_add(
        const double* a,
        const double* b,
        double* result,
        size_t size
    );
    static double simd_std_dev(const double* data, size_t size, double mean);
};

} // namespace signalops
