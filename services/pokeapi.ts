import { PokemonListResult, PokemonDetails } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

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