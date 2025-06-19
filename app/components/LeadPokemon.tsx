// app/components/LeadPokemon.tsx
import React from 'react';

interface LeadPokemonProps {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  spriteSrc?: string; // Optional
  status?: string; // Optional
}

const LeadPokemon: React.FC<LeadPokemonProps> = ({ name, level, hp, maxHp, spriteSrc, status = "Healthy" }) => {
  const hpPercentage = (hp / maxHp) * 100;
  const hpColorClass = hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center border-2 border-red-400">
      <h3 className="text-3xl font-bold text-gray-800 mb-4">{name}</h3>
      <img
        src={spriteSrc || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${name.toLowerCase()}.png`}
        alt={`${name} Sprite`}
        className="w-48 h-48 mx-auto mb-4 object-contain"
      />
      <p className="text-xl text-gray-700">Level: <span className="font-semibold text-blue-600">{level}</span></p>
      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
        <div
          className={`h-4 rounded-full ${hpColorClass}`}
          style={{ width: `${hpPercentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-1">HP: {hp}/{maxHp} ({status})</p>
    </div>
  );
};

export default LeadPokemon;