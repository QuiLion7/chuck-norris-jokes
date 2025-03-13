export type JokeCategory =
  | "animal"
  | "career"
  | "celebrity"
  | "dev"
  | "explicit"
  | "fashion"
  | "food"
  | "history"
  | "money"
  | "movie"
  | "music"
  | "political"
  | "religion"
  | "science"
  | "sport"
  | "travel"
  | string; // Para outras categorias não mapeadas

export function getCategoryStyle(category: string): string {
  switch (category.toLowerCase()) {
    case "animal":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-800/20 dark:text-green-300 dark:border-green-800/30 hover:bg-green-200 dark:hover:bg-green-800/30";
    case "career":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-800/20 dark:text-blue-300 dark:border-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-800/30";
    case "celebrity":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-800/20 dark:text-purple-300 dark:border-purple-800/30 hover:bg-purple-200 dark:hover:bg-purple-800/30";
    case "dev":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-300 dark:border-gray-800/30 hover:bg-gray-200 dark:hover:bg-gray-800/30";
    case "explicit":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-800/20 dark:text-red-300 dark:border-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/30";
    case "fashion":
      return "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-800/20 dark:text-pink-300 dark:border-pink-800/30 hover:bg-pink-200 dark:hover:bg-pink-800/30";
    case "food":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-800/20 dark:text-yellow-300 dark:border-yellow-800/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/30";
    case "history":
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-800/20 dark:text-amber-300 dark:border-amber-800/30 hover:bg-amber-200 dark:hover:bg-amber-800/30";
    case "money":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-800/20 dark:text-emerald-300 dark:border-emerald-800/30 hover:bg-emerald-200 dark:hover:bg-emerald-800/30";
    case "movie":
      return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-800/20 dark:text-indigo-300 dark:border-indigo-800/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/30";
    case "music":
      return "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-800/20 dark:text-violet-300 dark:border-violet-800/30 hover:bg-violet-200 dark:hover:bg-violet-800/30";
    case "political":
      return "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-800/20 dark:text-cyan-300 dark:border-cyan-800/30 hover:bg-cyan-200 dark:hover:bg-cyan-800/30";
    case "religion":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-800/20 dark:text-orange-300 dark:border-orange-800/30 hover:bg-orange-200 dark:hover:bg-orange-800/30";
    case "science":
      return "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-800/20 dark:text-sky-300 dark:border-sky-800/30 hover:bg-sky-200 dark:hover:bg-sky-800/30";
    case "sport":
      return "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-800/20 dark:text-lime-300 dark:border-lime-800/30 hover:bg-lime-200 dark:hover:bg-lime-800/30";
    case "travel":
      return "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-800/20 dark:text-teal-300 dark:border-teal-800/30 hover:bg-teal-200 dark:hover:bg-teal-800/30";
    default:
      return "bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 dark:bg-secondary/30 dark:hover:bg-secondary/50";
  }
}
