'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';

const gens = new Generations(Dex);
const selectedGen = gens.get(7);

interface PokedexEntry {
  id: number;
  name: string;
  type1: string;
  type2?: string;
  spriteUrl: string;
  caught: boolean;
  shiny: boolean;
  set: PokemonSet | undefined;
}

interface BackendPokemonStatus {
  name: string;
  caught: boolean;
  shiny: boolean;
  set: PokemonSet | undefined;
}

interface PokemonSet {
  ability: string;
  item: string;
  nature: string;
  moves: string[];
  evs: { [key: string]: number };
  ivs?: { [key: string]: number };
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'normal':
      return 'bg-gray-500';
    case 'fire':
      return 'bg-red-600';
    case 'water':
      return 'bg-blue-600';
    case 'grass':
      return 'bg-green-600';
    case 'electric':
      return 'bg-yellow-400';
    case 'ice':
      return 'bg-blue-300';
    case 'fighting':
      return 'bg-red-700';
    case 'poison':
      return 'bg-purple-600';
    case 'ground':
      return 'bg-yellow-700';
    case 'flying':
      return 'bg-indigo-400';
    case 'psychic':
      return 'bg-pink-600';
    case 'bug':
      return 'bg-lime-600';
    case 'rock':
      return 'bg-amber-800';
    case 'ghost':
      return 'bg-purple-800';
    case 'dragon':
      return 'bg-indigo-700';
    case 'steel':
      return 'bg-gray-600';
    case 'fairy':
      return 'bg-pink-400';
    case 'dark':
      return 'bg-gray-900';
    default:
      return 'bg-gray-700';
  }
};

const pokemonTypes = [
  'All',
  'Normal',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Steel',
  'Fairy',
  'Dark',
];

const formatAndFilterStats = (
  stats: { [key: string]: number },
  defaultValue: number
) => {
  const statMap = {
    hp: 'HP',
    atk: 'Atk',
    def: 'Def',
    spa: 'SpA',
    spd: 'SpD',
    spe: 'Spe',
  };

  // Filter out stats that match the defaultValue (0 for EVs, 31 for IVs)
  const filteredStats = Object.entries(stats).filter(
    ([, val]) => val !== defaultValue
  );

  if (filteredStats.length === 0) {
    return null; // Return null if all stats are default (i.e., all 0 EVs or all 31 IVs)
  }

  return filteredStats
    .map(
      ([stat, val]) =>
        `${val} ${(statMap as Record<string, string>)[stat] || stat}`
    )
    .join(' / ');
};

