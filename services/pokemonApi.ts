import { Pokemon, PokemonListResponse, PokemonFormData, PokemonMini, FilterParams } from '../types';

const BASE_URL = '/api/pokemon';

export async function fetchPokemons(page: number = 1, limit: number = 20): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon list');
  return res.json();
}

export async function searchPokemons(name: string): Promise<Pokemon[]> {
  const res = await fetch(`${BASE_URL}/search?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('Failed to search Pokémon');
  return res.json();
}

export async function fetchPokemonById(id: number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Pokémon not found');
  return res.json();
}

export async function createPokemon(data: PokemonFormData): Promise<Pokemon> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create Pokémon');
  return res.json();
}

export async function updatePokemon(id: number, data: PokemonFormData): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update Pokémon');
  return res.json();
}

export async function deletePokemon(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete Pokémon');
}

export async function fetchPokemonsByIds(ids: number[]): Promise<Pokemon[]> {
  if (ids.length === 0) return [];
  const res = await fetch(`${BASE_URL}/by-ids?ids=${ids.join(',')}`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon by IDs');
  return res.json();
}

export async function filterPokemons(params: FilterParams): Promise<PokemonListResponse> {
  const searchParams = new URLSearchParams();
  if (params.types && params.types.length > 0) searchParams.set('types', params.types.join(','));
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const statFields = ['HP', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'] as const;
  for (const stat of statFields) {
    const minVal = params[`min${stat}` as keyof FilterParams];
    const maxVal = params[`max${stat}` as keyof FilterParams];
    if (minVal !== undefined && minVal !== null) searchParams.set(`min${stat}`, String(minVal));
    if (maxVal !== undefined && maxVal !== null) searchParams.set(`max${stat}`, String(maxVal));
  }

  const res = await fetch(`${BASE_URL}/filter?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to filter Pokémon');
  return res.json();
}

export async function fetchAllPokemonMini(): Promise<PokemonMini[]> {
  const res = await fetch(`${BASE_URL}/list-all`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon list');
  return res.json();
}
