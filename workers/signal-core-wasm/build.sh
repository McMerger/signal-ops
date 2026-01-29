#!/bin/bash
# Build script for Signal Core Wasm

# Check for emcc
if ! command -v emcc &> /dev/null; then
    echo "Error: emcc (Emscripten) not found. Please install Emscripten SDK."
    echo "Visit: https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

mkdir -p build

echo "Compiling C++ signal core to Wasm..."

# Compass C++ source files to Wasm
# -s WASM=1: Output wasm
# -s MODULARIZE=1: Wrap in a module function
# -s EXPORT_NAME='SignalCore': Name of the module
# -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap']: Allow JS to call C++ functions
emcc ../../cpp-signal-core/src/*.cpp \
    -o build/signal_core.js \
    -s WASM=1 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME='SignalCore' \
    -s "EXPORTED_RUNTIME_METHODS=['ccall','cwrap']" \
    -I ../../cpp-signal-core/include \
    -O3

echo "Build complete: build/signal_core.js + build/signal_core.wasm"
