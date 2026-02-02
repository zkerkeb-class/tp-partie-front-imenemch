/**
 * TCGdex API Service
 * Fetches Pokemon Trading Card Game data including series, sets, and card images
 * API Documentation: https://www.tcgdex.net/docs
 */

const BASE_URL = 'https://api.tcgdex.net/v2/en';

export interface TCGSeries {
  id: string;
  name: string;
}

export interface TCGSet {
  id: string;
  name: string;
  cardCount: {
    total: number;
    official: number;
  };
  logo?: string;
  serie: string;
}

export interface TCGCard {
  id: string;
  localId: string;
  name: string;
  image?: string; // Some cards may not have images
  category?: string; // 'Pokémon', 'Trainer', 'Energy', etc.
}

/**
 * Helper to ensure image URL has proper extension for high-quality images
 * TCGdex images work best with /high.webp or /high.jpg suffix
 */
export const getCardImageUrl = (imageUrl: string | undefined): string | undefined => {
  if (!imageUrl) return undefined;
  if (!imageUrl.endsWith('.jpg') && !imageUrl.endsWith('.png') && !imageUrl.endsWith('.webp')) {
    return `${imageUrl}/high.webp`;
  }
  return imageUrl;
};

export interface TCGSetDetail extends TCGSet {
  cards: TCGCard[];
}

export const fetchSeries = async (): Promise<TCGSeries[]> => {
  try {
    const response = await fetch(`${BASE_URL}/series`);
    if (!response.ok) throw new Error('Failed to fetch series');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchSetsBySeries = async (seriesId: string): Promise<TCGSet[]> => {
  try {
    const response = await fetch(`${BASE_URL}/sets?serie=${seriesId}`);
    if (!response.ok) throw new Error('Failed to fetch sets');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchSetDetails = async (setId: string): Promise<TCGSetDetail | null> => {
  try {
    const response = await fetch(`${BASE_URL}/sets/${setId}`);
    if (!response.ok) throw new Error(`Failed to fetch set ${setId}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchAllSets = async (): Promise<TCGSet[]> => {
  try {
    const response = await fetch(`${BASE_URL}/sets`);
    if (!response.ok) throw new Error('Failed to fetch all sets');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
