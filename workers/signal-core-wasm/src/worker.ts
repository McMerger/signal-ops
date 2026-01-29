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

        if (url.pathname === '/signals') {
            if (request.method !== 'POST') return new Response("Method not allowed", { status: 405 });

            try {
                const body = await request.json() as { prices: number[] };
                if (!body.prices || !Array.isArray(body.prices)) {
                    return new Response("Invalid body", { status: 400 });
                }

                // Bridge to C++ Wasm
                // 1. Create C++ Vector
                const vec = new core.VectorDouble();
                for (const p of body.prices) {
                    vec.push_back(p);
                }

                // 2. Call SIMD-optimized function
                const metrics = core.calculate_all_metrics(vec);

                // 3. Clean up C++ memory
                vec.delete();

                // 4. Return result
                return new Response(JSON.stringify({
                    rsi: metrics.rsi,
                    macd: metrics.macd,
                    bb: {
                        upper: metrics.bb_upper,
                        lower: metrics.bb_lower
                    },
                    source: "C++ (Wasm) + SIMD"
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (e: any) {
                return new Response("Wasm Execution Error: " + e.message, { status: 500 });
            }
        }

        return new Response("Signal Core Wasm Worker Ready (Endpoints: POST /signals)");
    }
};
