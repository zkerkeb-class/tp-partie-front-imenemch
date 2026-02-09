import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Heart, SlidersHorizontal } from 'lucide-react';
import { Pokemon, FilterParams } from '../types';
import { fetchPokemons, searchPokemons, fetchPokemonsByIds, filterPokemons } from '../services/pokemonApi';
import { useFavorites } from '../contexts/FavoritesContext';
import PokemonCard from './PokemonCard';
import PokeFilter from './PokeFilter';

const EMPTY_FILTERS: FilterParams = {};

function isFiltersActive(filters: FilterParams): boolean {
  if (filters.types && filters.types.length > 0) return true;
  const statFields = ['HP', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'] as const;
  for (const stat of statFields) {
    if (filters[`min${stat}` as keyof FilterParams] !== undefined) return true;
    if (filters[`max${stat}` as keyof FilterParams] !== undefined) return true;
  }
  return false;
}

function countActiveFilters(filters: FilterParams): number {
  let count = 0;
  if (filters.types && filters.types.length > 0) count += filters.types.length;
  const statFields = ['HP', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'] as const;
  for (const stat of statFields) {
    if (filters[`min${stat}` as keyof FilterParams] !== undefined) count++;
    if (filters[`max${stat}` as keyof FilterParams] !== undefined) count++;
  }
  return count;
}

const PokemonListPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPage = async (p: number) => {
    setLoading(true);
    try {
      const data = await fetchPokemons(p, 20);
      setPokemons(data.pokemons);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const loadFiltered = async (p: number) => {
    setLoading(true);
    try {
      const data = await filterPokemons({ ...filters, page: p, limit: 20 });
      setPokemons(data.pokemons);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const loadFavorites = async () => {
    const ids = [...favorites];
    if (ids.length === 0) {
      setPokemons([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const results = await fetchPokemonsByIds(ids);
      setPokemons(results);
      setTotalPages(1);
      setPage(1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setIsSearching(false);
      if (isFiltersActive(filters)) {
        loadFiltered(1);
      } else {
        loadPage(1);
      }
      return;
    }
    setIsSearching(true);
    setLoading(true);
    try {
      const results = await searchPokemons(term);
      setPokemons(results);
      setTotalPages(1);
      setPage(1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  useEffect(() => {
    if (showFavoritesOnly) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  // When filters change, reload
  useEffect(() => {
    if (showFavoritesOnly || isSearching) return;
    if (isFiltersActive(filters)) {
      loadFiltered(1);
    } else {
      loadPage(1);
    }
  }, [filters]);

  // When toggling favorites mode
  useEffect(() => {
    if (showFavoritesOnly) {
      setSearchTerm('');
      setIsSearching(false);
      setShowFilters(false);
      setFilters({});
      loadFavorites();
    } else {
      loadPage(1);
    }
  }, [showFavoritesOnly]);

  // Refresh favorites view when favorites set changes
  useEffect(() => {
    if (showFavoritesOnly) {
      loadFavorites();
    }
  }, [favorites]);

  const handleToggleFavorites = () => {
    setShowFavoritesOnly(prev => !prev);
  };

  const handleToggleFilters = () => {
    if (showFavoritesOnly) return;
    setShowFilters(prev => !prev);
  };

  const handleFilterChange = (newFilters: FilterParams) => {
    if (isSearching) {
      setSearchTerm('');
      setIsSearching(false);
    }
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  const handlePageChange = (p: number) => {
    if (isFiltersActive(filters)) {
      loadFiltered(p);
    } else {
      loadPage(p);
    }
  };

  const filterCount = countActiveFilters(filters);

  return (
    <div>
      {/* Search Bar + Toggles */}
      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-3 w-full max-w-2xl">
          <div className="relative group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => {
                if (showFavoritesOnly) setShowFavoritesOnly(false);
                setSearchTerm(e.target.value);
              }}
              className="w-full bg-white border-2 border-black rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-yellow-50 transition-all placeholder:font-bold"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={handleToggleFilters}
            className={`relative p-2 border-2 border-black rounded-md draw-shadow-sm active:translate-y-0.5 active:shadow-none transition-all ${
              showFilters ? 'bg-yellow-400 hover:bg-yellow-300' : 'bg-white hover:bg-yellow-50'
            } ${showFavoritesOnly ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Filters"
            disabled={showFavoritesOnly}
          >
            <SlidersHorizontal size={18} />
            {filterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-black">
                {filterCount}
              </span>
            )}
          </button>

          {/* Favorites toggle */}
          <button
            onClick={handleToggleFavorites}
            className={`p-2 border-2 border-black rounded-md draw-shadow-sm active:translate-y-0.5 active:shadow-none transition-all ${
              showFavoritesOnly ? 'bg-red-100 hover:bg-red-200' : 'bg-white hover:bg-red-50'
            }`}
            title={showFavoritesOnly ? 'Show all' : 'Show favorites'}
          >
            <Heart size={18} className={showFavoritesOnly ? 'fill-red-500 text-red-500' : ''} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && !showFavoritesOnly && (
        <div className="mb-8">
          <PokeFilter filters={filters} onChange={handleFilterChange} onReset={handleFilterReset} />
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center mt-12">
          <div className="text-lg font-bold text-gray-600">Loading...</div>
        </div>
      ) : pokemons.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-400 text-xl font-bold">
            {showFavoritesOnly ? 'No favorite Pokémon yet' : 'No Pokémon found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={() => navigate(`/pokemon/${pokemon.id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isSearching && !showFavoritesOnly && !loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 bg-white border-2 border-black rounded-md px-4 py-2 font-bold text-sm draw-shadow-sm hover:bg-yellow-50 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className="font-bold text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 bg-white border-2 border-black rounded-md px-4 py-2 font-bold text-sm draw-shadow-sm hover:bg-yellow-50 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PokemonListPage;
