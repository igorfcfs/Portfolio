import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'theme';

const useTheme = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const nextTheme = prevTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  }, []);

  return [theme, toggleTheme];
};

export default useTheme;
