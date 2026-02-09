import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { BarChart2, Plus, Swords } from 'lucide-react';
import PokemonListPage from './components/PokemonListPage';
import PokemonDetailPage from './components/PokemonDetailPage';
import AddPokemonPage from './components/AddPokemonPage';
import ComparatorPage from './components/ComparatorPage';

function App() {
  return (
    <div className="min-h-screen pb-12">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-[#fffdf5]/90 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-4 cursor-pointer">
            <div className="w-10 h-10 bg-black text-white rounded-md flex items-center justify-center draw-shadow-sm border-2 border-white">
              <BarChart2 />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              Poke<span className="text-yellow-500" style={{ WebkitTextStroke: '1px black' }}>Stats</span>
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/compare"
              className="flex items-center gap-2 bg-white border-2 border-black rounded-md px-4 py-2 font-bold text-sm draw-shadow-sm hover:bg-yellow-50 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Swords size={18} />
              Compare
            </Link>
            <Link
              to="/pokemon/new"
              className="flex items-center gap-2 bg-yellow-400 border-2 border-black rounded-md px-4 py-2 font-bold text-sm draw-shadow-sm hover:bg-yellow-300 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Plus size={18} />
              Add Pokémon
            </Link>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
        <Routes>
          <Route path="/" element={<PokemonListPage />} />
          <Route path="/pokemon/new" element={<AddPokemonPage />} />
          <Route path="/compare" element={<ComparatorPage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
