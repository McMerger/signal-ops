#pragma once

#include <string>
#include <functional>
#include <memory>

namespace signalops {

// Redis interface for pub/sub communication
class RedisInterface {
public:
    using MessageCallback = std::function<void(const std::string& channel, const std::string& message)>;
    
    RedisInterface(const std::string& host = "localhost", int port = 6379);
    ~RedisInterface();
    
    // Publishing
    bool publish(const std::string& channel, const std::string& message);
    
    // Subscribing
    bool subscribe(const std::string& channel, MessageCallback callback);
    bool unsubscribe(const std::string& channel);
    
    // Key-value operations
    bool set(const std::string& key, const std::string& value);
    std::string get(const std::string& key);
    
    // Connection management
    bool connect();
    void disconnect();
    bool is_connected() const;
    
private:
    struct Impl;
    std::unique_ptr<Impl> pimpl_;
};

} // namespace signalops
