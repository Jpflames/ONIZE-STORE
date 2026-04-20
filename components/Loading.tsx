"use client";

import { motion } from "motion/react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-background z-200 flex items-center justify-center">
      {/* Subtle radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo word mark */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-4xl font-black tracking-tight text-foreground"
        >
          Tu<span className="text-primary">los</span>
        </motion.div>

        {/* Animated ring stack */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Outer ring */}
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Middle ring */}
          <motion.span
            className="absolute inset-2 rounded-full border-2 border-primary/40"
            animate={{ scale: [1, 1.12, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
          {/* Spinning arc */}
          <motion.span
            className="absolute inset-4 rounded-full border-2 border-transparent border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
          {/* Center dot */}
          <motion.span
            className="w-3 h-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Animated dots tag line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1.5"
        >
          {["L", "o", "a", "d", "i", "n", "g"].map((char, i) => (
            <motion.span
              key={i}
              className="text-xs font-bold tracking-widest text-muted-foreground uppercase"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.08,
                ease: "easeInOut",
              }}
            >
              {char}
            </motion.span>
          ))}
          <motion.span className="flex gap-0.5 ml-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-primary"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.span>
        </motion.div>

        {/* Context message */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed"
        >
          Fetching the best products for you.
          <br />
          <span className="text-xs opacity-60">This only takes a moment.</span>
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;
