import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { PokemonMini, TYPE_COLORS } from '../types';

interface PokemonPickerProps {
  allPokemon: PokemonMini[];
  onSelect: (id: number) => void;
  onClose: () => void;
  excludeId?: number;
}

const PokemonPicker: React.FC<PokemonPickerProps> = ({ allPokemon, onSelect, onClose, excludeId }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = allPokemon;
    if (excludeId !== undefined) list = list.filter(p => p.id !== excludeId);
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(p => p.name.english.toLowerCase().includes(term) || String(p.id).includes(term));
    }
    return list;
  }, [allPokemon, search, excludeId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white border-2 border-black rounded-lg draw-shadow w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-black">
          <h2 className="text-xl font-black uppercase">Choose a Pokémon</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b-2 border-black">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:bg-yellow-50 transition-all placeholder:font-bold"
              autoFocus
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 font-bold py-8">No Pokémon found</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map(p => {
                const typeColor = TYPE_COLORS[p.type[0]] || 'bg-stone-400';
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelect(p.id)}
                    className="flex flex-col items-center p-2 border-2 border-black rounded-lg hover:bg-yellow-50 active:translate-y-0.5 transition-all group"
                  >
                    <div className={`w-14 h-14 ${typeColor} rounded-lg flex items-center justify-center mb-1 border border-black`}>
                      <img
                        src={p.image}
                        alt={p.name.english}
                        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                        onError={e => {
                          (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;
                        }}
                        loading="lazy"
                      />
                    </div>
                    <span className="text-xs font-bold truncate w-full text-center">{p.name.english}</span>
                    <span className="text-xs text-gray-400">#{String(p.id).padStart(3, '0')}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonPicker;
