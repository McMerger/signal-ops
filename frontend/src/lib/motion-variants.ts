export const pageVariants = {
    // 1. Home: Solar Precision (The Cover)
    // Effect: Sharp zoom-out reveal, like a lens focusing
    solar: {
        initial: { opacity: 0, scale: 1.05, filter: "blur(4px)" },
        animate: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } // Crisp stop
        },
        exit: { opacity: 0, scale: 0.98, filter: "blur(2px)" }
    },

    // 2. Auth: Cyber (The Stack) -> Retained for Login
    // Effect: Hard cut, glitchy slide
    cyber: {
        initial: { opacity: 0, x: -10, clipPath: "inset(0 100% 0 0)" },
        animate: {
            opacity: 1,
            x: 0,
            clipPath: "inset(0 0% 0 0)",
            transition: { duration: 0.3, ease: "circOut" } // Faster
        },
        exit: { opacity: 0, x: 10, clipPath: "inset(0 0 0 100%)" }
    },

    // 3. Technical (Features/System)
    // Effect: "Heavy Paper" Slide Up. High Friction.
    technical: {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 80, damping: 15, mass: 1.2 } // Heavy feel
        },
        exit: { opacity: 0, y: -10 }
    },

    // 4. Luxury (Pricing/About)
    // Effect: "Cream Card" Reveal. Smooth, elegant, no bounce.
    luxury: {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        },
        exit: { opacity: 0 }
    },

    // 5. Terminal (Docs/Status)
    // Effect: CRT Turn-on vertical stretch
    terminal: {
        initial: { opacity: 0, scaleY: 0.05, transformOrigin: "top" },
        animate: {
            opacity: 1,
            scaleY: 1,
            transition: { duration: 0.25, ease: "linear" }
        },
        exit: { opacity: 0, scaleY: 0.05 }
    }
};

// Micro-interactions
export const buttonPress = {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    press: { scale: 0.95 }
};

export const cardVerify = {
    initial: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    },
    hover: {
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { type: "spring", stiffness: 300 }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};
