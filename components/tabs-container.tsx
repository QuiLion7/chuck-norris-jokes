"use client";

import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { tabsContainerContent } from "@/lib/content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { HistoryItem, JokeWithRating } from "@/types/jokes";

interface TabsContainerProps {
  children: ReactNode;
}

export default function TabsContainer({ children }: TabsContainerProps) {
  const [searchHistory] = useLocalStorage<HistoryItem[]>("search-history", []);
  const [ratedJokes] = useLocalStorage<JokeWithRating[]>("rated-jokes", []);

// Estado para contagens para garantir atualizações em tempo real
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);

  const [activeTab, setActiveTab] = useState("search");
// Atualizar contagens sempre que os dados subjacentes forem alterados
  useEffect(() => {
    setFavoritesCount(ratedJokes.filter((j) => j.rating > 0).length);
  }, [ratedJokes]);

  useEffect(() => {
    setHistoryCount(searchHistory.length);
  }, [searchHistory]);

  const childrenArray = React.Children.toArray(children);
  const searchTabContent = childrenArray[0];
  const favoritesTabContent = childrenArray[1];
  const historyTabContent = childrenArray[2];

  const hasFavorites = favoritesCount > 0;
  const hasHistory = historyCount > 0;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="search" className="flex items-center gap-1 sm:gap-2">
          <Search className="h-4 w-4" />
          <span className="text-xs sm:text-sm">{tabsContainerContent.search}</span>
        </TabsTrigger>
        <TabsTrigger value="favorites" className="flex items-center gap-1 sm:gap-2">
          <Star className="h-4 w-4" />
          <span className="text-xs sm:text-sm">{tabsContainerContent.favorites}</span>
          {hasFavorites && (
            <Badge variant="secondary" className="ml-1">
              {favoritesCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-1 sm:gap-2">
          <History className="h-4 w-4" />
          <span className="text-xs sm:text-sm">{tabsContainerContent.history}</span>
          {hasHistory && (
            <Badge variant="secondary" className="ml-1">
              {historyCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="search" className="mt-4">
        {searchTabContent}
      </TabsContent>

      <TabsContent value="favorites" className="mt-4">
        {favoritesTabContent}
      </TabsContent>

      <TabsContent value="history" className="mt-4">
        {historyTabContent}
      </TabsContent>
    </Tabs>
  );
}