export default function PokedexPage() {
  const [pokedexEntries, setPokedexEntries] = useState<PokedexEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCaught, setFilterCaught] = useState<boolean>(false);
  const [filterShiny, setFilterShiny] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showSetPopup, setShowSetPopup] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<PokedexEntry | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (showSetPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSetPopup]);

  useEffect(() => {
    const loadPokedexData = async () => {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem('user_id');

      if (!userId) {
        setError(
          'User ID not found. Please go back to the home page and login.'
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/backend/pokedex/${userId}`);
        console.log('Pokedex Backend Fetch response:', response);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Pokedex data not found for this user.');
          }
          throw new Error(
            `Failed to fetch Pokedex data: ${response.statusText}`
          );
        }

        const backendRawData: BackendPokemonStatus[] = await response.json();

        const pokemonData: PokedexEntry[] = [];

        for (const backendEntry of backendRawData) {
          const species = selectedGen.species.get(
            backendEntry.name.toLowerCase()
          );

          if (!species) {
            console.warn(
              `Could not find @pkmn/data entry for Pokémon: ${backendEntry.name}`
            );
            continue;
          }

          const spriteId = backendEntry.name
            .toLowerCase()
            .replace('%', '')
            .replace('dawn-wings', 'dawnwings')
            .replace('dusk-mane', 'duskmane')
            .replace('tapu ', 'tapu')
            .replace('ho-oh', 'hooh')
            .replace('mr. ', 'mr')
            .replace('’', '')
            .replace("pa'u", 'pau')
            .replace('pom-pom', 'pompom');

          const spriteUrl = backendEntry.shiny
            ? `https://play.pokemonshowdown.com/sprites/home-shiny/${spriteId}.png`
            : `https://play.pokemonshowdown.com/sprites/home/${spriteId}.png`;

          const id = species.num;
          const caught = backendEntry.caught;
          const shiny = backendEntry.shiny;

          const type1 = species.types[0];
          const type2 = species.types[1] || undefined;

          pokemonData.push({
            id: id,
            name: species.name,
            type1: type1,
            type2: type2,
            spriteUrl: spriteUrl,
            caught: caught,
            shiny: shiny,
            set: backendEntry.set,
          });
        }

        setPokedexEntries(pokemonData.sort((a, b) => a.id - b.id));
      } catch (err) {
        if (err instanceof Error) {
          setError(
            `Failed to load Pokémon data: ${err.message}. Please try refreshing or checking your login status.`
          );
        } else {
          setError('An unknown error occurred while loading Pokémon data.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPokedexData();
  }, [router]);

  const filteredEntries = useMemo(() => {
    let currentFiltered = pokedexEntries;

    if (searchTerm) {
      currentFiltered = currentFiltered.filter(
        (entry) =>
          entry.name.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
          entry.caught
      );
    }

    if (filterCaught) {
      currentFiltered = currentFiltered.filter((entry) => entry.caught);
    }

    if (filterShiny) {
      currentFiltered = currentFiltered.filter((entry) => entry.shiny);
    }

    if (selectedType !== 'All') {
      currentFiltered = currentFiltered.filter(
        (entry) =>
          entry.type1.toLowerCase() === selectedType.toLowerCase() ||
          (entry.type2 &&
            entry.type2.toLowerCase() === selectedType.toLowerCase())
      );
    }

    return currentFiltered.sort((a, b) => a.id - b.id);
  }, [pokedexEntries, searchTerm, filterCaught, filterShiny, selectedType]);

  const handlePokemonClick = (entry: PokedexEntry) => {
    if (!entry.set) {
      return;
    }
    setSelectedPokemon(entry);
    setShowSetPopup(true);
  };

  const handleClosePopup = () => {
    setShowSetPopup(false);
    setSelectedPokemon(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-5xl font-extrabold text-red-500 text-center mb-8 tracking-wider">
          Pokédex
        </h1>
        <hr className="border-red-500 mb-6" />

        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-700 rounded-md shadow-inner">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-md cursor-pointer"
          >
            {'Home'}
          </button>

          <input
            type="text"
            placeholder="Search Pokémon..."
            className="flex-grow p-3 rounded-md shadow-sm bg-gray-600 text-gray-100 placeholder-gray-400 border border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            onClick={() => setFilterCaught(!filterCaught)}
            className={`px-6 py-3 rounded-md font-semibold transition-colors duration-200 shadow-md cursor-pointer ${
              filterCaught
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
            }`}
          >
            {'Caught'}
          </button>

          <button
            onClick={() => setFilterShiny(!filterShiny)}
            className={`px-6 py-3 rounded-md font-semibold transition-colors duration-200 shadow-md cursor-pointer   ${
              filterShiny
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
            }`}
          >
            {'Shiny'}
          </button>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-3 rounded-md shadow-sm bg-gray-600 text-gray-100 border border-gray-500 focus:ring-blue-500 focus:border-blue-500"
          >
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <hr className="border-red-500 mb-6" />

        {loading && (
          <p className="text-center text-gray-400 mt-8">
            Loading Pokémon data from your journey...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400 mt-8">Error: {error}</p>
        )}

        {!loading && !error && filteredEntries.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No Pokémon found matching your criteria.
          </p>
        )}

        {!loading && !error && filteredEntries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredEntries.map((entry) => (
              <div
                key={entry.name}
                className={`border border-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 ${
                  entry.caught ? 'cursor-pointer' : 'cursor-not-allowed'
                } ${
                  !entry.caught
                    ? 'bg-gray-900 text-gray-400 grayscale blur-sm opacity-90'
                    : 'bg-gray-700 text-gray-100'
                }`}
                title={!entry.caught ? 'Not yet caught' : ''}
                onClick={() => handlePokemonClick(entry)}
              >
                <Image
                  src={entry.spriteUrl}
                  alt={entry.name + (entry.shiny ? ' ⭐' : '')}
                  width={112}
                  height={112}
                  className={`w-28 h-28 mb-2 object-contain ${
                    !entry.caught ? 'filter brightness-0' : ''
                  }`} // Black out if not caught
                  unoptimized
                />
                <h2
                  className={`text-xl font-bold ${
                    !entry.caught ? 'text-gray-400 blur-sm' : 'text-gray-50'
                  }`} // Blur and grey out name
                >
                  {entry.name}{' '}
                  {entry.shiny && (
                    <span className="text-yellow-400 text-lg">⭐</span>
                  )}
                </h2>
                <div className="flex space-x-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(
                      entry.type1
                    )} ${!entry.caught ? 'blur-sm' : ''}`} // Blur type1
                  >
                    {entry.type1}
                  </span>
                  {entry.type2 && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(
                        entry.type2
                      )} ${!entry.caught ? 'blur-sm' : ''}`} // Blur type2
                    >
                      {entry.type2}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSetPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={handleClosePopup}
        >
          <div
            className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full relative text-gray-50 font-mono border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedPokemon && selectedPokemon.set ? (
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Images */}
                <div className="flex flex-col items-center justify-start relative min-w-[210px]">
                  <div className="relative">
                    <Image
                      src={selectedPokemon.spriteUrl}
                      alt={selectedPokemon.name}
                      width={192}
                      height={192}
                      className="w-48 h-48 object-contain"
                      unoptimized
                    />
                    {selectedPokemon.set.item &&
                      selectedPokemon.set.item !== '' && (
                        <Image
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${selectedPokemon.set.item
                            .toLowerCase()
                            .replace(/ /g, '-')
                            .replace(/'/g, '')
                            .replace(/\./g, '')
                            .replace(/é/g, 'e')}.png`}
                          alt={selectedPokemon.set.item}
                          width={15}
                          height={15}
                          className="absolute bottom-2 right-2 w-12 h-12"
                          title={selectedPokemon.set.item}
                          unoptimized
                        />
                      )}
                  </div>
                </div>

                {/* Right: Moves and Details */}
                <div className="flex-1 flex flex-col justify-start">
                  {/* Moves */}
                  <div>
                    <ul className="list-disc list-inside ml-4 mt-8 space-y-2 text-lg">
                      {selectedPokemon.set.moves.map((move, idx) => {
                        const moveData = selectedGen.moves.get(move);
                        return (
                          moveData && (
                            <li key={idx} className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded text-base font-semibold text-white ${getTypeColor(
                                  moveData.type
                                )}`}
                                title={moveData.type}
                                style={{ minWidth: 100, textAlign: 'center' }}
                              >
                                {moveData.type}
                              </span>
                              <span className="ml-2">{moveData.name}</span>
                            </li>
                          )
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400">
                No set details available for this Pokémon.
              </p>
            )}

            {/* Below: Name, Item, Ability, Nature, EVs, IVs */}
            {selectedPokemon && selectedPokemon.set && (
              <div className="mt-6 space-y-2 text-base text-center">
                {/* Name and Item */}
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                  {selectedPokemon.name}
                  {selectedPokemon.set.item &&
                    selectedPokemon.set.item !== '' && (
                      <span className="text-lg font-normal text-gray-300">
                        @ {selectedPokemon.set.item}
                      </span>
                    )}
                </h2>
                {/* Ability */}
                <div>
                  <span className="font-semibold">Ability:</span>{' '}
                  {selectedPokemon.set.ability}
                </div>
                {/* Nature */}
                <div>
                  <span className="font-semibold">Nature:</span>{' '}
                  {selectedPokemon.set.nature}
                </div>
                {/* EVs */}
                {(() => {
                  const formattedEvs = formatAndFilterStats(
                    selectedPokemon.set.evs,
                    0
                  );
                  return (
                    formattedEvs && (
                      <div>
                        <span className="font-semibold">EVs:</span>{' '}
                        {formattedEvs}
                      </div>
                    )
                  );
                })()}
                {/* IVs */}
                {(() => {
                  const formattedIvs = formatAndFilterStats(
                    selectedPokemon.set.ivs ? selectedPokemon.set.ivs : {},
                    31
                  );
                  return (
                    formattedIvs && (
                      <div>
                        <span className="font-semibold">IVs:</span>{' '}
                        {formattedIvs}
                      </div>
                    )
                  );
                })()}
              </div>
            )}

            {/* No set fallback */}
            {(!selectedPokemon || !selectedPokemon.set) && (
              <p className="text-center text-gray-400">
                No set details available for this Pokémon.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
