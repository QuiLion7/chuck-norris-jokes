import { Joke, SearchResponse } from "@/types/jokes";

const API_BASE_URL = "https://api.chucknorris.io/jokes";

export async function fetchRandomJoke(): Promise<Joke> {
  const response = await fetch(`${API_BASE_URL}/random`);

  if (!response.ok) {
    throw new Error("Failed to fetch random joke");
  }

  return response.json();
}

export async function fetchJokes(query: string): Promise<SearchResponse> {
  if (!query || query.length < 3) {
    return { total: 0, result: [] };
  }

  const response = await fetch(
    `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      return { total: 0, result: [] };
    }
    throw new Error("Failed to fetch jokes");
  }

  return response.json();
}

export async function fetchJokesByCategory(category: string): Promise<Joke> {
  const response = await fetch(
    `${API_BASE_URL}/random?category=${encodeURIComponent(category)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch joke by category");
  }

  return response.json();
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}
