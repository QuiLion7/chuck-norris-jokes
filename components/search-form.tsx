"use client";

import { useCallback, useRef, useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Loader2, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchFormContent } from "@/lib/content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchJokes, fetchRandomJoke } from "@/lib/api";
import { toast } from "sonner";
import { HistoryItem } from "@/types/jokes";

interface SearchFormProps {
  onOpenRandomJokeModal: () => void;
  onSearch?: (term: string) => void;
  onHighlightChange?: (highlight: boolean) => void;
}

export default function SearchForm({ 
  onOpenRandomJokeModal, 
  onSearch, 
  onHighlightChange 
}: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightSearch, setHighlightSearch] = useState(true);

  const queryClient = useQueryClient();

  const searchInputRef = useRef<HTMLInputElement>(
    null
  ) as React.RefObject<HTMLInputElement>;

  // Query para buscar piadas
  const { isFetching, refetch: performSearch } = useQuery({
    queryKey: ["jokes", searchTerm],
    queryFn: () => fetchJokes(searchTerm),
    enabled: false, // Para não executar automaticamente
  });

  // Query para piada aleatória
  const { refetch: refetchRandomJoke, isLoading: isRandomLoading } = useQuery({
    queryKey: ["randomJoke"],
    queryFn: fetchRandomJoke,
    enabled: false,
  });

  // Função para buscar piada aleatória
  const handleRandomJoke = useCallback(async () => {
    try {
      const result = await refetchRandomJoke();
      if (result.data) {
        // Atualiza o estado global com a piada aleatória
        queryClient.setQueryData(["randomJoke"], result.data);

        // Chama a função de callback passada como prop
        onOpenRandomJokeModal();
      }
    } catch (error) {
      console.error("Error fetching random joke:", error);
      toast.error("Failed to fetch random joke. Please try again.");
    }
  }, [refetchRandomJoke, queryClient, onOpenRandomJokeModal]);

  const [searchHistory, setSearchHistory] = useLocalStorage<HistoryItem[]>(
    "search-history",
    []
  );

  const [isInputHighlighted, setIsInputHighlighted] = useState(false);

  const addToHistory = useCallback(
    (term: string) => {
      const newSearchTerm = term.trim();
      if (newSearchTerm.length < 3) return;

      const existingTermIndex = searchHistory.findIndex(
        (item) => item.term === newSearchTerm
      );

      if (existingTermIndex === -1) {
        setSearchHistory(
          [
            { term: newSearchTerm, timestamp: new Date().toISOString() },
            ...searchHistory,
          ].slice(0, 10)
        ); // Limit to 10 items
      } else {
        const updatedHistory = [...searchHistory];
        const existingItem = updatedHistory.splice(existingTermIndex, 1)[0];
        existingItem.timestamp = new Date().toISOString();
        setSearchHistory([existingItem, ...updatedHistory]);
      }
    },
    [searchHistory, setSearchHistory]
  );

  // Função para realizar a pesquisa
  const handleSearch = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      if (searchTerm.trim().length >= 3) {
        // Chamar a função de callback passada como prop
        if (onSearch) {
          onSearch(searchTerm.trim());
        }
        
        await performSearch();

        // Mostrar toast de sucesso
        toast("Search completed", {
          description: `Results for "${searchTerm.trim()}"`,
          duration: 3000,
        });
      }
    },
    [searchTerm, performSearch, onSearch]
  );

  const handleSearchWithHistory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await handleSearch(e);

    if (searchTerm.trim().length >= 3) {
      addToHistory(searchTerm.trim());
      setIsInputHighlighted(true);
      setTimeout(() => setIsInputHighlighted(false), 800);
    }
  };

  return (
    <>
      <motion.div
        className="mb-8 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center mb-4">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 1],
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 10,
            }}
          >
            <span className="text-5xl mr-2">😂</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {searchFormContent.title}
          </h1>
        </div>
        <p className="text-muted-foreground">{searchFormContent.subtitle}</p>
      </motion.div>

      <div className="grid gap-6">
        <form
          onSubmit={handleSearchWithHistory}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={searchFormContent.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${
                isInputHighlighted ? "ring-2 ring-primary ring-opacity-50" : ""
              }`}
            />
          </div>
          <div className="flex justify-center sm:justify-start gap-2">
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={searchTerm.length < 3 || isFetching}
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{searchFormContent.searching}</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>{searchFormContent.searchButton}</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleRandomJoke}
              disabled={isRandomLoading}
            >
              {isRandomLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>{searchFormContent.randomJoke}</span>
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">
                    {searchFormContent.searchSettings}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    {searchFormContent.searchSettings}
                  </h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlight-search" className="text-sm">
                      {searchFormContent.highlightSearch}
                    </Label>
                    <Switch
                      id="highlight-search"
                      checked={highlightSearch}
                      onCheckedChange={(checked) => {
                        setHighlightSearch(checked);
                        if (onHighlightChange) {
                          onHighlightChange(checked);
                        }
                      }}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </form>
      </div>
    </>
  );
}
