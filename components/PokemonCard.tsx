import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Pokemon, TYPE_COLORS } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(pokemon.id);

  const primaryType = pokemon.type[0] || 'Normal';
  const typeColor = TYPE_COLORS[primaryType] || 'bg-stone-400';

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      {/* TCG Card Style */}
      <div className="relative bg-white rounded-xl overflow-hidden" style={{ aspectRatio: '2.5/3.5' }}>
        {/* Yellow TCG Border */}
        <div className="absolute inset-0 bg-yellow-400 rounded-xl"></div>

        {/* Inner Card */}
        <div className="absolute inset-1 bg-white rounded-lg overflow-hidden border-2 border-black">
          {/* Header */}
          <div className="bg-white px-2 py-1 border-b-2 border-black flex items-center justify-between">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-black uppercase truncate">{pokemon.name.english}</h2>
              <div className={`w-4 h-4 rounded-full border border-black ${typeColor} flex-shrink-0`}></div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(pokemon.id); }}
                className="hover:scale-125 transition-transform"
                title={fav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={14} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
              </button>
              <span className="text-xs font-bold">HP</span>
              <span className="text-sm font-black text-red-600">{pokemon.base.HP}</span>
            </div>
          </div>

          {/* Image Section */}
          <div className={`${typeColor} border-b-2 border-black relative`} style={{ height: '40%' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              {!imageLoaded && !imageError && (
                <div className="w-20 h-20 bg-white/30 rounded-full animate-pulse" />
              )}
              {imageError ? (
                <div className="text-white text-xs font-bold text-center px-2">No image</div>
              ) : (
                <img
                  src={pokemon.image}
                  alt={pokemon.name.english}
                  className={`w-20 h-20 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    // Fallback to PokeAPI artwork
                    const img = e.target as HTMLImageElement;
                    if (!img.src.includes('raw.githubusercontent.com')) {
                      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
                    } else {
                      setImageError(true);
                    }
                  }}
                  loading="lazy"
                />
              )}
            </div>
          </div>

          {/* Type Badge */}
          <div className="bg-gray-100 px-2 py-0.5 border-b-2 border-black">
            <span className="text-xs font-bold uppercase">{primaryType} Pokémon</span>
          </div>

          {/* Stats Preview */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className={`w-4 h-4 rounded-full border border-black ${typeColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xs font-bold text-white drop-shadow">{primaryType[0]}</span>
                </div>
                <span className="font-bold text-xs truncate">Attack</span>
              </div>
              <span className="text-lg font-black">{pokemon.base.Attack}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-100 px-2 py-1 border-t-2 border-black">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">No. {String(pokemon.id).padStart(3, '0')}</span>
              <div className="flex gap-1">
                {pokemon.type.map((t) => (
                  <span key={t} className={`${TYPE_COLORS[t] || 'bg-stone-400'} w-3 h-3 rounded-full border border-black`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
