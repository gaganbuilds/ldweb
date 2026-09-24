import { useState, useEffect, useCallback } from 'react';

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * A hook to fetch data from Supabase with retries and race-condition prevention.
 * @param {Function} fetchFn - A function that returns a promise (e.g. Supabase query)
 * @param {Array} dependencies - React useEffect dependencies array
 * @param {Object} options - Options for the hook (retries, initialData)
 */
export function useSupabaseQuery(fetchFn, dependencies = [], options = {}) {
  const { retries = 3, initialData = [] } = options;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const executeFetch = useCallback(async (abortSignal) => {
    let attempt = 0;
    
    while (attempt < retries) {
      try {
        if (abortSignal.aborted) return; // Prevent race conditions
        
        const result = await fetchFn();
        
        if (abortSignal.aborted) return;
        
        setData(result || initialData);
        setError(null);
        setLoading(false);
        return; // Success, exit loop
        
      } catch (err) {
        if (abortSignal.aborted) return;
        
        attempt++;
        console.warn(`Supabase fetch failed (Attempt ${attempt}/${retries}):`, err);
        
        if (attempt >= retries) {
          setError(err);
          setLoading(false);
          // Don't overwrite data with empty on error, so fallback UI can use error state
          return;
        }
        
        // Exponential backoff: 1s, 2s, 4s...
        await wait(1000 * Math.pow(2, attempt - 1));
      }
    }
  }, [fetchFn, retries, initialData]);

  useEffect(() => {
    const abortController = new AbortController();
    
    setLoading(true);
    setError(null);
    
    executeFetch(abortController.signal);
    
    return () => {
      abortController.abort(); // Cancel if component unmounts or deps change
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
