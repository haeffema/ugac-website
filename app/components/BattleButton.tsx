// app/components/BattleButton.tsx
import React from 'react';

interface BattleButtonProps {
  onClick: () => void; // A function that returns void (nothing)
}

const BattleButton: React.FC<BattleButtonProps> = ({ onClick }) => {
  return (
    <div className="mb-8 text-center">
      <button
        onClick={onClick}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full text-2xl shadow-lg transform transition duration-200 hover:scale-105 flex items-center justify-center mx-auto"
      >
        <span className="mr-3 text-4xl">⚔️</span>
        Kampf starten!
      </button>
    </div>
  );
};

export default BattleButton;