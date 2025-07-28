import { useState, useEffect, useCallback } from "react";

export function useDebouncedSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      if (searchQuery.length < 2) {
        setResults([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await searchFn(searchQuery);
        setResults(searchResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [searchFn]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(query);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay, debouncedSearch]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
}
