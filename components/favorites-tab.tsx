"use client";

import { motion } from "framer-motion";
import { Star, Filter, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JokeCard from "@/components/joke-card";
import { favoritesTabContent } from "@/lib/content";
import { Joke, JokeWithRating } from "@/types/jokes";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

export default function FavoritesTab() {
  const [ratedJokes, setRatedJokes] = useLocalStorage<JokeWithRating[]>(
    "rated-jokes",
    []
  );
  const [ratingFilter, setRatingFilter] = useLocalStorage<string>(
    "rating-filter",
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useLocalStorage<string>(
    "category-filter",
    "all"
  );

  const isShareAvailable: boolean =
    typeof navigator !== "undefined" &&
    !!navigator.share &&
    !!window.isSecureContext;

  const canShare = !!isShareAvailable;

  // Filtrar piadas favoritas
  const filteredRatedJokes = useMemo(() => {
    return (
      ratedJokes
        .filter((joke) => {
          const ratingMatch =
            ratingFilter === "all"
              ? joke.rating > 0
              : joke.rating === Number.parseInt(ratingFilter);

          let categoryMatch = true;
          if (categoryFilter === "none") {
            categoryMatch = !joke.categories || joke.categories.length === 0;
          } else if (categoryFilter !== "all") {
            categoryMatch =
              Array.isArray(joke.categories) &&
              joke.categories.includes(categoryFilter);
          }

          return ratingMatch && categoryMatch;
        })
        // Ordenar por data de visualização
        .sort(
          (a, b) =>
            new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
        )
    );
  }, [ratedJokes, ratingFilter, categoryFilter]);

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

  // Remover piada dos favoritos
  const removeFromFavorites = useCallback(
    (jokeId: string) => {
      setRatedJokes(ratedJokes.filter((joke) => joke.id !== jokeId));
      toast("Removed", {
        description: "Joke removed from favorites",
        duration: 2000,
      });
    },
    [ratedJokes, setRatedJokes]
  );

  // Limpar todos os favoritos
  const clearFavorites = useCallback(() => {
    setRatedJokes([]);
    toast("Cleared", {
      description: "All favorites have been cleared",
      duration: 2000,
    });
  }, [setRatedJokes]);

  // Estatísticas para favoritos
  const favoritesStats = useMemo(() => {
    const totalFavorites = ratedJokes.filter((j) => j.rating > 0).length;

    // Contagem por avaliação
    const ratingCounts = [0, 0, 0, 0, 0];
    ratedJokes.forEach((joke) => {
      if (joke.rating > 0) {
        ratingCounts[joke.rating - 1]++;
      }
    });

    // Contagem de categorias
    const categoriesMap = new Map<string, number>();
    let jokesWithoutCategory = 0;

    ratedJokes.forEach((joke) => {
      if (joke.rating > 0) {
        if (!joke.categories || joke.categories.length === 0) {
          jokesWithoutCategory++;
        } else {
          joke.categories.forEach((category) => {
            categoriesMap.set(category, (categoriesMap.get(category) || 0) + 1);
          });
        }
      }
    });

    // Lista de categorias únicas para o filtro
    const uniqueCategories = Array.from(categoriesMap.keys()).sort();

    return {
      totalFavorites,
      ratingCounts,
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
  }, [ratedJokes]);

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

  const hasFavorites = ratedJokes.filter((j) => j.rating > 0).length > 0;
  const hasFilteredFavorites = filteredRatedJokes.length > 0;

  const handleRatingChange = (joke: Joke, rating: number) =>
    updateJokeRating(joke, rating);
  const handleShare = (joke: Joke) => shareJoke(joke);
  const handleRemove = (jokeId: string) => removeFromFavorites(jokeId);

  return (
    <div className="mb-6">
      {hasFavorites && (
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge
              variant="outline"
              className="px-2 py-1 flex items-center gap-1"
            >
              <Star className="h-3 w-3" />
              <span>
                {favoritesStats?.totalFavorites || 0}{" "}
                {favoritesTabContent.favorites}
              </span>
            </Badge>

            {favoritesStats?.categoriesCount > 0 && (
              <Badge
                variant="outline"
                className="px-2 py-1 flex items-center gap-1"
              >
                <Filter className="h-3 w-3" />
                <span>
                  {favoritesStats?.categoriesCount || 0}{" "}
                  {favoritesTabContent.categories}
                </span>
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
        <h3 className="text-lg font-medium flex items-center">
          <Star className="h-5 w-5 mr-2" />
          {favoritesTabContent.favoriteJokes}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={favoritesTabContent.filterByRating} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {favoritesTabContent.allRatings}
                </SelectItem>
                <SelectItem value="5">
                  ⭐⭐⭐⭐⭐ (5 {favoritesTabContent.stars})
                </SelectItem>
                <SelectItem value="4">
                  ⭐⭐⭐⭐ (4 {favoritesTabContent.stars})
                </SelectItem>
                <SelectItem value="3">
                  ⭐⭐⭐ (3 {favoritesTabContent.stars})
                </SelectItem>
                <SelectItem value="2">
                  ⭐⭐ (2 {favoritesTabContent.stars})
                </SelectItem>
                <SelectItem value="1">
                  ⭐ (1 {favoritesTabContent.star})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue
                  placeholder={favoritesTabContent.filterByCategory}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {favoritesTabContent.allCategories}
                </SelectItem>
                <SelectItem value="none">
                  {favoritesTabContent.noCategory}
                </SelectItem>
                {favoritesStats?.uniqueCategories.map((category) => (
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

          {ratedJokes.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={clearFavorites}
              className="text-xs flex items-center gap-1"
            >
              <Trash className="h-3 w-3" />
              {favoritesTabContent.clearFavorites}
            </Button>
          )}
        </div>
      </div>

      {hasFilteredFavorites ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4"
        >
          {filteredRatedJokes.map((joke) => (
            <motion.div
              key={joke.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <JokeCard
                joke={joke}
                rating={joke.rating}
                onRatingChange={(rating) => handleRatingChange(joke, rating)}
                onShare={() => handleShare(joke)}
                onRemove={() => handleRemove(joke.id)}
                showRemoveButton={true}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-12 rounded-lg bg-secondary/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="mb-4 text-6xl">⭐</div>
          <p className="text-xl mb-2">{favoritesTabContent.noFavorites}</p>
          <p className="text-muted-foreground">
            {favoritesTabContent.rateToAdd}
            {ratingFilter !== "all" && (
              <>
                <br />
                {favoritesTabContent.filteringBy} {ratingFilter}{" "}
                {Number.parseInt(ratingFilter) === 1
                  ? favoritesTabContent.star
                  : favoritesTabContent.stars}
                . {favoritesTabContent.tryChangingFilter}
              </>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
