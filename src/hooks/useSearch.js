import { useState, useEffect } from 'react';
export function useSearch(initial='') {
  const [q, setQ] = useState(initial);
  const [debounced, setDebounced] = useState(initial);
  useEffect(()=> {
    const t = setTimeout(()=> setDebounced(q), 350);
    return ()=> clearTimeout(t);
  }, [q]);
  return { q, setQ, debounced };
}
export default useSearch;