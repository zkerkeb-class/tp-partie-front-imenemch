import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { PokemonFormData } from '../types';

const ALL_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy',
];

interface PokemonFormProps {
  initialData?: PokemonFormData;
  onSubmit: (data: PokemonFormData) => Promise<void>;
  submitLabel?: string;
}

const PokemonForm: React.FC<PokemonFormProps> = ({ initialData, onSubmit, submitLabel = 'Save' }) => {
  const [nameEnglish, setNameEnglish] = useState(initialData?.name.english ?? '');
  const [nameJapanese, setNameJapanese] = useState(initialData?.name.japanese ?? '');
  const [nameChinese, setNameChinese] = useState(initialData?.name.chinese ?? '');
  const [nameFrench, setNameFrench] = useState(initialData?.name.french ?? '');
  const [types, setTypes] = useState<string[]>(initialData?.type ?? []);
  const [hp, setHp] = useState(initialData?.base.HP ?? 50);
  const [attack, setAttack] = useState(initialData?.base.Attack ?? 50);
  const [defense, setDefense] = useState(initialData?.base.Defense ?? 50);
  const [spAtk, setSpAtk] = useState(initialData?.base.SpecialAttack ?? 50);
  const [spDef, setSpDef] = useState(initialData?.base.SpecialDefense ?? 50);
  const [speed, setSpeed] = useState(initialData?.base.Speed ?? 50);
  const [image, setImage] = useState(initialData?.image ?? '');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleType = (t: string) => {
    setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!nameEnglish.trim()) errs.push('English name is required');
    if (types.length === 0) errs.push('Select at least one type');
    if (hp <= 0 || attack <= 0 || defense <= 0 || spAtk <= 0 || spDef <= 0 || speed <= 0) {
      errs.push('All stats must be greater than 0');
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: { english: nameEnglish, japanese: nameJapanese, chinese: nameChinese, french: nameFrench },
        type: types,
        base: { HP: hp, Attack: attack, Defense: defense, SpecialAttack: spAtk, SpecialDefense: spDef, Speed: speed },
        ...(image.trim() ? { image } : {}),
      });
    } catch {
      setErrors(['Something went wrong. Please try again.']);
    }
    setSubmitting(false);
  };

  const inputClass = 'w-full bg-white border-2 border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:bg-yellow-50 transition-all';
  const labelClass = 'block text-sm font-bold mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-md p-3">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-700 font-bold">{err}</p>
          ))}
        </div>
      )}

      {/* Names */}
      <fieldset className="border-2 border-black rounded-md p-4">
        <legend className="font-black text-sm px-2">Names</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>English *</label>
            <input type="text" value={nameEnglish} onChange={(e) => setNameEnglish(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Japanese</label>
            <input type="text" value={nameJapanese} onChange={(e) => setNameJapanese(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Chinese</label>
            <input type="text" value={nameChinese} onChange={(e) => setNameChinese(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>French</label>
            <input type="text" value={nameFrench} onChange={(e) => setNameFrench(e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Types */}
      <fieldset className="border-2 border-black rounded-md p-4">
        <legend className="font-black text-sm px-2">Types *</legend>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleType(t)}
              className={`px-3 py-1 rounded-full border-2 border-black text-xs font-bold transition-all ${
                types.includes(t)
                  ? 'bg-yellow-400 draw-shadow-sm'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Stats */}
      <fieldset className="border-2 border-black rounded-md p-4">
        <legend className="font-black text-sm px-2">Base Stats</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'HP', value: hp, set: setHp },
            { label: 'Attack', value: attack, set: setAttack },
            { label: 'Defense', value: defense, set: setDefense },
            { label: 'Sp. Attack', value: spAtk, set: setSpAtk },
            { label: 'Sp. Defense', value: spDef, set: setSpDef },
            { label: 'Speed', value: speed, set: setSpeed },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className={labelClass}>{label}</label>
              <input
                type="number"
                min={1}
                max={255}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Image */}
      <div>
        <label className={labelClass}>Image URL (optional)</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 bg-yellow-400 border-2 border-black rounded-md px-6 py-3 font-bold text-sm draw-shadow-sm hover:bg-yellow-300 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
      >
        <Save size={18} />
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default PokemonForm;
