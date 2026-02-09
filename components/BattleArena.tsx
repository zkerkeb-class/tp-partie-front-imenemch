import React from 'react';
import { PokemonDetails, TYPE_COLORS } from '../types';
import { Swords, X, Trophy, Equal, Plus } from 'lucide-react';

interface BattleArenaProps {
  fighter1: PokemonDetails | null;
  fighter2: PokemonDetails | null;
  onClose: () => void;
  onReset: () => void;
  onSelectNew: () => void;
}

const BattleArena: React.FC<BattleArenaProps> = ({ fighter1, fighter2, onClose, onReset, onSelectNew }) => {
  // Removed early return to allow empty state visualization

  const statsToCompare = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

  const getStat = (p: PokemonDetails, name: string) => p.stats.find(s => s.stat.name === name)?.base_stat || 0;
  const getTotal = (p: PokemonDetails) => p.stats.reduce((acc, curr) => acc + curr.base_stat, 0);

  const total1 = fighter1 ? getTotal(fighter1) : 0;
  const total2 = fighter2 ? getTotal(fighter2) : 0;
  
  // Determine winner based on Base Stat Total (BST) - only if both exist
  const winnerId = (fighter1 && fighter2 && total1 !== total2) ? (total1 > total2 ? fighter1.id : fighter2.id) : null;
  const isDraw = fighter1 && fighter2 && total1 === total2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-[#fffdf5] w-full max-w-5xl max-h-[95vh] rounded-lg draw-border draw-shadow overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b-2 border-black bg-yellow-300">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-white border-2 border-black rounded-full">
                <Swords className="text-black" size={24} />
             </div>
             <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Stat Comparison</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white draw-border hover:bg-red-100 rounded-full transition-colors">
            <X className="text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-8">
                {/* Fighter 1 */}
                <div className="flex flex-col items-center order-2 md:order-1 relative">
                    {fighter1 ? (
                        <div className="flex flex-col items-center w-full group">
                            {/* Winner Badge */}
                            {winnerId === fighter1.id && (
                                <div className="absolute -top-6 -right-2 z-20 rotate-12 animate-bounce-slow">
                                    <span className="bg-red-600 text-white font-black text-xl px-4 py-1 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                        WINNER
                                    </span>
                                </div>
                            )}

                             <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border-4 border-black bg-white mb-4 draw-shadow relative overflow-hidden transition-transform ${winnerId === fighter1.id ? 'scale-110' : ''}`}>
                                <div className={`absolute inset-0 opacity-50 ${TYPE_COLORS[fighter1.types[0].type.name]}`}></div>
                                <img src={fighter1.sprites.other['official-artwork'].front_default} className="w-28 h-28 md:w-36 md:h-36 object-contain relative z-10" />
                            </div>
                            <h3 className="text-2xl font-black uppercase text-center leading-none mb-1">{fighter1.name}</h3>
                            <div className="flex gap-1 mb-2">
                                {fighter1.types.map(t => (
                                    <span key={t.type.name} className="text-[10px] uppercase font-bold px-2 py-0.5 border border-black bg-white rounded-sm">{t.type.name}</span>
                                ))}
                            </div>
                            <div className="bg-white border-2 border-black px-4 py-1 rounded-full draw-shadow-sm">
                                <span className="text-sm font-bold text-gray-500 uppercase mr-2">BST</span>
                                <span className="text-xl font-black">{total1}</span>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={onSelectNew}
                            className="w-32 h-32 rounded-full border-4 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-400 font-bold bg-gray-50 hover:bg-gray-100 hover:border-gray-600 hover:text-gray-600 transition-colors cursor-pointer group"
                        >
                            <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">Select #1</span>
                        </button>
                    )}
                </div>

                {/* VS Column */}
                <div className="flex flex-col items-center justify-center pt-2 md:pt-14 order-1 md:order-2">
                    {isDraw ? (
                         <div className="flex flex-col items-center">
                            <Equal size={48} className="text-gray-400 mb-2" />
                            <span className="font-black uppercase text-gray-400 text-2xl">Draw</span>
                         </div>
                    ) : (
                        <span className="text-6xl font-black text-black italic drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">VS</span>
                    )}
                    
                    <button onClick={onReset} className="text-xs font-bold text-red-500 mt-4 hover:text-red-700 underline uppercase tracking-wide">
                        Reset Fighters
                    </button>
                </div>

                {/* Fighter 2 */}
                <div className="flex flex-col items-center order-3 relative">
                    {fighter2 ? (
                         <div className="flex flex-col items-center w-full group">
                             {/* Winner Badge */}
                            {winnerId === fighter2.id && (
                                <div className="absolute -top-6 -left-2 z-20 -rotate-12 animate-bounce-slow">
                                    <span className="bg-red-600 text-white font-black text-xl px-4 py-1 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                        WINNER
                                    </span>
                                </div>
                            )}

                             <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border-4 border-black bg-white mb-4 draw-shadow relative overflow-hidden transition-transform ${winnerId === fighter2.id ? 'scale-110' : ''}`}>
                                <div className={`absolute inset-0 opacity-50 ${TYPE_COLORS[fighter2.types[0].type.name]}`}></div>
                                <img src={fighter2.sprites.other['official-artwork'].front_default} className="w-28 h-28 md:w-36 md:h-36 object-contain relative z-10" />
                            </div>
                            <h3 className="text-2xl font-black uppercase text-center leading-none mb-1">{fighter2.name}</h3>
                            <div className="flex gap-1 mb-2">
                                {fighter2.types.map(t => (
                                    <span key={t.type.name} className="text-[10px] uppercase font-bold px-2 py-0.5 border border-black bg-white rounded-sm">{t.type.name}</span>
                                ))}
                            </div>
                            <div className="bg-white border-2 border-black px-4 py-1 rounded-full draw-shadow-sm">
                                <span className="text-sm font-bold text-gray-500 uppercase mr-2">BST</span>
                                <span className="text-xl font-black">{total2}</span>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={onSelectNew}
                            className="w-32 h-32 rounded-full border-4 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-400 font-bold bg-gray-50 hover:bg-gray-100 hover:border-gray-600 hover:text-gray-600 transition-colors cursor-pointer group"
                        >
                            <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">Select #2</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Comparison Table */}
            {fighter1 && fighter2 ? (
                <div className="bg-white border-2 border-black rounded-lg p-4 md:p-6 draw-shadow-sm">
                    <div className="flex items-center justify-center mb-6">
                        <Trophy className="text-yellow-500 mr-2" fill="currentColor" />
                        <h3 className="font-bold text-xl text-center uppercase border-b-2 border-black pb-1">Detailed Breakdown</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {statsToCompare.map(stat => {
                            const val1 = getStat(fighter1, stat);
                            const val2 = getStat(fighter2, stat);
                            const totalVal = val1 + val2;
                            const pct1 = totalVal > 0 ? (val1 / totalVal) * 100 : 50;
                            const pct2 = totalVal > 0 ? (val2 / totalVal) * 100 : 50;
                            const win1 = val1 > val2;
                            const win2 = val2 > val1;

                            return (
                                <div key={stat} className="grid grid-cols-1 md:grid-cols-7 items-center gap-y-1 gap-x-4">
                                    {/* Mobile: Stat Label on top */}
                                    <div className="md:hidden col-span-1 flex justify-between font-bold uppercase text-sm mb-1">
                                        <span>{stat.replace('-', ' ')}</span>
                                        <div className="flex gap-4">
                                            <span className={win1 ? 'text-green-600' : 'text-gray-500'}>{val1}</span>
                                            <span className={win2 ? 'text-green-600' : 'text-gray-500'}>{val2}</span>
                                        </div>
                                    </div>

                                    {/* Left Value */}
                                    <div className={`hidden md:block col-span-2 text-right font-black text-lg ${win1 ? 'text-black scale-110' : 'text-gray-400'}`}>
                                        {val1}
                                    </div>
                                    
                                    {/* Center Label (Desktop) */}
                                    <div className="hidden md:block col-span-3 text-center uppercase font-bold text-xs bg-gray-100 py-1 rounded border border-black absolute left-1/2 -translate-x-1/2 w-32 z-10 pointer-events-none">
                                        {stat.replace('-', ' ')}
                                    </div>

                                    {/* Bar Chart Area */}
                                    <div className="col-span-1 md:col-span-3 md:col-start-3 h-4 md:h-5 bg-gray-100 rounded-full overflow-hidden border-2 border-black flex relative">
                                         {/* Label Overlay for Desktop */}
                                         <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-black/50 drop-shadow-sm md:block hidden">{stat.replace('-', ' ')}</span>
                                         </div>

                                         <div style={{ width: `${pct1}%` }} className={`h-full transition-all duration-1000 ease-out ${win1 ? 'bg-blue-500' : 'bg-blue-300'} flex items-center justify-start pl-2`}>
                                         </div> 
                                         <div className="w-0.5 h-full bg-black z-10"></div>
                                         <div style={{ width: `${pct2}%` }} className={`h-full transition-all duration-1000 ease-out ${win2 ? 'bg-red-500' : 'bg-red-300'} flex items-center justify-end pr-2`}>
                                         </div> 
                                    </div>

                                    {/* Right Value */}
                                    <div className={`hidden md:block col-span-2 text-left font-black text-lg ${win2 ? 'text-black scale-110' : 'text-gray-400'}`}>
                                        {val2}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="mt-6 flex justify-between text-xs font-bold text-gray-500 uppercase px-4">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 border border-black rounded-full"></div> {fighter1.name}</div>
                        <div className="flex items-center gap-2">{fighter2.name} <div className="w-3 h-3 bg-red-500 border border-black rounded-full"></div></div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                    <Trophy size={48} className="text-gray-400 mb-4" />
                    <p className="text-xl font-bold text-gray-500">Select two Pokemon to compare stats</p>
                    <p className="text-sm text-gray-400 max-w-xs mt-2">Click on the empty slots above or close this window to select from the list.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BattleArena;