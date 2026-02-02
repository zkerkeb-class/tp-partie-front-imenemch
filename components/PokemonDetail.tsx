import React from 'react';
import { PokemonDetails, TYPE_COLORS } from '../types';
import { X, Ruler, Weight, Play } from 'lucide-react';
import StatChart from './StatChart';

interface PokemonDetailProps {
  pokemon: PokemonDetails;
  onClose: () => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose }) => {
  const mainType = pokemon.types[0].type.name;
  const mainColorClass = TYPE_COLORS[mainType] || 'bg-slate-500';

  const playCry = () => {
    if (pokemon.cries?.latest) {
      const audio = new Audio(pokemon.cries.latest);
      audio.volume = 0.5;
      audio.play();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-2 md:p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg draw-border draw-shadow flex flex-col md:flex-row relative overflow-hidden">
        
        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2 bg-white draw-border draw-shadow-sm hover:bg-red-50 transition-colors rounded-full"
        >
            <X size={20} />
        </button>

        {/* Left Column: Visuals */}
        <div className={`w-full md:w-2/5 ${mainColorClass} relative flex flex-col items-center p-8 border-b-2 md:border-b-0 md:border-r-2 border-black`}>
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')] pointer-events-none"></div>

            <div className="relative z-10 w-full mt-8 md:mt-0 text-center md:text-left">
                 <span className="font-bold text-xl bg-white border-2 border-black px-2 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transform -rotate-2 inline-block mb-4">
                    #{pokemon.id.toString().padStart(3,'0')}
                 </span>
                 <h1 className="text-4xl md:text-5xl font-black uppercase text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] stroke-black" style={{ WebkitTextStroke: '1px black' }}>
                    {pokemon.name}
                 </h1>
            </div>

            <div className="relative z-10 my-8 w-full flex justify-center">
                 <div className="bg-white/30 backdrop-blur-sm rounded-full p-8 border-2 border-black border-dashed">
                    <img 
                        src={pokemon.sprites.other['official-artwork'].front_default} 
                        alt={pokemon.name} 
                        className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-lg"
                    />
                 </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 bg-white border-2 border-black p-4 rounded-lg draw-shadow-sm">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-1 font-bold"><Weight size={16} /> Weight</div>
                    <span className="text-xl font-black">{pokemon.weight / 10} kg</span>
                </div>
                 <div className="flex flex-col items-center border-l-2 border-black border-dashed">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-1 font-bold"><Ruler size={16} /> Height</div>
                    <span className="text-xl font-black">{pokemon.height / 10} m</span>
                </div>
            </div>
             <button onClick={playCry} className="mt-4 flex items-center justify-center gap-2 text-lg font-bold bg-white text-black border-2 border-black px-6 py-2 rounded-full draw-shadow-sm hover:draw-shadow transition-all active:translate-y-1 active:shadow-none w-full">
                <Play size={20} fill="currentColor" /> Play Cry
            </button>
        </div>

        {/* Right Column: Data */}
        <div className="w-full md:w-3/5 bg-[#fffdf5] flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b-2 border-black bg-yellow-100">
                <h2 className="text-2xl font-black uppercase tracking-tight">Data File</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="space-y-8">
                    {/* Types */}
                    <div>
                        <h3 className="font-bold text-lg border-b-2 border-black inline-block mb-3">Types</h3>
                        <div className="flex gap-2">
                        {pokemon.types.map(t => (
                            <span key={t.type.name} className={`px-4 py-1 border-2 border-black rounded-md text-sm font-bold uppercase tracking-wider bg-white draw-shadow-sm`}>
                                {t.type.name}
                            </span>
                        ))}
                        </div>
                    </div>

                    {/* Abilities */}
                    <div>
                        <h3 className="font-bold text-lg border-b-2 border-black inline-block mb-3">Abilities</h3>
                        <div className="flex gap-3 flex-wrap">
                            {pokemon.abilities.map(a => (
                                <span key={a.ability.name} className={`px-4 py-2 rounded-lg border-2 border-black bg-white capitalize ${a.is_hidden ? 'border-dashed text-gray-600' : 'text-black'} draw-shadow-sm`}>
                                    {a.ability.name.replace('-', ' ')}
                                    {a.is_hidden && <span className="ml-2 text-xs bg-gray-200 border border-black px-1.5 py-0.5 rounded">Hidden</span>}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Chart */}
                    <div>
                            <h3 className="font-bold text-lg border-b-2 border-black inline-block mb-3">Base Stats</h3>
                            <div className="bg-white rounded-lg p-4 border-2 border-black draw-shadow-sm">
                            <StatChart stats={pokemon.stats} />
                            </div>
                            
                            {/* Simple Stat Table */}
                            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                {pokemon.stats.map(s => (
                                    <div key={s.stat.name} className="flex justify-between border-b border-gray-300 py-1">
                                        <span className="capitalize font-bold text-gray-600">{s.stat.name.replace('-', ' ')}</span>
                                        <span className="font-black">{s.base_stat}</span>
                                    </div>
                                ))}
                            </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;