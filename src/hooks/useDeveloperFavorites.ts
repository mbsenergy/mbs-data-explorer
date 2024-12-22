import { useState, useEffect } from 'react';

export const useDeveloperFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedFavorites = localStorage.getItem('developerFavorites');
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, []);

  const toggleFavorite = (fileName: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(fileName)) {
        newFavorites.delete(fileName);
      } else {
        newFavorites.add(fileName);
      }
      localStorage.setItem('developerFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
};