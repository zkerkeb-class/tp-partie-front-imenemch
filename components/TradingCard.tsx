import React from 'react';
import { PokemonDetails, TYPE_COLORS } from '../types';

interface TradingCardProps {
  pokemon: PokemonDetails;
  cardRef: React.RefObject<HTMLDivElement>;
}

const STAT_ATTACK_NAMES: Record<string, string> = {
  'hp': 'Endurance',
  'attack': 'Power Strike',
  'defense': 'Iron Defense',
  'special-attack': 'Energy Blast',
  'special-defense': 'Shield',
  'speed': 'Quick Attack',
};

export default function TradingCard({ pokemon, cardRef }: TradingCardProps) {
  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = TYPE_COLORS[primaryType] || 'bg-stone-400';

  // Get HP stat
  const hpStat = pokemon.stats.find(s => s.stat.name === 'hp');
  const hp = hpStat?.base_stat || 50;

  // Get top 2 stats for attacks
  const topStats = [...pokemon.stats]
    .sort((a, b) => b.base_stat - a.base_stat)
    .slice(0, 2);

  const formatStatName = (name: string): string => {
    return name.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-white"
      style={{ width: '350px', height: '500px' }}
    >
      {/* Yellow TCG Border */}
      <div className="absolute inset-0 bg-yellow-400 rounded-2xl"></div>

      {/* Inner Card */}
      <div className="absolute inset-2 bg-white rounded-xl overflow-hidden border-2 border-black">
        {/* Header */}
        <div className="bg-white px-3 py-2 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black uppercase">{pokemon.name}</h2>
            <div className={`w-6 h-6 rounded-full border-2 border-black ${typeColor}`}></div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">HP</span>
            <span className="text-xl font-black text-red-600">{hp}</span>
          </div>
        </div>

        {/* Image Section */}
        <div className={`${typeColor} border-b-2 border-black relative`} style={{ height: '180px' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              className="h-40 w-40 object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Type Badge */}
        <div className="bg-gray-100 px-3 py-1 border-b-2 border-black">
          <span className="text-xs font-bold uppercase">{formatStatName(primaryType)} Pokemon</span>
        </div>

        {/* Attacks Section */}
        <div className="px-3 py-2 space-y-3">
          {topStats.map((stat, index) => {
            const statName = stat.stat.name;
            const attackName = STAT_ATTACK_NAMES[statName] || formatStatName(statName);
            const damage = stat.base_stat;

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border border-black ${typeColor} flex items-center justify-center`}>
                      <span className="text-xs font-bold text-white drop-shadow">{primaryType[0].toUpperCase()}</span>
                    </div>
                    <span className="font-bold text-sm">{attackName}</span>
                  </div>
                  <span className="text-2xl font-black">{damage}</span>
                </div>
                <p className="text-xs text-gray-600 pl-7">
                  {index === 0 ? 'A powerful attack using raw energy.' : 'A swift strike that never misses.'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-100 px-3 py-2 border-t-2 border-black">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">No. {String(pokemon.id).padStart(3, '0')}</span>
            <span className="text-gray-600">
              {(pokemon.height / 10).toFixed(1)}m | {(pokemon.weight / 10).toFixed(1)}kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
