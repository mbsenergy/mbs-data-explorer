import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedFavorites = localStorage.getItem('datasetFavorites');
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, []);

  const toggleFavorite = (tableName: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tableName)) {
        newFavorites.delete(tableName);
      } else {
        newFavorites.add(tableName);
      }
      localStorage.setItem('datasetFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
};