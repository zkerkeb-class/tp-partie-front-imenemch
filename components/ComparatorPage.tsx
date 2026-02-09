import React, { useEffect, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { Pokemon, PokemonMini, TYPE_COLORS } from '../types';
import { fetchPokemonById, fetchAllPokemonMini } from '../services/pokemonApi';
import PokemonPicker from './PokemonPicker';

const STAT_LABELS = [
  { key: 'HP' as const, label: 'HP' },
  { key: 'Attack' as const, label: 'Attack' },
  { key: 'Defense' as const, label: 'Defense' },
  { key: 'SpecialAttack' as const, label: 'Sp. Atk' },
  { key: 'SpecialDefense' as const, label: 'Sp. Def' },
  { key: 'Speed' as const, label: 'Speed' },
];

const ComparatorPage: React.FC = () => {
  const [allPokemon, setAllPokemon] = useState<PokemonMini[]>([]);
  const [fighter1, setFighter1] = useState<Pokemon | null>(null);
  const [fighter2, setFighter2] = useState<Pokemon | null>(null);
  const [picking, setPicking] = useState<1 | 2 | null>(null);
  const [loadingAll, setLoadingAll] = useState(true);

  useEffect(() => {
    fetchAllPokemonMini().then(data => {
      setAllPokemon(data);
      setLoadingAll(false);
    }).catch(() => setLoadingAll(false));
  }, []);

  const handleSelect = async (id: number) => {
    setPicking(null);
    const pokemon = await fetchPokemonById(id);
    if (picking === 1) setFighter1(pokemon);
    else setFighter2(pokemon);
  };

  const handleReset = () => {
    setFighter1(null);
    setFighter2(null);
  };

  const bst = (p: Pokemon) =>
    p.base.HP + p.base.Attack + p.base.Defense + p.base.SpecialAttack + p.base.SpecialDefense + p.base.Speed;

  const bst1 = fighter1 ? bst(fighter1) : 0;
  const bst2 = fighter2 ? bst(fighter2) : 0;

  const radarData = STAT_LABELS.map(({ key, label }) => ({
    subject: label,
    fighter1: fighter1?.base[key] ?? 0,
    fighter2: fighter2?.base[key] ?? 0,
    fullMark: 255,
  }));

  if (loadingAll) {
    return (
      <div className="flex justify-center mt-20">
        <div className="text-lg font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-black uppercase mb-8 text-center">Stats Comparator</h1>

      {/* Fighter Slots */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-10">
        {/* Fighter 1 */}
        <FighterSlot
          pokemon={fighter1}
          onPick={() => setPicking(1)}
          color="blue"
        />

        {/* VS Badge */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center draw-shadow-sm">
            <span className="text-lg font-black">VS</span>
          </div>
          {(fighter1 || fighter2) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 bg-white border-2 border-black rounded-md px-2 py-1 font-bold text-xs draw-shadow-sm hover:bg-yellow-50 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
        </div>

        {/* Fighter 2 */}
        <FighterSlot
          pokemon={fighter2}
          onPick={() => setPicking(2)}
          color="red"
        />
      </div>

      {/* Comparison */}
      {fighter1 && fighter2 && (
        <div className="bg-white border-2 border-black rounded-lg draw-shadow overflow-hidden">
          {/* Stat Bars */}
          <div className="p-6">
            <h2 className="font-black text-sm uppercase mb-4">Stat Comparison</h2>
            <div className="space-y-3">
              {STAT_LABELS.map(({ key, label }) => {
                const v1 = fighter1.base[key];
                const v2 = fighter2.base[key];
                const max = Math.max(v1, v2, 1);
                const w1 = (v1 / 255) * 100;
                const w2 = (v2 / 255) * 100;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className={v1 > v2 ? 'text-blue-600' : v1 < v2 ? 'text-gray-400' : ''}>{v1}</span>
                      <span className="uppercase">{label}</span>
                      <span className={v2 > v1 ? 'text-red-600' : v2 < v1 ? 'text-gray-400' : ''}>{v2}</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 flex justify-end">
                        <div className="w-full bg-gray-200 rounded-full h-3 border border-black overflow-hidden">
                          <div
                            className={`h-full rounded-full float-right ${v1 >= v2 ? 'bg-blue-500' : 'bg-blue-300'}`}
                            style={{ width: `${w1}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3 border border-black overflow-hidden">
                          <div
                            className={`h-full rounded-full ${v2 >= v1 ? 'bg-red-500' : 'bg-red-300'}`}
                            style={{ width: `${w2}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BST */}
            <div className="mt-6 flex items-center justify-between border-t-2 border-black pt-4">
              <div className="text-center">
                <span className={`text-2xl font-black ${bst1 > bst2 ? 'text-blue-600' : bst1 < bst2 ? 'text-gray-400' : ''}`}>
                  {bst1}
                </span>
              </div>
              <div className="text-center">
                <span className="font-black text-sm uppercase">Base Stat Total</span>
                {bst1 !== bst2 && (
                  <div className={`mt-1 px-2 py-0.5 rounded-full border-2 border-black text-xs font-bold ${
                    bst1 > bst2 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {bst1 > bst2 ? fighter1.name.english : fighter2.name.english} wins!
                  </div>
                )}
                {bst1 === bst2 && (
                  <div className="mt-1 px-2 py-0.5 rounded-full border-2 border-black text-xs font-bold bg-yellow-100">
                    Draw!
                  </div>
                )}
              </div>
              <div className="text-center">
                <span className={`text-2xl font-black ${bst2 > bst1 ? 'text-red-600' : bst2 < bst1 ? 'text-gray-400' : ''}`}>
                  {bst2}
                </span>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="border-t-2 border-black p-6">
            <h2 className="font-black text-sm uppercase mb-4">Radar Overlay</h2>
            <div className="w-full h-80 font-bold">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#000" strokeWidth={1} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name={fighter1.name.english}
                    dataKey="fighter1"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name={fighter2.name.english}
                    dataKey="fighter2"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '2px solid #000',
                      boxShadow: '4px 4px 0px 0px #000',
                      color: '#000',
                      borderRadius: '0px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Picker Modal */}
      {picking && (
        <PokemonPicker
          allPokemon={allPokemon}
          onSelect={handleSelect}
          onClose={() => setPicking(null)}
          excludeId={picking === 1 ? fighter2?.id : fighter1?.id}
        />
      )}
    </div>
  );
};

interface FighterSlotProps {
  pokemon: Pokemon | null;
  onPick: () => void;
  color: 'blue' | 'red';
}

const FighterSlot: React.FC<FighterSlotProps> = ({ pokemon, onPick, color }) => {
  const borderColor = color === 'blue' ? 'border-blue-400' : 'border-red-400';
  const bgAccent = color === 'blue' ? 'bg-blue-50' : 'bg-red-50';

  if (!pokemon) {
    return (
      <button
        onClick={onPick}
        className={`${bgAccent} border-2 border-dashed ${borderColor} rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:bg-opacity-80 active:translate-y-0.5 transition-all min-h-[200px]`}
      >
        <div className={`w-12 h-12 ${color === 'blue' ? 'bg-blue-200' : 'bg-red-200'} rounded-full flex items-center justify-center border-2 ${borderColor}`}>
          <Plus size={24} className={color === 'blue' ? 'text-blue-600' : 'text-red-600'} />
        </div>
        <span className="font-bold text-sm text-gray-500">Choose Pokémon</span>
      </button>
    );
  }

  const primaryType = pokemon.type[0] || 'Normal';
  const typeColor = TYPE_COLORS[primaryType] || 'bg-stone-400';

  return (
    <div
      className={`bg-white border-2 border-black rounded-lg overflow-hidden draw-shadow cursor-pointer hover:-translate-y-1 transition-all`}
      onClick={onPick}
    >
      <div className={`${typeColor} p-4 flex items-center justify-center`}>
        <img
          src={pokemon.image}
          alt={pokemon.name.english}
          className="w-28 h-28 object-contain drop-shadow-lg"
          onError={e => {
            (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
          }}
        />
      </div>
      <div className="p-3 border-t-2 border-black text-center">
        <h3 className="font-black uppercase text-sm">{pokemon.name.english}</h3>
        <span className="text-xs text-gray-500 font-bold">#{String(pokemon.id).padStart(3, '0')}</span>
        <div className="flex justify-center gap-1 mt-1">
          {pokemon.type.map(t => (
            <span key={t} className={`${TYPE_COLORS[t] || 'bg-stone-400'} text-white text-xs font-bold px-2 py-0.5 rounded-full border border-black`}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparatorPage;
