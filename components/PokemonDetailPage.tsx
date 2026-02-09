import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Heart } from 'lucide-react';
import { Pokemon, PokemonFormData, TYPE_COLORS } from '../types';
import { fetchPokemonById, updatePokemon, deletePokemon } from '../services/pokemonApi';
import { useFavorites } from '../contexts/FavoritesContext';
import StatChart from './StatChart';
import PokemonForm from './PokemonForm';
import DeleteConfirmModal from './DeleteConfirmModal';

const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPokemonById(Number(id));
      setPokemon(data);
    } catch {
      navigate('/');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleUpdate = async (data: PokemonFormData) => {
    const updated = await updatePokemon(Number(id), data);
    setPokemon(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    await deletePokemon(Number(id));
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="text-lg font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!pokemon) return null;

  const primaryType = pokemon.type[0] || 'Normal';
  const typeColor = TYPE_COLORS[primaryType] || 'bg-stone-400';

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-bold mb-6 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to list
      </Link>

      <div className="bg-white border-2 border-black rounded-lg overflow-hidden draw-shadow">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image + Types */}
          <div className={`${typeColor} p-8 flex flex-col items-center justify-center relative`}>
            <span className="absolute top-4 left-4 bg-white/80 border-2 border-black rounded-md px-2 py-1 text-xs font-black">
              #{String(pokemon.id).padStart(3, '0')}
            </span>
            <img
              src={pokemon.image}
              alt={pokemon.name.english}
              className="w-48 h-48 object-contain drop-shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
              }}
            />
            <div className="flex gap-2 mt-4">
              {pokemon.type.map((t) => (
                <span
                  key={t}
                  className={`${TYPE_COLORS[t] || 'bg-stone-400'} text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-black`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Data */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-black uppercase">{pokemon.name.english}</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(pokemon.id)}
                  className="p-2 bg-white border-2 border-black rounded-md draw-shadow-sm hover:bg-red-50 active:translate-y-0.5 active:shadow-none transition-all"
                  title={isFavorite(pokemon.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={16} className={isFavorite(pokemon.id) ? 'fill-red-500 text-red-500' : ''} />
                </button>
                <button
                  onClick={() => setEditing(!editing)}
                  className="p-2 bg-white border-2 border-black rounded-md draw-shadow-sm hover:bg-yellow-50 active:translate-y-0.5 active:shadow-none transition-all"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="p-2 bg-white border-2 border-black rounded-md draw-shadow-sm hover:bg-red-50 active:translate-y-0.5 active:shadow-none transition-all"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
              <div><span className="font-bold">Japanese:</span> {pokemon.name.japanese}</div>
              <div><span className="font-bold">Chinese:</span> {pokemon.name.chinese}</div>
              <div><span className="font-bold">French:</span> {pokemon.name.french}</div>
            </div>

            {/* Stats Table */}
            <div className="space-y-2 mb-6">
              {[
                { label: 'HP', value: pokemon.base.HP },
                { label: 'Attack', value: pokemon.base.Attack },
                { label: 'Defense', value: pokemon.base.Defense },
                { label: 'Sp. Atk', value: pokemon.base.SpecialAttack },
                { label: 'Sp. Def', value: pokemon.base.SpecialDefense },
                { label: 'Speed', value: pokemon.base.Speed },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs font-bold w-16">{label}</span>
                  <span className="text-xs font-bold w-8 text-right">{value}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 border border-black">
                    <div
                      className={`${typeColor} h-full rounded-full`}
                      style={{ width: `${Math.min((value / 255) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Radar Chart */}
            <StatChart base={pokemon.base} />
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="border-t-2 border-black p-6">
            <h2 className="text-xl font-black uppercase mb-4">Edit Pokémon</h2>
            <PokemonForm
              initialData={{
                name: pokemon.name,
                type: pokemon.type,
                base: pokemon.base,
                image: pokemon.image,
              }}
              onSubmit={handleUpdate}
              submitLabel="Update Pokémon"
            />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <DeleteConfirmModal
          pokemonName={pokemon.name.english}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
};

export default PokemonDetailPage;
