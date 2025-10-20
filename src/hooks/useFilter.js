import { useState } from 'react';
export function useFilter(initial={}) {
  const [filters, setFilters] = useState(initial);
  const set = (k,v) => setFilters(prev => ({...prev, [k]:v}));
  const clear = () => setFilters(initial);
  return { filters, set, clear };
}
export default useFilter;