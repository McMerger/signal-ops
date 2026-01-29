"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedStars() {
    const starsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (starsRef.current) {
            // Very slow rotation for subtle effect
            starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
            starsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
        }
    });

    return (
        <Stars
            ref={starsRef}
            radius={100}
            depth={50}
            count={3000}
            factor={3}
            saturation={0}
            fade
            speed={1}
        />
    );
}

export function AmbientBackground() {
    return (
        <div className="fixed inset-0 z-[-1] bg-black pointer-events-none">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <color attach="background" args={["#050505"]} /> {/* Very dark grey, not pure black */}
                <ambientLight intensity={0.2} />
                <AnimatedStars />
                {/* Subtle fog to add depth */}
                <fog attach="fog" args={['#050505', 5, 30]} />
            </Canvas>

            {/* Overlay Gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
    );
}
