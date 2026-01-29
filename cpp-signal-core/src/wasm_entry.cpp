#include <emscripten/bind.h>
#include "signalops/indicators.h"
#include "signalops/order_book.h"

using namespace emscripten;
using namespace signalops;

// Wrapper struct for passing arrays to/from JS
struct MetricsResult {
    double rsi;
    double macd;
    double bb_upper;
    double bb_lower;
};

// Bindings
EMSCRIPTEN_BINDINGS(signal_core) {
    register_vector<double>("VectorDouble");

    class_<Indicators>("Indicators")
        .class_function("calculate_rsi", &Indicators::calculate_rsi)
        .class_function("calculate_sma", &Indicators::calculate_sma)
        .class_function("calculate_ema", &Indicators::calculate_ema);

    class_<OrderBook>("OrderBook")
        .constructor<std::string>()
        .function("update_bid", &OrderBook::update_bid)
        .function("update_ask", &OrderBook::update_ask)
        .function("get_mid_price", &OrderBook::get_mid_price)
        .function("get_spread", &OrderBook::get_spread)
        .function("get_order_imbalance", &OrderBook::get_order_imbalance);
        
    value_object<MetricsResult>("MetricsResult")
        .field("rsi", &MetricsResult::rsi)
        .field("macd", &MetricsResult::macd)
        .field("bb_upper", &MetricsResult::bb_upper)
        .field("bb_lower", &MetricsResult::bb_lower);
}

// Helper function to calculate all metrics in one go (batch processing)
MetricsResult calculate_all_metrics(const std::vector<double>& prices) {
    MetricsResult res = {0, 0, 0, 0};
    
    if (prices.empty()) return res;

    auto rsi_vec = Indicators::calculate_rsi(prices, 14);
    if (!rsi_vec.empty()) res.rsi = rsi_vec.back();

    auto macd_res = Indicators::calculate_macd(prices);
    if (!macd_res.macd_line.empty()) res.macd = macd_res.macd_line.back();

    auto bb_res = Indicators::calculate_bollinger_bands(prices);
    if (!bb_res.upper.empty()) {
        res.bb_upper = bb_res.upper.back();
        res.bb_lower = bb_res.lower.back();
    }

    return res;
}

EMSCRIPTEN_BINDINGS(signal_core_functions) {
    function("calculate_all_metrics", &calculate_all_metrics);
}
