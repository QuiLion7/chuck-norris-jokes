"use client";

import { Badge } from "@/components/ui/badge";
import { getCategoryStyle } from "@/lib/category-utils";
import { cn } from "@/lib/utils";

interface JokeCategoriesProps {
  categories?: string[];
}

export function JokeCategories({ categories }: JokeCategoriesProps) {
  return (
    <div className="mt-2 sm:mt-3">
      <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Categories:</p>
      <div className="flex flex-wrap gap-1 mt-0.5 sm:mt-1">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className={cn(
                "capitalize text-xs font-medium px-1.5 sm:px-2 py-0.5 max-w-[120px] truncate",
                getCategoryStyle(category)
              )}
            >
              {category}
            </Badge>
          ))
        ) : (
          <Badge variant="outline" className="text-muted-foreground text-xs">
            No category
          </Badge>
        )}
      </div>
    </div>
  );
}
