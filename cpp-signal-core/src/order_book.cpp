#include "signalops/order_book.h"
#include <algorithm>
#include <stdexcept>

namespace signalops {

// OrderBookSide implementation
void OrderBookSide::add_level(double price, double quantity, uint64_t timestamp_ns) {
    PriceLevel level{price, quantity, timestamp_ns};
    
    // Insert in sorted order (descending for bids, ascending for asks)
    auto it = std::lower_bound(levels.begin(), levels.end(), level,
        [](const PriceLevel& a, const PriceLevel& b) {
            return a.price > b.price;  // Descending order
        });
    
    levels.insert(it, level);
}

void OrderBookSide::remove_level(double price) {
    levels.erase(
        std::remove_if(levels.begin(), levels.end(),
            [price](const PriceLevel& level) {
                return level.price == price;
            }),
        levels.end()
    );
}

void OrderBookSide::update_level(double price, double quantity, uint64_t timestamp_ns) {
    if (quantity == 0.0) {
        remove_level(price);
        return;
    }
    
    // Find and update existing level
    auto it = std::find_if(levels.begin(), levels.end(),
        [price](const PriceLevel& level) {
            return level.price == price;
        });
    
    if (it != levels.end()) {
        it->quantity = quantity;
        it->timestamp_ns = timestamp_ns;
    } else {
        add_level(price, quantity, timestamp_ns);
    }
}

PriceLevel OrderBookSide::get_best() const {
    if (levels.empty()) {
        return PriceLevel{0.0, 0.0, 0};
    }
    return levels.front();
}

// OrderBook implementation
OrderBook::OrderBook(const std::string& symbol)
    : symbol_(symbol), last_update_ns_(0) {}

void OrderBook::update_bid(double price, double quantity, uint64_t timestamp_ns) {
    bids_.update_level(price, quantity, timestamp_ns);
    last_update_ns_ = timestamp_ns;
}

void OrderBook::update_ask(double price, double quantity, uint64_t timestamp_ns) {
    asks_.update_level(price, quantity, timestamp_ns);
    last_update_ns_ = timestamp_ns;
}

void OrderBook::clear() {
    bids_.levels.clear();
    asks_.levels.clear();
    last_update_ns_ = 0;
}

double OrderBook::get_mid_price() const {
    double best_bid = get_best_bid();
    double best_ask = get_best_ask();
    
    if (best_bid == 0.0 || best_ask == 0.0) {
        return 0.0;
    }
    
    return (best_bid + best_ask) / 2.0;
}

double OrderBook::get_spread() const {
    double best_bid = get_best_bid();
    double best_ask = get_best_ask();
    
    if (best_bid == 0.0 || best_ask == 0.0) {
        return 0.0;
    }
    
    return best_ask - best_bid;
}

double OrderBook::get_best_bid() const {
    return bids_.get_best().price;
}

double OrderBook::get_best_ask() const {
    return asks_.get_best().price;
}

double OrderBook::get_bid_volume(int depth) const {
    double total = 0.0;
    int count = std::min(depth, static_cast<int>(bids_.levels.size()));
    
    for (int i = 0; i < count; ++i) {
        total += bids_.levels[i].quantity;
    }
    
    return total;
}

double OrderBook::get_ask_volume(int depth) const {
    double total = 0.0;
    int count = std::min(depth, static_cast<int>(asks_.levels.size()));
    
    for (int i = 0; i < count; ++i) {
        total += asks_.levels[i].quantity;
    }
    
    return total;
}

double OrderBook::get_order_imbalance() const {
    double bid_vol = get_bid_volume(10);
    double ask_vol = get_ask_volume(10);
    
    if (bid_vol + ask_vol == 0.0) {
        return 0.0;
    }
    
    return (bid_vol - ask_vol) / (bid_vol + ask_vol);
}

} // namespace signalops
