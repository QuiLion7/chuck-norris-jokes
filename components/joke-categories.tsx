"use client";

import { Badge } from "@/components/ui/badge";
import { getCategoryStyle } from "@/lib/category-utils";
import { cn } from "@/lib/utils";

interface JokeCategoriesProps {
  categories?: string[];
}

export function JokeCategories({ categories }: JokeCategoriesProps) {
  return (
    <div className="mt-3">
      <p className="text-sm text-muted-foreground mb-1">Categories:</p>
      <div className="flex flex-wrap gap-1 mt-1">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
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
