# Signal Core Wasm Worker

This worker runs the C++ Signal Engine using WebAssembly.

## Build Instructions (Emscripten)

1. Ensure you have `emcc` (Emscripten) installed.
2. Run the build script:

```bash
emcc ../../cpp-signal-core/src/*.cpp -o build/worker.js -s WASM=1 -s MODULARIZE=1
```

## Structure

- The C++ source is in `../../cpp-signal-core/src`
- The Wasm binary is loaded by `worker.js`
