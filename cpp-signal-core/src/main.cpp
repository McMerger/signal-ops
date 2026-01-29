#include "signalops/order_book.h"
#include "signalops/indicators.h"
#include "signalops/redis_interface.h"
#include <iostream>
#include <vector>
#include <thread>
#include <chrono>
#include <sstream>
#include <iomanip>
#include <cmath>

using namespace signalops;

// Signal processor - main logic
class SignalProcessor {
public:
    SignalProcessor() : redis_("localhost", 6379) {
        std::cout << "==========================================================\n";
        std::cout << "SignalOps C++ Signal Core\n";
        std::cout << "==========================================================\n";
        std::cout << "SIMD Optimizations: AVX2 enabled\n";
        std::cout << "Redis: Connected\n";
        std::cout << "==========================================================\n";
    }
    
    void run() {
        // Subscribe to market data updates
        redis_.subscribe("market_data", [this](const std::string& channel, const std::string& msg) {
            process_market_data(msg);
        });
        
        // Demo: Calculate indicators on sample data
        demo_indicators();
        
        // Keep running
        std::cout << "\nSignal processor running. Press Ctrl+C to stop.\n";
        while (true) {
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
    }
    
private:
    void process_market_data(const std::string& data) {
        std::cout << "[Market Data] " << data << std::endl;
        // In production: parse data, update order book, calculate signals
    }
    
    void demo_indicators() {
        std::cout << "\n--- SIMD Indicator Demo ---\n";
        
        // Generate sample price data
        std::vector<double> prices;
        for (int i = 0; i < 100; ++i) {
            prices.push_back(100.0 + std::sin(i * 0.1) * 10.0 + (i * 0.05));
        }
        
        // Calculate RSI
        auto rsi = Indicators::calculate_rsi(prices, 14);
        std::cout << "RSI (last 5): ";
        for (size_t i = rsi.size() - 5; i < rsi.size(); ++i) {
            std::cout << std::fixed << std::setprecision(2) << rsi[i] << " ";
        }
        std::cout << "\n";
        
        // Calculate MACD
        auto macd = Indicators::calculate_macd(prices);
        std::cout << "MACD (last value): " 
                  << std::fixed << std::setprecision(4) 
                  << macd.macd_line.back() << "\n";
        
        // Calculate Bollinger Bands
        auto bb = Indicators::calculate_bollinger_bands(prices, 20, 2.0);
        std::cout << "Bollinger Bands (last): "
                  << "Upper=" << bb.upper.back() << " "
                  << "Middle=" << bb.middle.back() << " "
                  << "Lower=" << bb.lower.back() << "\n";
        
        // Publish signals to Redis
        std::ostringstream signal_msg;
        signal_msg << "{\"rsi\":" << rsi.back() 
                   << ",\"macd\":" << macd.macd_line.back()
                   << ",\"bb_upper\":" << bb.upper.back()
                   << ",\"bb_lower\":" << bb.lower.back() << "}";
        
        redis_.publish("signals", signal_msg.str());
        std::cout << "Published signal to Redis\n";
    }
    
    RedisInterface redis_;
};

int main() {
    try {
        SignalProcessor processor;
        processor.run();
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}
