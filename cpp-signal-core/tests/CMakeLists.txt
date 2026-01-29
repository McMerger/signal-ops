# Placeholder CMakeLists for tests
cmake_minimum_required(VERSION 3.20)

# Add test executable (placeholder)
add_executable(test_indicators ../src/indicators.cpp)
target_include_directories(test_indicators PRIVATE ../include)
