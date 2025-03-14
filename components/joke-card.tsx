"use client";

import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Copy, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jokeCardContent } from "@/lib/content";
import { JokeCategories } from "./joke-categories";
import RatingStars from "./rating-stars";
import { TopBadge } from "./top-badge";
import { Joke } from "@/types/jokes";
import ShareMenu from "./share-menu";

interface JokeCardProps {
  joke: Joke;
  rating: number;
  highlightTerm?: string;
  onRatingChange: (rating: number) => void;
  onShare: () => void;
  onView?: () => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

// JokeCard - Componente para exibir uma piada com opções de interação
export default function JokeCard({
  joke,
  rating,
  highlightTerm = "",
  onRatingChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onShare,
  onView,
  onRemove,
  showRemoveButton = false,
}: JokeCardProps) {
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

  // Chama onView quando o componente é montado, se fornecido
  useEffect(() => {
    if (onView) {
      onView();
    }
  }, [onView]);

  // Função para processar texto destacado
  const processHighlightedText = (text: string, term: string) => {
    if (!term || term.length < 2) return [{ text, isHighlighted: false }];

    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);

    return parts.map((part) => ({
      text: part,
      isHighlighted: regex.test(part),
    }));
  };

  // Copia o texto da piada para a área de transferência
  const handleCopyToClipboard = () => {
    if (joke.value) {
      copyToClipboard(joke.value);
    }
  };

  // Processa o texto com destaque, se necessário
  const highlightedParts =
    highlightTerm && highlightTerm.length >= 2
      ? processHighlightedText(joke.value, highlightTerm)
      : [{ text: joke.value, isHighlighted: false }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className="w-full"
    >
      <Card className="overflow-hidden relative">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {joke.icon_url && (
              <motion.img
                whileHover={{ rotate: [-5, 5, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                src={joke.icon_url || "/placeholder.svg"}
                alt={
                  jokeCardContent.accessibility?.chuckNorrisImage ||
                  "Chuck Norris image"
                }
                className="w-12 h-12 object-contain mb-2 sm:mb-0"
                loading="lazy"
              />
            )}
            <div className="flex-1 w-full">
              <div className="relative group">
                <p className="text-base sm:text-lg break-words">
                  {highlightedParts.map((part, index) =>
                    part.isHighlighted ? (
                      <motion.span
                        key={index}
                        initial={{ backgroundColor: "rgba(255, 255, 0, 0.3)" }}
                        animate={{ backgroundColor: "rgba(255, 255, 0, 0.6)" }}
                        className="bg-yellow-200 dark:bg-yellow-800 font-medium px-0.5 rounded"
                      >
                        {part.text}
                      </motion.span>
                    ) : (
                      part.text
                    )
                  )}
                </p>

                {/* Exibir categorias */}
                <JokeCategories categories={joke.categories} />

                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground"
                  onClick={handleCopyToClipboard}
                  title={jokeCardContent.copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 pb-4">
          <RatingStars rating={rating} onChange={onRatingChange} />
          <div className="flex flex-wrap gap-2">
            {showRemoveButton && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash className="h-4 w-4 mr-1" />
                <span className="text-sm">{jokeCardContent.removeFromFavorites}</span>
              </Button>
            )}
            <ShareMenu joke={joke} />
          </div>
        </CardFooter>

        {/* Badge de Top para piadas bem avaliadas */}
        <TopBadge show={rating > 4} />
      </Card>
    </motion.div>
  );
}
