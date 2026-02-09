import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  pokemonName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ pokemonName, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div
        className="bg-white border-2 border-black rounded-lg p-6 draw-shadow max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-300">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <h2 className="text-xl font-black">Delete Pokémon</h2>
        </div>

        <p className="text-sm mb-6">
          Are you sure you want to delete <strong>{pokemonName}</strong>? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-1 bg-white border-2 border-black rounded-md px-4 py-2 font-bold text-sm draw-shadow-sm hover:bg-gray-50 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-1 bg-red-500 text-white border-2 border-black rounded-md px-4 py-2 font-bold text-sm draw-shadow-sm hover:bg-red-600 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
          >
            <Trash2 size={16} />
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
