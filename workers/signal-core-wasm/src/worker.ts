import SignalCoreModule from './signal_core.js';
import wasmUrl from './signal_core.wasm';

// Initialize the Wasm module once
let signalCoreInstance: any = null;

async function getSignalCore() {
    if (!signalCoreInstance) {
        // Instantiate Wasm
        // Note: Cloudflare Workers handle Wasm imports differently than browser.
        // We typically import the wasm file as a module.
        // However, emscripten output expects to load the wasm binary.
        // This is a simplified glue code.

        // In a real CF Worker with Emscripten, we usually simply import the generated JS
        // and let it handle the instantiation if we bundle the wasm correctly.
        // Or we pass the Wasm Module to the factory.

        signalCoreInstance = await SignalCoreModule({
            locateFile: (path) => {
                if (path.endsWith('.wasm')) return wasmUrl;
                return path;
            }
        });
    }
    return signalCoreInstance;
}

export default {
    async fetch(request: Request, env: any, ctx: any): Promise<Response> {
        const core = await getSignalCore();

        // Example: Call a C++ function exposed via cwrap/ccall
        // Assuming C++ has: int calculate_signal(int market_id)
        // const result = core.ccall('calculate_signal', 'number', ['number'], [101]);

        const url = new URL(request.url);

        if (url.pathname === '/process') {
            const result = "Simulation: C++ Core Processed Signal"; // Replace with actual call
            return new Response(JSON.stringify({ signal: result }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response("Signal Core Wasm Worker Ready");
    }
};
