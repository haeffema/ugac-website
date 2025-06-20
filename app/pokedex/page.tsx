// app/pokedex/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import { Generations } from "@pkmn/data";
import { Dex } from "@pkmn/dex";

const gens = new Generations(Dex);
const selectedGen = gens.get(7); // Using Generation 7 data as requested

// Define the structure for a Pokedex entry
interface PokedexEntry {
  id: number;
  name: string;
  type1: string;
  type2?: string;
  spriteUrl: string;
  caught: boolean;
  shiny: boolean; // Shiny property remains
  moves: string[];
}

// Interface for the simulated backend response
interface BackendPokemonStatus {
  name: string;
  caught: boolean;
  shiny: boolean;
}

// Helper to get Tailwind color for Pokémon types
const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "normal":
      return "bg-gray-500";
    case "fire":
      return "bg-red-600";
    case "water":
      return "bg-blue-600";
    case "grass":
      return "bg-green-600";
    case "electric":
      return "bg-yellow-400";
    case "ice":
      return "bg-blue-300";
    case "fighting":
      return "bg-red-700";
    case "poison":
      return "bg-purple-600";
    case "ground":
      return "bg-yellow-700";
    case "flying":
      return "bg-indigo-400";
    case "psychic":
      return "bg-pink-600";
    case "bug":
      return "bg-lime-600";
    case "rock":
      return "bg-amber-800";
    case "ghost":
      return "bg-purple-800";
    case "dragon":
      return "bg-indigo-700";
    case "steel":
      return "bg-gray-600";
    case "fairy":
      return "bg-pink-400";
    case "dark":
      return "bg-gray-900";
    default:
      return "bg-gray-700";
  }
};

// List of all common Pokémon types for the dropdown filter
const pokemonTypes = [
  "All", // Option to show all types
  "Normal",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Steel",
  "Fairy",
  "Dark",
];

