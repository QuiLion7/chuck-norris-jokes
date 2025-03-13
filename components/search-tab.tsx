"use client";

import { motion } from "framer-motion";
import { ThumbsUp, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchTabContent } from "@/lib/content";
import { Joke, JokeWithRating } from "@/types/jokes";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJokes } from "@/lib/api";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";
import JokeCard from "./joke-card";

export default function SearchTab() {
  const lastSearchTerm = useState("")[0];
  const searchTerm = useState("")[0];
  const highlightSearch = useState(true)[0];
  const [searchResultsCategoryFilter, setSearchResultsCategoryFilter] =
    useState("all");

  const isShareAvailable: boolean =
    typeof navigator !== "undefined" &&
    !!navigator.share &&
    !!window.isSecureContext;

  // Garantir que isShareAvailable seja sempre um booleano
  const canShare = !!isShareAvailable;

  const [ratedJokes, setRatedJokes] = useLocalStorage<JokeWithRating[]>(
    "rated-jokes",
    []
  );

  // Query para buscar piadas
  const {
    data: searchResults,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["jokes", searchTerm],
    queryFn: () => fetchJokes(searchTerm),
    enabled: false, // Não executa automaticamente
  });

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

  const searchStats = useMemo(() => {
    if (!searchResults?.result) return null;

    const totalJokes = searchResults.result.length;

    // Contagem de categorias
    const categoriesMap = new Map<string, number>();
    let jokesWithoutCategory = 0;

    searchResults.result.forEach((joke) => {
      if (!joke.categories || joke.categories.length === 0) {
        jokesWithoutCategory++;
      } else {
        joke.categories.forEach((category) => {
          categoriesMap.set(category, (categoriesMap.get(category) || 0) + 1);
        });
      }
    });

    // Lista de categorias únicas para o filtro
    const uniqueCategories = Array.from(categoriesMap.keys()).sort();

    return {
      totalJokes,
      categoriesCount: categoriesMap.size,
      jokesWithoutCategory,
      categoriesDistribution: Array.from(categoriesMap.entries()).map(
        ([category, count]) => ({
          category,
          count,
        })
      ),
      uniqueCategories,
    };
  }, [searchResults]);

  // Filtrar resultados de pesquisa por categoria
  const filteredSearchResults = useMemo(() => {
    if (!searchResults?.result) return [];

    if (searchResultsCategoryFilter === "all") {
      return searchResults.result;
    } else if (searchResultsCategoryFilter === "none") {
      return searchResults.result.filter(
        (joke) => !joke.categories || joke.categories.length === 0
      );
    } else {
      return searchResults.result.filter(
        (joke) =>
          joke.categories &&
          joke.categories.includes(searchResultsCategoryFilter)
      );
    }
  }, [searchResults, searchResultsCategoryFilter]);

  //   const { ratedJokes, updateJokeRating, shareJoke } = useFavorites();

  const hasNoSearchTerm = !lastSearchTerm;
  const isLoadingResults = isLoading || isFetching;
  const hasSearchResults =
    searchResults?.result && searchResults.result.length > 0;
  const hasFilteredResults = filteredSearchResults.length > 0;

  const getJokeRating = (joke: Joke): number => {
    const ratedJoke = ratedJokes.find((j) => j.id === joke.id);
    return ratedJoke ? ratedJoke.rating : 0;
  };

  const handleRatingChange = (joke: Joke, rating: number) => {
    updateJokeRating(joke, rating);
  };

  const handleShare = (joke: Joke) => {
    shareJoke(joke);
  };

  if (hasNoSearchTerm) {
    return (
      <motion.div
        className="text-center py-12 rounded-lg bg-secondary/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-2 text-6xl">🔍</div>
        <p className="text-muted-foreground">{searchTabContent.searchPrompt}</p>
      </motion.div>
    );
  }

  if (isLoadingResults) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (hasSearchResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Estatísticas e filtros */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="px-2 py-1 flex items-center gap-1"
              >
                <ThumbsUp className="h-3 w-3" />
                <span>
                  {searchStats?.totalJokes || 0} {searchTabContent.jokesCount}
                </span>
              </Badge>

              {searchStats?.categoriesCount &&
                searchStats.categoriesCount > 0 && (
                  <Badge
                    variant="outline"
                    className="px-2 py-1 flex items-center gap-1"
                  >
                    <Filter className="h-3 w-3" />
                    <span>
                      {searchStats.categoriesCount}{" "}
                      {searchTabContent.categoriesCount}
                    </span>
                  </Badge>
                )}
            </div>

            {/* Filtro de categoria */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={searchResultsCategoryFilter}
                onValueChange={setSearchResultsCategoryFilter}
              >
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue
                    placeholder={searchTabContent.filterByCategory}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {searchTabContent.allCategories}
                  </SelectItem>
                  <SelectItem value="none">
                    {searchTabContent.noCategory}
                  </SelectItem>
                  {searchStats?.uniqueCategories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="capitalize"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Lista de piadas filtradas */}
        {hasFilteredResults ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid gap-4"
          >
            {filteredSearchResults.map((joke) => {
              const rating = getJokeRating(joke);

              return (
                <motion.div
                  key={joke.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <JokeCard
                    joke={joke}
                    rating={rating}
                    highlightTerm={highlightSearch ? searchTerm : ""}
                    onRatingChange={(rating) =>
                      handleRatingChange(joke, rating)
                    }
                    onShare={() => handleShare(joke)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12 rounded-lg bg-secondary/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 text-6xl">🤔</div>
            <p className="text-xl mb-2">{searchTabContent.noResults}</p>
            <p className="text-muted-foreground">
              {searchTabContent.tryChangingFilter}
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="text-center py-12 rounded-lg bg-secondary/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 text-6xl">🤔</div>
      <p className="text-xl mb-2">{searchTabContent.noJokesFound}</p>
      <p className="text-muted-foreground">
        {searchTabContent.tryAnotherTerm} &quot;{lastSearchTerm}&quot;.{" "}
        {searchTabContent.tryAnother}
      </p>
    </motion.div>
  );
}
