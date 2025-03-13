"use client";

import { motion } from "framer-motion";

export default function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient blobs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400/10 dark:bg-yellow-400/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-400/10 dark:bg-red-400/5 rounded-full blur-3xl"></div>

      {/* Floating emoji background */}
      <motion.div
        className="absolute top-20 right-10 text-4xl opacity-10 dark:opacity-5"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        🤠
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-10 text-4xl opacity-10 dark:opacity-5"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        💪
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/4 text-4xl opacity-10 dark:opacity-5"
        animate={{
          y: [0, 10, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        🥋
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20 text-4xl opacity-10 dark:opacity-5"
        animate={{
          y: [0, -10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        🤣
      </motion.div>
    </div>
  );
}
