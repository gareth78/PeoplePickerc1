import { useState, useCallback } from 'react';
import { User, PeopleSearchResult } from '../types';

export function usePeopleSearch() {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const search = useCallback(async (query: string, cursor?: string) => {
    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      setNextCursor(null);
      return;
    }

    setLoading(true);
    setError(null);

    const abortController = new AbortController();

    const params = new URLSearchParams({ query });
    if (cursor) {
      params.append('cursor', cursor);
    }

    const url = `/api/people?${params.toString()}`;

    try {
      const response = await fetch(url, { signal: abortController.signal });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const result = await response.json();

      if (result.ok) {
        if (cursor) {
          setResults((prev) => [...prev, ...result.data.items]);
        } else {
          setResults(result.data.items);
        }
        setNextCursor(result.data.nextCursor);
      } else {
        setError(result.error || 'Search failed');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }

    return () => {
      abortController.abort();
    };
  }, []);

  const reset = useCallback(() => {
    setResults([]);
    setLoading(false);
    setError(null);
    setNextCursor(null);
  }, []);

  return {
    results,
    loading,
    error,
    nextCursor,
    search,
    reset,
  };
}
