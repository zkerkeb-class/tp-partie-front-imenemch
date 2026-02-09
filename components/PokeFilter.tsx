import React from 'react';
import { RotateCcw } from 'lucide-react';
import { FilterParams } from '../types';

const ALL_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy',
];

const STAT_FIELDS = [
  { key: 'HP', label: 'HP' },
  { key: 'Attack', label: 'Attack' },
  { key: 'Defense', label: 'Defense' },
  { key: 'SpecialAttack', label: 'Sp. Atk' },
  { key: 'SpecialDefense', label: 'Sp. Def' },
  { key: 'Speed', label: 'Speed' },
] as const;

interface PokeFilterProps {
  filters: FilterParams;
  onChange: (filters: FilterParams) => void;
  onReset: () => void;
}

const PokeFilter: React.FC<PokeFilterProps> = ({ filters, onChange, onReset }) => {
  const selectedTypes = filters.types || [];

  const toggleType = (type: string) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onChange({ ...filters, types: next.length > 0 ? next : undefined });
  };

  const handleStatChange = (stat: string, bound: 'min' | 'max', value: string) => {
    const key = `${bound}${stat}` as keyof FilterParams;
    const numValue = value === '' ? undefined : Number(value);
    const next = { ...filters, [key]: numValue };
    // Clean up undefined keys
    if (numValue === undefined) delete (next as any)[key];
    onChange(next);
  };

  return (
    <div className="bg-white border-2 border-black rounded-lg p-4 draw-shadow">
      {/* Types */}
      <div className="mb-4">
        <h3 className="font-black text-sm uppercase mb-2">Types</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => toggleType(t)}
              className={`px-3 py-1 rounded-full border-2 border-black text-xs font-bold transition-all ${
                selectedTypes.includes(t)
                  ? 'bg-yellow-400 draw-shadow-sm'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Ranges */}
      <div className="mb-4">
        <h3 className="font-black text-sm uppercase mb-2">Stat Ranges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STAT_FIELDS.map(({ key, label }) => {
            const minKey = `min${key}` as keyof FilterParams;
            const maxKey = `max${key}` as keyof FilterParams;
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs font-bold w-14 shrink-0">{label}</span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  placeholder="Min"
                  value={filters[minKey] ?? ''}
                  onChange={e => handleStatChange(key, 'min', e.target.value)}
                  className="w-20 bg-white border-2 border-black rounded-md px-2 py-1 text-xs focus:outline-none focus:bg-yellow-50 transition-all"
                />
                <span className="text-xs font-bold">-</span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  placeholder="Max"
                  value={filters[maxKey] ?? ''}
                  onChange={e => handleStatChange(key, 'max', e.target.value)}
                  className="w-20 bg-white border-2 border-black rounded-md px-2 py-1 text-xs focus:outline-none focus:bg-yellow-50 transition-all"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-1 bg-white border-2 border-black rounded-md px-3 py-1.5 font-bold text-xs draw-shadow-sm hover:bg-yellow-50 active:translate-y-0.5 active:shadow-none transition-all"
      >
        <RotateCcw size={14} />
        Reset Filters
      </button>
    </div>
  );
};

export default PokeFilter;
