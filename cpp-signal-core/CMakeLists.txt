cmake_minimum_required(VERSION 3.20)
project(SignalOpsCore VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Enable optimizations and SIMD
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

set(CMAKE_CXX_FLAGS_RELEASE "-O3 -march=native -mavx2 -mfma")
set(CMAKE_CXX_FLAGS_DEBUG "-g -O0")

# Find dependencies
find_package(Threads REQUIRED)

# hiredis for Redis
find_library(HIREDIS_LIB hiredis)
if(NOT HIREDIS_LIB)
    message(STATUS "hiredis not found, will use header-only fallback")
endif()

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/include)

# Source files
set(SOURCES
    src/order_book.cpp
    src/indicators.cpp
    src/signal_processor.cpp
    src/redis_interface.cpp
)

# Create library
add_library(signalops_core STATIC ${SOURCES})
target_link_libraries(signalops_core PRIVATE Threads::Threads)

if(HIREDIS_LIB)
    target_link_libraries(signalops_core PRIVATE ${HIREDIS_LIB})
    target_compile_definitions(signalops_core PRIVATE HAS_HIREDIS)
endif()

# Create executable
add_executable(signal_core src/main.cpp)
target_link_libraries(signal_core PRIVATE signalops_core)

# Install targets
install(TARGETS signal_core DESTINATION bin)
install(TARGETS signalops_core DESTINATION lib)
install(DIRECTORY include/ DESTINATION include)

# Enable testing
enable_testing()
add_subdirectory(tests EXCLUDE_FROM_ALL)

# ==========================================
# Wasm / Emscripten Build Target
# ==========================================
if(EMSCRIPTEN)
    add_executable(signal_core_wasm 
        src/wasm_entry.cpp
        src/indicators.cpp
        src/order_book.cpp
    )

    # Compile options for Wasm
    target_compile_options(signal_core_wasm PRIVATE -O3 -msimd128)
    
    # Link options (Modularize for JS consumption)
    target_link_options(signal_core_wasm PRIVATE
        -s "EXPORTED_RUNTIME_METHODS=['ccall','cwrap']"
        -s "MODULARIZE=1"
        -s "EXPORT_NAME='SignalCore'"
        -s "ALLOW_MEMORY_GROWTH=1"
        --bind
    )
    
    target_link_libraries(signal_core_wasm PRIVATE signalops_core)
endif()
