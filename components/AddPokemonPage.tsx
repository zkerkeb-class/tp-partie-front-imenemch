import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PokemonForm from './PokemonForm';
import { createPokemon } from '../services/pokemonApi';
import { PokemonFormData } from '../types';

const AddPokemonPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = async (data: PokemonFormData) => {
    const created = await createPokemon(data);
    navigate(`/pokemon/${created.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-bold mb-6 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to list
      </Link>

      <div className="bg-white border-2 border-black rounded-lg p-6 draw-shadow">
        <h1 className="text-2xl font-black uppercase mb-6">Create New Pokémon</h1>
        <PokemonForm onSubmit={handleCreate} submitLabel="Create Pokémon" />
      </div>
    </div>
  );
};

export default AddPokemonPage;
