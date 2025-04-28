import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './searchBar.module.css';

const apiKey = '6079e93c1e108a319ce62e3f8c0a8ac0';

const SearchBar = ({
  onSearchResults,
  language
}: {
  onSearchResults: (results: any[] | null, query: string) => void;
  language: string;
}) => {
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');

  const handleSearch = async (customQuery?: string) => {
    const searchQuery = (customQuery ?? query).trim();
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&language=${language}&page=1`
      );
      const results = response.data.results;
      onSearchResults(results, searchQuery);
      setLastQuery(searchQuery);     // сохраняем последний выполненный запрос
      setQuery('');                  // очищаем поле ввода
    } catch (error) {
      console.error('Ошибка при поиске:', error);
      onSearchResults(null, searchQuery);
    }
  };

  // 🔁 Повторный поиск при смене языка
  useEffect(() => {
    if (lastQuery.trim()) {
      handleSearch(lastQuery);
    }
  }, [language]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress} // лучше использовать onKeyDown вместо onKeyPress
      />
      <button onClick={() => handleSearch()}>Search</button>
    </div>
  );
};

export default SearchBar;
