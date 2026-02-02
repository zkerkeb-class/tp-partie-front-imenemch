/**
 * Pokemon utility functions for handling TCG card variants and names
 */

/**
 * Normalizes Pokemon card names by removing TCG-specific suffixes
 * This ensures that card variants (ex, V, VMAX, etc.) map to the same base Pokemon
 *
 * @param cardName - The card name from TCGdex (e.g., "Charizard ex", "Pikachu VMAX")
 * @returns Normalized lowercase name for PokeAPI (e.g., "charizard", "pikachu")
 *
 * @example
 * normalizePokemonName("Charizard ex") // returns "charizard"
 * normalizePokemonName("Pikachu VMAX") // returns "pikachu"
 * normalizePokemonName("Mewtwo & Mew GX") // returns "mewtwo"
 */
export const normalizePokemonName = (cardName: string): string => {
  return cardName
    // Remove TCG-specific
    .replace(/\s+(ex|EX|V|VMAX|VSTAR|GX|♢ Prism Star|Radiant|Prime|LEGEND|BREAK|Tag Team|&.*)/gi, '')
    .trim()
    .toLowerCase();
};

/**
 * Checks if a card is a Pokemon card (vs Trainer, Energy, etc.)
 *
 * @param category - Card category from TCGdex API
 * @returns true if card is a Pokemon card
 */
export const isPokemonCard = (category?: string): boolean => {
  // Filter OUT known non-Pokemon categories
  // If category is undefined, assume it's a Pokemon card
  if (!category) return true;

  const nonPokemonCategories = ['Trainer', 'Energy', 'trainer', 'energy'];
  return !nonPokemonCategories.includes(category);
};
