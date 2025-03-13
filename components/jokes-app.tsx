"use client";

import { AnimatePresence } from "framer-motion";
import BackgroundElements from "./background-elements";
import FavoritesTab from "./favorites-tab";
import Header from "./header";
import HistoryTab from "./history-tab";
import SearchForm from "./search-form";
import SearchTab from "./search-tab";
import TabsContainer from "./tabs-container";
import { Toaster } from "./ui/sonner";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRandomJoke } from "@/lib/api";
import RandomJokeModal from "./random-joke-modal";
import { Joke, JokeWithRating } from "@/types/jokes";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";
import AboutModal from "./about-modal";

export default function JokesApp() {
  const [isRandomJokeModalOpen, setIsRandomJokeModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const [ratedJokes, setRatedJokes] = useLocalStorage<JokeWithRating[]>(
    "rated-jokes",
    []
  );

  // Verifica se a API Web Share está disponível
  const isShareAvailable: boolean =
    typeof navigator !== "undefined" &&
    !!navigator.share &&
    !!window.isSecureContext;

  // Garantir que isShareAvailable seja sempre um booleano
  const canShare = !!isShareAvailable;

  // Manipulador para fechar o modal de piada aleatória
  const handleCloseRandomJokeModal = () => {
    setIsRandomJokeModalOpen(false);
  };

  // Atualizar avaliação de uma piada
  const updateJokeRating = useCallback(
    (joke: Joke, rating: number) => {
      const existingIndex = ratedJokes.findIndex((j) => j.id === joke.id);

      if (existingIndex !== -1) {
        // Atualizar piada existente sem alterar o timestamp
        const updatedJokes = [...ratedJokes];
        updatedJokes[existingIndex] = {
          ...updatedJokes[existingIndex],
          rating,
        };
        setRatedJokes(updatedJokes);
      } else if (rating > 0) {
        // Adicionar nova piada apenas se a avaliação for maior que 0
        setRatedJokes([
          ...ratedJokes,
          { ...joke, rating, viewedAt: new Date().toISOString() },
        ]);
      }
    },
    [ratedJokes, setRatedJokes]
  );

  // Função para compartilhar conteúdo
  const shareContent = useCallback(
    async (data: {
      title?: string;
      text?: string;
      url?: string;
    }): Promise<boolean> => {
      if (!isShareAvailable) return false;

      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        // Ignora erros de cancelamento pelo usuário
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Erro ao compartilhar conteúdo:", error);
        }
        return false;
      }
    },
    [isShareAvailable]
  );

  // Manipulador para alteração de classificação
  const handleRatingChange = (joke: Joke, rating: number) => {
    updateJokeRating(joke, rating);
  };

  const closeAboutModal = useCallback(() => {
    setIsAboutModalOpen(false);
  }, []);

  // Função para copiar texto para a área de transferência
  const clipboardCopy = useCallback(async (text: string): Promise<boolean> => {
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
      console.warn("API Clipboard não disponível. Usando método alternativo.");
      return false;
    }
  }, []);

  // Copiar para a área de transferência usando o hook personalizado
  const copyToClipboard = useCallback(
    async (text: string) => {
      const success = await clipboardCopy(text);

      if (success) {
        toast("Copied!", {
          description: "Joke copied to clipboard",
          duration: 2000,
        });
      } else {
        toast("Error", {
          description:
            "Could not copy text. Try using the share option instead.",
          duration: 3000,
        });
      }
    },
    [clipboardCopy]
  );

  // Compartilhar piada usando a API Web Share ou fallback para clipboard
  const shareJoke = useCallback(
    async (joke: Joke) => {
      // Tentar usar a API Web Share se disponível
      if (canShare) {
        const shareData = {
          title: "Chuck Norris Joke",
          text: joke.value,
          url: joke.url || window.location.href,
        };

        const success = await shareContent(shareData);

        if (success) {
          toast("Shared!", {
            description: "Joke shared successfully",
            duration: 2000,
          });
          return;
        }
      }

      // Fallback para clipboard se Web Share não estiver disponível ou falhar
      await copyToClipboard(joke.value);
    },
    [canShare, shareContent, copyToClipboard]
  );

  // Manipulador para compartilhamento de piada
  const handleShare = (joke: Joke) => {
    shareJoke(joke);
  };

  // Obtém a classificação de uma piada
  const getJokeRating = (joke: Joke): number => {
    const ratedJoke = ratedJokes.find((j) => j.id === joke.id);
    return ratedJoke ? ratedJoke.rating : 0;
  };

  // Query para piada aleatória
  const { data: randomJoke } = useQuery({
    queryKey: ["randomJoke"],
    queryFn: fetchRandomJoke,
    enabled: false,
  });

  // Verifica se o modal de piada aleatória deve ser exibido
  const shouldShowRandomJokeModal =
    isRandomJokeModalOpen && randomJoke !== null;

  return (
    <div className="flex flex-col bg-background overflow-x-hidden mt-16">
      <BackgroundElements />

      <Header setIsAboutModalOpen={setIsAboutModalOpen} />

      <div className="flex-grow relative">
        <main className="container mx-auto max-w-4xl px-4 py-6 sm:py-8 relative z-10">
          {/* Título e formulário de pesquisa */}
          <SearchForm />

          {/* Container de abas */}
          <TabsContainer>
            {/* Aba de resultados de pesquisa */}
            <SearchTab />

            {/* Aba de favoritos */}
            <FavoritesTab />

            {/* Aba de histórico */}
            <HistoryTab />
          </TabsContainer>
        </main>

        {/* Modais */}
        <AnimatePresence>
          {shouldShowRandomJokeModal && randomJoke && (
            <RandomJokeModal
              joke={randomJoke}
              rating={getJokeRating(randomJoke)}
              onClose={handleCloseRandomJokeModal}
              onRatingChange={(rating) =>
                handleRatingChange(randomJoke, rating)
              }
              onShare={() => handleShare(randomJoke)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAboutModalOpen && <AboutModal onClose={closeAboutModal} />}
        </AnimatePresence>

        <Toaster />
      </div>
    </div>
  );
}
