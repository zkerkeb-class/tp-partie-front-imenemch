export interface Pokemon {
  _id?: string;
  id: number;
  name: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  };
  type: string[];
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    SpecialAttack: number;
    SpecialDefense: number;
    Speed: number;
  };
  image: string;
}

export interface PokemonListResponse {
  pokemons: Pokemon[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PokemonFormData {
  name: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  };
  type: string[];
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    SpecialAttack: number;
    SpecialDefense: number;
    Speed: number;
  };
  image?: string;
}

export interface PokemonMini {
  id: number;
  name: { english: string };
  type: string[];
  image: string;
}

export interface FilterParams {
  types?: string[];
  minHP?: number;
  maxHP?: number;
  minAttack?: number;
  maxAttack?: number;
  minDefense?: number;
  maxDefense?: number;
  minSpecialAttack?: number;
  maxSpecialAttack?: number;
  minSpecialDefense?: number;
  maxSpecialDefense?: number;
  minSpeed?: number;
  maxSpeed?: number;
  page?: number;
  limit?: number;
}

export const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-stone-400',
  Fire: 'bg-red-500',
  Water: 'bg-blue-500',
  Electric: 'bg-yellow-400',
  Grass: 'bg-green-500',
  Ice: 'bg-cyan-300',
  Fighting: 'bg-red-700',
  Poison: 'bg-purple-500',
  Ground: 'bg-amber-600',
  Flying: 'bg-indigo-400',
  Psychic: 'bg-pink-500',
  Bug: 'bg-lime-500',
  Rock: 'bg-stone-600',
  Ghost: 'bg-violet-700',
  Dragon: 'bg-indigo-700',
  Steel: 'bg-slate-400',
  Dark: 'bg-slate-800',
  Fairy: 'bg-pink-300',
};
