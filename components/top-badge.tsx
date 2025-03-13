"use client";

import { motion } from "framer-motion";
import { ThumbsUp } from "lucide-react";

interface TopBadgeProps {
  show: boolean;
}

export function TopBadge({ show }: TopBadgeProps) {
  if (!show) return null;

  return (
    <motion.div
      className="absolute -top-2 -right-2 transform rotate-12"
      initial={{ scale: 0, rotate: 45 }}
      animate={{ scale: 1, rotate: 12 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow">
        <ThumbsUp className="h-3 w-3 inline-block mr-1" />
        Top!
      </span>
    </motion.div>
  );
}
