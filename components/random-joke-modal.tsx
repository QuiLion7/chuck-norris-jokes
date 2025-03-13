"use client";

import { motion } from "framer-motion";
import { X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/rating-stars";
import { Badge } from "@/components/ui/badge";
import ShareMenu from "@/components/share-menu";
import { useRef, useEffect, useCallback } from "react";
import { randomJokeContent as t } from "@/lib/content";
import { getCategoryStyle } from "@/lib/category-utils";
import { cn } from "@/lib/utils";
import { Joke } from "@/types/jokes";

interface RandomJokeModalProps {
  joke: Joke;
  rating: number;
  onClose: () => void;
  onRatingChange: (rating: number) => void;
  onShare: () => void;
}

export default function RandomJokeModal({
  joke,
  rating,
  onClose,
  onRatingChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onShare,
}: RandomJokeModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const jokeTextRef = useRef<HTMLParagraphElement>(null);

  // Função para copiar texto para a área de transferência
  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      // Verifica se a API Clipboard está disponível
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (error) {
          console.error("Erro ao copiar para a área de transferência:", error);
          return false;
        }
      } else {
        // Fallback para navegadores que não suportam a API Clipboard
        // Nota: Este método não manipula diretamente o DOM
        console.warn(
          "API Clipboard não disponível. Usando método alternativo."
        );
        return false;
      }
    },
    []
  );

  const handleCopyToClipboard = () => {
    if (joke.value) {
      copyToClipboard(joke.value);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  // Configurar fechamento ao pressionar ESC
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  // Animações simplificadas
  const animations = {
    container: {
      hidden: { scale: 0.9, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 },
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
  };

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        variants={animations.container}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-background rounded-xl shadow-lg max-w-lg w-full overflow-hidden relative"
      >
        <motion.div
          className="absolute -top-6 -right-6 rotate-12 text-4xl"
          initial={{ rotate: 45, scale: 0 }}
          animate={{ rotate: 12, scale: 1 }}
          transition={{
            type: "spring",
            damping: 10,
            stiffness: 100,
            delay: 0.5,
          }}
        >
          🤣
        </motion.div>

        <div className="flex justify-between items-center p-4 border-b">
          <motion.h2
            variants={animations.item}
            className="text-xl font-bold flex items-center"
          >
            <span className="mr-2">🎲</span> {t.title}
          </motion.h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <motion.div
            className="flex items-center justify-center mb-6"
            variants={animations.item}
          >
            {joke.icon_url && (
              <motion.img
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 },
                }}
                src={joke.icon_url}
                alt={t.accessibility?.chuckNorrisImage || "Chuck Norris"}
                className="w-24 h-24 object-contain"
              />
            )}
          </motion.div>

          <motion.div
            variants={animations.item}
            className="relative bg-secondary/50 p-5 rounded-lg mb-6"
          >
            <motion.p
              ref={jokeTextRef}
              className="text-xl text-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {joke.value}
            </motion.p>

            {/* Exibir categorias com título */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                {t.categories}
              </p>
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {joke.categories && joke.categories.length > 0 ? (
                  joke.categories.map(
                    (category: string) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className={cn(
                          "capitalize text-xs font-medium px-2 py-0.5",
                          getCategoryStyle(category)
                        )}
                      >
                        {category}
                      </Badge>
                    )

                    //   <CategoryBadge key={category} category={category} />
                  )
                ) : (
                  <Badge
                    variant="outline"
                    className="text-muted-foreground text-xs"
                  >
                    {t.noCategory}
                  </Badge>
                )}
              </div>
            </div>

            <motion.button
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-1 rounded-full"
              onClick={handleCopyToClipboard}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={t.copy}
            >
              <Copy className="h-4 w-4" />
            </motion.button>
          </motion.div>

          <motion.div
            variants={animations.item}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <RatingStars rating={rating} onChange={onRatingChange} />
            <div className="flex gap-2">
              <ShareMenu joke={joke} variant="outline" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
