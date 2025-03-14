"use client";

import { motion } from "framer-motion";
import { History, Trash, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { historyTabContent } from "@/lib/content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { HistoryItem } from "@/types/jokes";
import { useCallback, useRef } from "react";

interface HistoryTabProps {
  onSearchFromHistory?: (term: string) => void;
}

export default function HistoryTab({ onSearchFromHistory }: HistoryTabProps) {
  const [searchHistory, setSearchHistory] = useLocalStorage<HistoryItem[]>(
    "search-history",
    []
  );
  const searchInputRef = useRef<HTMLInputElement>(
    null
  ) as React.RefObject<HTMLInputElement>;

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  const searchFromHistory = useCallback((term: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = term;
      searchInputRef.current.focus();
    }

    if (onSearchFromHistory) {
      onSearchFromHistory(term);
    }
  }, [onSearchFromHistory]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <History className="h-5 w-5 mr-2" />
          {historyTabContent.searchHistory}
        </h3>
        {searchHistory.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={clearHistory}
            className="text-xs flex items-center gap-1"
          >
            <Trash className="h-3 w-3" />
            {historyTabContent.clearHistory}
          </Button>
        )}
      </div>
      {searchHistory.length > 0 ? (
        <motion.div
          className="grid gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {searchHistory.map((item, index) => (
            <motion.div
              key={`${item.term}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.01 }}
              className="bg-secondary/30 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex-1">
                <div className="font-medium">{item.term}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <History className="h-3 w-3" />
                  {historyTabContent.searchedOn} {formatDate(item.timestamp)}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => searchFromHistory(item.term)}
                className="flex items-center gap-1"
              >
                <Search className="h-3 w-3" />
                {historyTabContent.searchButton}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-12 rounded-lg bg-secondary/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="mb-4 text-5xl">📝</div>
          <p className="text-muted-foreground">
            {historyTabContent.noSearchesYet}
            <br />
            {historyTabContent.searchesWillAppear}
          </p>
        </motion.div>
      )}
    </div>
  );
}
