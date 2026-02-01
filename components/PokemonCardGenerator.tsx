import { useRef, useState } from 'react';
import { X, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { PokemonDetails } from '../types';
import TradingCard from './TradingCard';

interface PokemonCardGeneratorProps {
  pokemon: PokemonDetails;
  onClose: () => void;
}

export default function PokemonCardGenerator({ pokemon, onClose }: PokemonCardGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${pokemon.name}-card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating card:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#fffdf5] rounded-2xl p-6 draw-border draw-shadow max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 p-2 bg-white draw-border draw-shadow-sm hover:bg-red-50 transition-colors rounded-full"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-black uppercase">Trading Card</h2>
          <p className="text-sm text-gray-600">Preview your Pokemon card</p>
        </div>

        {/* Card Preview */}
        <div className="flex justify-center mb-6">
          <TradingCard pokemon={pokemon} cardRef={cardRef} />
        </div>

        {/* Download Button */}
        <button
          onClick={downloadCard}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 text-lg font-bold bg-white text-black border-2 border-black px-6 py-3 rounded-full draw-shadow-sm hover:draw-shadow transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} />
          {isDownloading ? 'Generating...' : 'Download Card'}
        </button>
      </div>
    </div>
  );
}
