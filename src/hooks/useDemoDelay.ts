import { useState, useEffect } from 'react';

export function useDemoDelay(ms = 800): boolean {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loaded;
}
