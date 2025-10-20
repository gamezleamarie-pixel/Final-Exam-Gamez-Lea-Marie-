import { useState, useCallback } from 'react';
export function useLoading() {
  const [loading,setLoading] = useState(false);
  const wrap = useCallback(async (fn) => {
    setLoading(true);
    try { return await fn(); } finally { setLoading(false); }
  }, []);
  return { loading, setLoading, wrap };
}
export default useLoading;