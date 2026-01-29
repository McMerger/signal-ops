"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// --- Abstract Fluid Shader ---
// Creates a smooth, premium, "liquid light" effect
const fluidVertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;

  // Simplex noise function (simplified)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Slow, large waves
    float noiseFreq = 1.5;
    float noiseAmp = 0.5;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime * 0.2, pos.y * noiseFreq + uTime * 0.2, uTime * 0.2);
    
    float elevation = snoise(pos.xy * 0.5 + uTime * 0.1) * 0.5;
    elevation += snoise(pos.xy * 1.0 - uTime * 0.2) * 0.2;
    
    pos.z += elevation;
    vElevation = elevation;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fluidFragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  
  void main() {
    // Premium Color Palette: Deep Blue, Purple, Cyan, Black
    vec3 colorA = vec3(0.05, 0.05, 0.1); // Deep Dark Blue
    vec3 colorB = vec3(0.1, 0.4, 0.8);   // Royal Blue
    vec3 colorC = vec3(0.0, 0.8, 0.9);   // Cyan Highlight
    vec3 colorD = vec3(0.5, 0.0, 0.5);   // Deep Purple
    
    float mixStrength = vElevation * 2.0 + 0.5;
    
    vec3 color = mix(colorA, colorB, smoothstep(-0.5, 0.2, vElevation));
    color = mix(color, colorC, smoothstep(0.2, 0.6, vElevation));
    color = mix(color, colorD, smoothstep(0.6, 1.0, vElevation));
    
    // Add subtle grain/noise for texture
    float grain = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
    color += grain * 0.05;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function FluidBackground() {
    const mesh = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
    }), []);

    useFrame((state) => {
        if (mesh.current) {
            (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={mesh} rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, -2]}>
            <planeGeometry args={[10, 10, 128, 128]} />
            <shaderMaterial
                vertexShader={fluidVertexShader}
                fragmentShader={fluidFragmentShader}
                uniforms={uniforms}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

export function HeroSection({ onEnter }: { onEnter?: () => void }) {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Abstract Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                    <FluidBackground />
                </Canvas>
            </div>

            {/* Minimalist Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <h1 className="text-7xl font-light tracking-tighter text-white md:text-9xl mix-blend-overlay opacity-90">
                        SignalOps
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="mt-12"
                >
                    <button
                        onClick={onEnter}
                        className="group relative overflow-hidden rounded-full bg-white/10 px-8 py-3 backdrop-blur-md transition-all duration-500 hover:bg-white/20 ring-1 ring-white/20 hover:ring-white/40"
                    >
                        <span className="relative z-10 text-sm font-medium tracking-[0.2em] text-white uppercase">
                            Enter Experience
                        </span>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
