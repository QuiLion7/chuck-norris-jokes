export interface Joke {
  id: string;
  value: string;
  icon_url: string;
  url: string;
  created_at?: string;
  updated_at?: string;
  categories?: string[];
}

export interface JokeWithRating extends Joke {
  rating: number;
  viewedAt: string;
}

export interface SearchResponse {
  total: number;
  result: Joke[];
}

export interface HistoryItem {
  term: string;
  timestamp: string;
}