export default function PokedexPage() {
  const [pokedexEntries, setPokedexEntries] = useState<PokedexEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCaught, setFilterCaught] = useState<boolean>(false);
  const [filterShiny, setFilterShiny] = useState<boolean>(false); // State for shiny filter
  const [selectedType, setSelectedType] = useState<string>("All"); // State for type filter
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const loadPokedexData = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- SIMULATED BACKEND FETCH START ---
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const backendRawData: BackendPokemonStatus[] = [
          { name: "Venusaur", caught: true, shiny: false },
          { name: "Charizard", caught: true, shiny: true }, // Shiny!
          { name: "Blastoise", caught: true, shiny: false },
          { name: "Pikachu", caught: true, shiny: true }, // Shiny!
          { name: "Snorlax", caught: true, shiny: false },
          { name: "Muk-Alola", caught: false, shiny: false },
          { name: "Lucario", caught: true, shiny: false },
          { name: "Zoroark", caught: false, shiny: false },
          { name: "Tapu Koko", caught: true, shiny: true }, // Shiny Gen 7 legendary!
          { name: "Greninja", caught: true, shiny: false },
          { name: "Decidueye", caught: true, shiny: false },
          { name: "Arceus", caught: true, shiny: false },
          { name: "Pichu", caught: false, shiny: true },
          { name: "Eevee", caught: true, shiny: false },
          { name: "Gengar", caught: true, shiny: true },
          { name: "Mewtwo", caught: false, shiny: false },
          { name: "Volcarona", caught: true, shiny: false },
          { name: "Kommo-o", caught: true, shiny: true },
          { name: "Jigglypuff", caught: false, shiny: false },
          { name: "Machamp", caught: true, shiny: false },
        ];
        // --- SIMULATED BACKEND FETCH END ---

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

          const id = species.num;
          const caught = backendEntry.caught;
          const shiny = backendEntry.shiny;

          const type1 = species.types[0];
          const type2 = species.types[1] || undefined;

          const spriteBaseName = species.spriteid || species.id;
          const spriteUrl = shiny
            ? `https://play.pokemonshowdown.com/sprites/home-shiny/${spriteBaseName}.png`
            : `https://play.pokemonshowdown.com/sprites/home/${spriteBaseName}.png`;

          const moves: string[] = [];
          const learnset = selectedGen.learnsets.get(species.id);

          if (learnset && learnset.learnset) {
            const learnableMoves = Object.keys(learnset.learnset);
            for (let i = 0; i < Math.min(5, learnableMoves.length); i++) {
              const moveName = selectedGen.moves.get(learnableMoves[i])?.name;
              if (moveName) {
                moves.push(moveName);
              }
            }
          }

          pokemonData.push({
            id: id,
            name: species.name,
            type1: type1,
            type2: type2,
            spriteUrl: spriteUrl,
            caught: caught,
            shiny: shiny,
            moves: moves,
          });
        }

        setPokedexEntries(pokemonData.sort((a, b) => a.id - b.id));
      } catch (err) {
        if (err instanceof Error) {
          setError(
            `Failed to load Pokémon data: ${err.message}. Make sure @pkmn/data and @pkmn/dex are installed correctly.`
          );
        } else {
          setError("An unknown error occurred while loading Pokémon data.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPokedexData();
  }, []);

  const filteredEntries = useMemo(() => {
    let currentFiltered = pokedexEntries;

    if (searchTerm) {
      currentFiltered = currentFiltered.filter((entry) =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCaught) {
      currentFiltered = currentFiltered.filter((entry) => entry.caught);
    }

    // Filter by shiny status
    if (filterShiny) {
      currentFiltered = currentFiltered.filter((entry) => entry.shiny);
    }

    if (selectedType !== "All") {
      currentFiltered = currentFiltered.filter(
        (entry) =>
          entry.type1.toLowerCase() === selectedType.toLowerCase() ||
          (entry.type2 &&
            entry.type2.toLowerCase() === selectedType.toLowerCase())
      );
    }

    return currentFiltered.sort((a, b) => a.id - b.id);
  }, [pokedexEntries, searchTerm, filterCaught, filterShiny, selectedType]);

  const handlePokemonClick = (id: number) => {
    setSelectedPokemonId(selectedPokemonId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-5xl font-extrabold text-red-500 text-center mb-8 tracking-wider">
          Pokédex
        </h1>
        <hr className="border-red-500 mb-6" />

        <Link
          href="/"
          className="text-blue-400 hover:underline mb-4 inline-block transition-colors duration-200"
        >
          &larr; Back to Home
        </Link>

        {/* --- Filter Options --- */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-700 rounded-md shadow-inner">
          <input
            type="text"
            placeholder="Search Pokémon..."
            className="flex-grow p-3 rounded-md shadow-sm bg-gray-600 text-gray-100 placeholder-gray-400 border border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Caught Filter Button */}
          <button
            onClick={() => setFilterCaught(!filterCaught)}
            className={`px-6 py-3 rounded-md font-semibold transition-colors duration-200 shadow-md ${
              filterCaught
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-600 text-gray-200 hover:bg-gray-500"
            }`}
          >
            {"Caught"}
          </button>

          {/* Shiny Filter Button (now same style as Caught) */}
          <button
            onClick={() => setFilterShiny(!filterShiny)}
            className={`px-6 py-3 rounded-md font-semibold transition-colors duration-200 shadow-md ${
              filterShiny
                ? "bg-yellow-600 text-white hover:bg-yellow-700" // Shiny specific color
                : "bg-gray-600 text-gray-200 hover:bg-gray-500"
            }`}
          >
            {"Shiny"}
          </button>

          {/* Type Filter Dropdown */}
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
        {/* --- End Filter Options --- */}
        <hr className="border-red-500 mb-6" />

        {loading && (
          <p className="text-center text-gray-400 mt-8">
            Loading Pokémon data from local library...
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

        {/* Pokedex Entries Grid */}
        {!loading && !error && filteredEntries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`border border-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 ${
                  !entry.caught
                    ? "bg-gray-900 text-gray-400 grayscale blur-sm opacity-90"
                    : "bg-gray-700 text-gray-100"
                }`}
                title={!entry.caught ? "Not yet caught" : ""}
              >
                {!entry.caught ? (
                  <>
                    <div className="w-24 h-24 mb-2 flex items-center justify-center text-gray-500 text-5xl font-bold">
                      ?
                    </div>
                    <h2 className="text-xl font-bold text-gray-400">
                      #{String(entry.id).padStart(3, "0")} ?????
                    </h2>
                    <div className="flex space-x-2 mt-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-500">
                        ???
                      </span>
                      {entry.type2 && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-500">
                          ???
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={entry.spriteUrl}
                      alt={entry.name + (entry.shiny ? " ⭐" : "")}
                      className="w-28 h-28 mb-2 object-contain"
                    />
                    <h2 className="text-xl font-bold text-gray-50">
                      #{String(entry.id).padStart(3, "0")} {entry.name}{" "}
                      {entry.shiny && ( // Changed to a star symbol
                        <span className="text-yellow-400 text-lg">⭐</span>
                      )}
                    </h2>
                    <div className="flex space-x-2 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(
                          entry.type1
                        )}`}
                      >
                        {entry.type1}
                      </span>
                      {entry.type2 && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(
                            entry.type2
                          )}`}
                        >
                          {entry.type2}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handlePokemonClick(entry.id)}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
                    >
                      {selectedPokemonId === entry.id
                        ? "Hide Moves"
                        : "Show Moves"}
                    </button>
                    {selectedPokemonId === entry.id &&
                      entry.moves &&
                      entry.moves.length > 0 && (
                        <div className="mt-2 text-left w-full max-h-24 overflow-y-auto border-t border-gray-600 pt-2 scrollbar-hide">
                          <h3 className="font-semibold text-gray-200 text-sm mb-1">
                            Moves:
                          </h3>
                          <ul className="list-disc list-inside text-gray-300 text-xs">
                            {entry.moves.map((moveName, index) => (
                              <li key={index}>{moveName}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
