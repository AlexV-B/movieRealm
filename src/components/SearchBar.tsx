import { useState } from 'react';
import axios from 'axios';
import styles from './searchBar.module.css';

const apiKey = '6079e93c1e108a319ce62e3f8c0a8ac0';

interface SearchBarProps {
    onSearchResults: (results: any[] | null, query: string) => void;
}

const SearchBar = ({ onSearchResults }: SearchBarProps) => {
    const [query, setQuery] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) return;
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=1`
            );
            onSearchResults(response.data.results, query);
        } catch (error) {
            console.error('Ошибка поиска:', error);
        }
    };

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
                onKeyPress={handleKeyPress} // Добавлена поддержка Enter
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
