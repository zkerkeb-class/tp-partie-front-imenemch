/**
 * PokeAPI Service
 * Fetches Pokemon data from the PokeAPI including stats, types, abilities
 * API Documentation: https://pokeapi.co/docs/v2
 */

import { PokemonListResult, PokemonDetails } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetches a list of Pokemon names with pagination
 * @param limit - Number of Pokemon to fetch (default: 50)
 * @param offset - Starting position for pagination (default: 0)
 * @returns Array of Pokemon names and URLs
 */
export const fetchPokemonList = async (limit: number = 50, offset: number = 0): Promise<PokemonListResult[]> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Failed to fetch pokemon list');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Fetches detailed Pokemon data including stats, types, and abilities
 * @param nameOrId - Pokemon name (lowercase) or Pokedex ID number
 * @returns Complete Pokemon details or null if not found
 */
export const fetchPokemonDetails = async (nameOrId: string | number): Promise<PokemonDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) throw new Error(`Failed to fetch details for ${nameOrId}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};