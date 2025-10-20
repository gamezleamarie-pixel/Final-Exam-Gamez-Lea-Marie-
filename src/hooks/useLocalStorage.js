import { useState } from 'react';
export function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch { return initial; }
  });
  const set = (v) => {
    setState(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  };
  return [state, set];
}
export default useLocalStorage;