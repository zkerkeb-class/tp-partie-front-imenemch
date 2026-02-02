import React, { useEffect, useState, useRef } from 'react';
import { PokemonDetails } from './types';
import PokemonCard from './components/PokemonCard';
import PokemonDetail from './components/PokemonDetail';
import BattleArena from './components/BattleArena';
import { Search, Swords, BarChart2, Check, ChevronDown } from 'lucide-react';
import { fetchSeries, fetchSetsBySeries, fetchSetDetails, getCardImageUrl, TCGSeries, TCGSet, TCGCard } from './services/tcgdex';
import { normalizePokemonName, isPokemonCard } from './utils/pokemonHelpers';

function App() {
  const [cardList, setCardList] = useState<TCGCard[]>([]);
  const [filteredList, setFilteredList] = useState<TCGCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // TCGdex State
  const [series, setSeries] = useState<TCGSeries[]>([]);
  const [sets, setSets] = useState<TCGSet[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [selectedSet, setSelectedSet] = useState<string>('');

  // Modal State
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);

  // Comparison State
  const [showComparison, setShowComparison] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [fighter1, setFighter1] = useState<PokemonDetails | null>(null);
  const [fighter2, setFighter2] = useState<PokemonDetails | null>(null);

  const initialLoadDone = useRef(false);

  // Load series on mount
  useEffect(() => {
    if (!initialLoadDone.current) {
        loadSeries();
        initialLoadDone.current = true;
    }
  }, []);

  // Load sets when series changes
  useEffect(() => {
    if (selectedSeries) {
      loadSets(selectedSeries);
    }
  }, [selectedSeries]);

  // Load cards when set changes
  useEffect(() => {
    if (selectedSet) {
      loadCards(selectedSet);
    }
  }, [selectedSet]);

  useEffect(() => {
    const results = cardList.filter(c => {
      // Filter by search term
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      // Only show Pokemon cards (hide Trainer, Energy, etc.)
      return matchesSearch && isPokemonCard(c.category);
    });
    setFilteredList(results);
  }, [searchTerm, cardList]);

  const loadSeries = async () => {
    setLoading(true);
    const allSeries = await fetchSeries();
    setSeries(allSeries);
    // Auto-select first series
    if (allSeries.length > 0) {
      setSelectedSeries(allSeries[0].id);
    }
    setLoading(false);
  };

  const loadSets = async (seriesId: string) => {
    setLoading(true);
    const seriesSets = await fetchSetsBySeries(seriesId);
    setSets(seriesSets);
    // Auto-select first set
    if (seriesSets.length > 0) {
      setSelectedSet(seriesSets[0].id);
    }
    setLoading(false);
  };

  const loadCards = async (setId: string) => {
    setLoading(true);
    const setDetails = await fetchSetDetails(setId);
    if (setDetails && setDetails.cards) {
      // Debug: Log categories to see what we're getting
      console.log('Card categories:', setDetails.cards.map(c => ({ name: c.name, category: c.category })));
      setCardList(setDetails.cards);
    }
    setLoading(false);
  };

  const handleComparisonSelect = (details: PokemonDetails) => {
      // Logic to toggle fighters
      if (fighter1?.id === details.id) {
          setFighter1(null);
          return;
      }
      if (fighter2?.id === details.id) {
          setFighter2(null);
          return;
      }

      let nextFighter1 = fighter1;
      let nextFighter2 = fighter2;

      if (!fighter1) {
          setFighter1(details);
          nextFighter1 = details;
      } else if (!fighter2) {
          setFighter2(details);
          nextFighter2 = details;
      } else {
          // If both full, replace the first one for now
          setFighter1(details);
          nextFighter1 = details;
      }

      // If we now have 2 fighters, auto-open the comparison to be helpful
      if (nextFighter1 && nextFighter2) {
          setTimeout(() => {
             setShowComparison(true);
             // We can keep selection mode on or off. Turning it off feels 'done'.
             setIsSelectionMode(false); 
          }, 300);
      }
  };

  const isSelectedForComparison = (name: string) => {
      const normalizedCardName = normalizePokemonName(name);
      return fighter1?.name.toLowerCase() === normalizedCardName || fighter2?.name.toLowerCase() === normalizedCardName;
  };

  // The banner should show if we are explicitly in selection mode OR if we have at least one fighter selected
  const showSelectionBanner = (isSelectionMode || fighter1 || fighter2) && !showComparison;

  return (
    <div className="min-h-screen pb-12">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-[#fffdf5]/90 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 bg-black text-white rounded-md flex items-center justify-center draw-shadow-sm border-2 border-white">
                <BarChart2 />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Poke<span className="text-yellow-500 text-stroke-black" style={{WebkitTextStroke: '1px black'}}>Stats</span></h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             {/* Series Selector */}
             <div className="relative hidden md:block">
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="bg-white border-2 border-black rounded-md px-3 py-2 text-sm font-bold appearance-none pr-8 hover:bg-yellow-50 transition-all cursor-pointer"
              >
                {series.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
             </div>

             {/* Set Selector */}
             <div className="relative hidden md:block">
              <select
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
                className="bg-white border-2 border-black rounded-md px-3 py-2 text-sm font-bold appearance-none pr-8 hover:bg-yellow-50 transition-all cursor-pointer"
              >
                {sets.map((set) => (
                  <option key={set.id} value={set.id}>{set.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
             </div>
             {/* Compare Button */}
             <button 
                onClick={() => setShowComparison(true)}
                className={`relative p-2 rounded-md border-2 border-black transition-all hover:bg-yellow-200 active:translate-y-1 active:shadow-none ${(fighter1 || fighter2 || isSelectionMode) ? 'bg-yellow-400 draw-shadow-sm' : 'bg-white draw-shadow-sm'}`}
                title="Compare Pokemon"
             >
                <Swords size={20} />
                {(fighter1 || fighter2) && (
                    <span className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center border-2 border-black">
                        {(fighter1 ? 1 : 0) + (fighter2 ? 1 : 0)}
                    </span>
                )}
             </button>

            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Find..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border-2 border-black rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-yellow-50 w-32 md:w-64 transition-all placeholder:font-bold"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Comparison Selection Bar */}
      {showSelectionBanner && (
          <div className="fixed top-20 left-0 right-0 z-20 bg-yellow-100 border-b-2 border-black py-3 animate-in slide-in-from-top-2 duration-300">
              <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                  <span className="text-sm font-bold uppercase flex items-center gap-2">
                    <Swords size={16} />
                    {fighter1 && fighter2 ? 'Ready to Battle!' : 'Select Pokemon...'}
                  </span>
                  
                  <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {fighter1 ? (
                            <span className="text-xs px-2 py-1 bg-white border border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-2 font-bold cursor-pointer hover:bg-red-50" onClick={() => setFighter1(null)}>
                                <img src={fighter1.sprites.other['official-artwork'].front_default} className="w-4 h-4" /> {fighter1.name}
                            </span>
                        ) : (
                            <span className="text-xs px-2 py-1 bg-white/50 border border-dashed border-black rounded text-gray-500 font-bold">Slot 1</span>
                        )}

                        {fighter2 ? (
                            <span className="text-xs px-2 py-1 bg-white border border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-2 font-bold cursor-pointer hover:bg-red-50" onClick={() => setFighter2(null)}>
                                <img src={fighter2.sprites.other['official-artwork'].front_default} className="w-4 h-4" /> {fighter2.name}
                            </span>
                        ) : (
                             <span className="text-xs px-2 py-1 bg-white/50 border border-dashed border-black rounded text-gray-500 font-bold">Slot 2</span>
                        )}
                      </div>

                      <div className="h-6 w-px bg-black/20"></div>

                      <button onClick={() => {setFighter1(null); setFighter2(null)}} className="text-xs font-bold underline hover:text-red-600">
                          Clear
                      </button>
                      <button onClick={() => setIsSelectionMode(false)} className="bg-black text-white text-xs font-bold px-3 py-1 rounded hover:bg-gray-800 flex items-center gap-1">
                          <Check size={12} /> Done
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Main Grid */}
      <main className={`max-w-7xl mx-auto px-4 md:px-8 pb-20 pt-28 ${showSelectionBanner ? 'pt-40' : ''} transition-all duration-300`}>
        {filteredList.length === 0 && !loading ? (
            <div className="text-center py-20 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-400 text-xl font-bold">Nothing here...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredList.map((card, idx) => (
                <PokemonCard
                    key={`${card.id}-${idx}`}
                    name={card.name}
                    cardImage={getCardImageUrl(card.image)}
                    onClick={setSelectedPokemon}
                    onBattleSelect={handleComparisonSelect}
                    isInBattleSelection={isSelectionMode || !!fighter1 || !!fighter2}
                    isSelectedForBattle={isSelectedForComparison(card.name)}
                />
            ))}
            </div>
        )}

        {loading && (
            <div className="flex justify-center mt-12">
              <div className="text-lg font-bold text-gray-600">Loading cards...</div>
            </div>
        )}
      </main>

      {/* Modals */}
      {selectedPokemon && (
        <PokemonDetail 
            pokemon={selectedPokemon} 
            onClose={() => setSelectedPokemon(null)} 
        />
      )}

      {showComparison && (
          <BattleArena 
            fighter1={fighter1} 
            fighter2={fighter2} 
            onClose={() => setShowComparison(false)}
            onReset={() => {setFighter1(null); setFighter2(null); setIsSelectionMode(true);}}
            onSelectNew={() => {setShowComparison(false); setIsSelectionMode(true);}}
          />
      )}

    </div>
  );
}

export default App;