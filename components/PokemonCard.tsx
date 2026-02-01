import React, { useEffect, useState } from 'react';
import { fetchPokemonDetails } from '../services/pokeapi';
import { PokemonDetails, TYPE_COLORS } from '../types';
import { Zap, Activity } from 'lucide-react';

interface PokemonCardProps {
  name: string;
  onClick: (details: PokemonDetails) => void;
  onBattleSelect: (details: PokemonDetails) => void;
  isInBattleSelection?: boolean;
  isSelectedForBattle?: boolean;
}

const STAT_ATTACK_NAMES: Record<string, string> = {
  'hp': 'Endurance',
  'attack': 'Power Strike',
  'defense': 'Iron Defense',
  'special-attack': 'Energy Blast',
  'special-defense': 'Shield',
  'speed': 'Quick Attack',
};

const PokemonCard: React.FC<PokemonCardProps> = ({ name, onClick, onBattleSelect, isInBattleSelection, isSelectedForBattle }) => {
  const [details, setDetails] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchPokemonDetails(name).then(data => {
      if (isMounted) setDetails(data);
    });
    return () => { isMounted = false; };
  }, [name]);

  if (!details) {
    return (
      <div className="bg-white draw-border rounded-lg p-4 h-80 flex items-center justify-center draw-shadow">
        <Activity className="text-black animate-spin" />
      </div>
    );
  }

  const primaryType = details.types[0]?.type.name || 'normal';
  const typeColor = TYPE_COLORS[primaryType] || 'bg-stone-400';
  const hpStat = details.stats.find(s => s.stat.name === 'hp');
  const hp = hpStat?.base_stat || 50;

  // Get top stat for attack
  const topStat = [...details.stats]
    .sort((a, b) => b.base_stat - a.base_stat)[0];
  const attackName = STAT_ATTACK_NAMES[topStat.stat.name] || 'Power Strike';
  const damage = topStat.base_stat;

  const formatStatName = (name: string): string => {
    return name.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ${isSelectedForBattle ? 'ring-4 ring-yellow-400' : 'hover:-translate-y-1'}`}
      onClick={() => isInBattleSelection ? onBattleSelect(details) : onClick(details)}
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
              <h2 className="text-sm font-black uppercase truncate">{details.name}</h2>
              <div className={`w-4 h-4 rounded-full border border-black ${typeColor} flex-shrink-0`}></div>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-xs font-bold">HP</span>
              <span className="text-sm font-black text-red-600">{hp}</span>
            </div>
          </div>

          {/* Image Section */}
          <div className={`${typeColor} border-b-2 border-black relative`} style={{ height: '40%' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={details.sprites.other['official-artwork'].front_default}
                alt={details.name}
                className="w-20 h-20 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Type Badge */}
          <div className="bg-gray-100 px-2 py-0.5 border-b-2 border-black">
            <span className="text-xs font-bold uppercase">{formatStatName(primaryType)} Pokemon</span>
          </div>

          {/* Attack Section */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className={`w-4 h-4 rounded-full border border-black ${typeColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xs font-bold text-white drop-shadow">{primaryType[0].toUpperCase()}</span>
                </div>
                <span className="font-bold text-xs truncate">{attackName}</span>
              </div>
              <span className="text-lg font-black">{damage}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-100 px-2 py-1 border-t-2 border-black">
            <div className="flex items-center justify-center text-xs">
              <span className="font-bold">No. {String(details.id).padStart(3, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Selection Indicator */}
      {isInBattleSelection && (
        <div className="absolute top-2 right-2 z-10">
          <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center ${isSelectedForBattle ? 'bg-yellow-400' : 'bg-white'}`}>
            {isSelectedForBattle && <Zap size={14} className="text-black" fill="currentColor" />}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonCard;