// app/components/ChallengeTeam.tsx
import React from 'react';

// Define type for a single Pokémon in the team
interface TeamPokemon {
  name: string;
  hp: number;
  maxHp: number;
  spriteSrc?: string; // Optional
}

interface ChallengeTeamProps {
  teamName?: string; // Optional
  pokemonList: TeamPokemon[];
}

const ChallengeTeam: React.FC<ChallengeTeamProps> = ({ teamName = "Mein Team", pokemonList }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Aktuelles Team: {teamName}</h3>
      {pokemonList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {pokemonList.map((pokemon) => (
            <div key={pokemon.name} className="flex flex-col items-center p-2 border rounded-md shadow-sm">
              <img
                src={pokemon.spriteSrc || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.name.toLowerCase()}.png`}
                alt={pokemon.name}
                className="w-20 h-20 object-contain"
              />
              <p className="text-md font-semibold text-gray-700 mt-1">{pokemon.name}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${pokemon.hp / pokemon.maxHp * 100 > 50 ? 'bg-green-400' : pokemon.hp / pokemon.maxHp * 100 > 20 ? 'bg-yellow-400' : 'bg-red-400'}`}
                  style={{ width: `${(pokemon.hp / pokemon.maxHp) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Kein Team zugewiesen.</p>
      )}
    </div>
  );
};

export default ChallengeTeam;