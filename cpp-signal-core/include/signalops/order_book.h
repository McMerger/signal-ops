#pragma once

#include <cstdint>
#include <string>
#include <vector>
#include <map>

namespace signalops {

// Price level in order book
struct PriceLevel {
    double price;
    double quantity;
    uint64_t timestamp_ns;
};

// Order book side (bids or asks)
struct OrderBookSide {
    std::vector<PriceLevel> levels;
    
    void add_level(double price, double quantity, uint64_t timestamp_ns);
    void remove_level(double price);
    void update_level(double price, double quantity, uint64_t timestamp_ns);
    PriceLevel get_best() const;
};

// Full order book (L2 data)
class OrderBook {
public:
    OrderBook(const std::string& symbol);
    
    // Update methods
    void update_bid(double price, double quantity, uint64_t timestamp_ns);
    void update_ask(double price, double quantity, uint64_t timestamp_ns);
    void clear();
    
    // Query methods
    double get_mid_price() const;
    double get_spread() const;
    double get_best_bid() const;
    double get_best_ask() const;
    double get_bid_volume(int depth = 10) const;
    double get_ask_volume(int depth = 10) const;
    
    // Imbalance calculation
    double get_order_imbalance() const;
    
    const std::string& symbol() const { return symbol_; }
    uint64_t last_update_ns() const { return last_update_ns_; }
    
private:
    std::string symbol_;
    OrderBookSide bids_;
    OrderBookSide asks_;
    uint64_t last_update_ns_;
};

} // namespace signalops
