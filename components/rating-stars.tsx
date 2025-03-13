"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  onChange: (rating: number) => void;
}

export default function RatingStars({ rating, onChange }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const emojis = ["😐", "🙂", "😊", "😄", "😂"];

  const handleStarClick = (star: number) => {
    onChange(star);
  };

  const handleStarMouseEnter = (star: number) => {
    setHoverRating(star);
  };

  const handleStarMouseLeave = () => {
    setHoverRating(0);
  };

  const isStarActive = (star: number) => {
    return (hoverRating || rating) >= star;
  };

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarMouseEnter(star)}
          onMouseLeave={handleStarMouseLeave}
          title={`${star} ${star === 1 ? "star" : "stars"}`}
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <span
              className={cn(
                "text-2xl transition-opacity",
                isStarActive(star) ? "opacity-100" : "opacity-30"
              )}
            >
              {emojis[star - 1]}
            </span>
          </motion.div>
        </button>
      ))}
    </div>
  );
}
