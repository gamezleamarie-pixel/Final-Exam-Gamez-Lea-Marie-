import { useState, useEffect } from 'react';
export function useTheme() {
  const [theme, setTheme] = useState('earth');
  useEffect(()=> {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return { theme, setTheme };
}
export default useTheme;