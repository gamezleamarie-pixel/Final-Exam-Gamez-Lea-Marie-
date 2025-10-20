import { useState, useEffect } from 'react';
export function useFetch(fetcher, deps=[]) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try {
        const res = await fetcher();
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError(e);
      } finally { if (mounted) setLoading(false); }
    })();
    return ()=> mounted=false;
  }, deps);
  return { data, loading, error };
}
export default useFetch;