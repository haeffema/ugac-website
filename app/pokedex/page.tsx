// app/pokedex/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface PokedexEntry {
  id: number;
  name: string;
  type1: string;
  type2?: string; // Optional second type
  description: string;
  spriteUrl: string;
  caught: boolean; // True if caught, false if just seen
}

const dummyPokedexEntries: PokedexEntry[] = [
  { id: 1, name: 'Bulbasaur', type1: 'Grass', type2: 'Poison', description: 'Ein Pflanzen-Pokémon mit einem Samen auf dem Rücken.', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', caught: true },
  { id: 4, name: 'Charmander', type1: 'Fire', description: 'Ein Feuer-Pokémon mit einer Flamme an der Schwanzspitze.', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', caught: true },
  { id: 7, name: 'Squirtle', type1: 'Water', description: 'Ein Wasser-Pokémon, das Wasser aus seinem Mund spuckt.', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', caught: true },
  { id: 25, name: 'Pikachu', type1: 'Electric', description: 'Ein Elektro-Pokémon, das Elektrizität in seinen Backen speichert.', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', caught: true },
  { id: 52, name: 'Meowth', type1: 'Normal', description: 'Ein katzenartiges Pokémon, das Münzen sammelt.', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png', caught: false },
  { id: 133, name: 'Eevee', type1: 'Normal', description: 'Ein Pokémon mit instabilen Genen, das sich vielfältig entwickeln kann.', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png', caught: true },
];

// Helper to get Tailwind color for Pokémon types
const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'fire': return 'bg-red-500';
    case 'water': return 'bg-blue-500';
    case 'grass': return 'bg-green-500';
    case 'electric': return 'bg-yellow-500';
    case 'poison': return 'bg-purple-500';
    case 'normal': return 'bg-gray-400';
    // Add more types as needed
    default: return 'bg-gray-500';
  }
};

export default function PokedexPage() {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [filterCaught, setFilterCaught] = React.useState<boolean>(false);

  const filteredEntries = dummyPokedexEntries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterCaught || entry.caught;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => a.id - b.id); // Sort by ID

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center text-red-800 mb-8">Pokédex</h1>

        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Zurück zur Startseite
        </Link>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Pokémon suchen..."
            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setFilterCaught(!filterCaught)}
            className={`px-6 py-3 rounded-md font-semibold transition-colors duration-200 ${
              filterCaught ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filterCaught ? 'Gefangen anzeigen' : 'Alle anzeigen'}
          </button>
        </div>

        {/* Pokedex Entries Grid */}
        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`border p-4 rounded-lg shadow-sm flex flex-col items-center text-center ${!entry.caught ? 'opacity-60 grayscale' : ''}`}
                title={!entry.caught ? 'Noch nicht gefangen' : ''}
              >
                <img src={entry.spriteUrl} alt={entry.name} className="w-24 h-24 mb-2 object-contain" />
                <h2 className="text-xl font-bold text-gray-800">#{String(entry.id).padStart(3, '0')} {entry.name}</h2>
                <div className="flex space-x-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(entry.type1)}`}>
                    {entry.type1}
                  </span>
                  {entry.type2 && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(entry.type2)}`}>
                      {entry.type2}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-3 flex-grow">{entry.description}</p>
                {/* Could add a "View Details" button here */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">Keine Pokémon gefunden, die den Kriterien entsprechen.</p>
        )}
      </div>
    </div>
  );
}