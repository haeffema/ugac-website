// app/bag/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface BagItem {
  id: string;
  name: string;
  quantity: number;
  description: string;
  imageUrl: string;
  category: 'Potion' | 'Pokeball' | 'Key Item' | 'Evolution Item' | 'TM';
}

const dummyBagItems: BagItem[] = [
  { id: 'item1', name: 'Hypertrank', quantity: 5, description: 'Stellt 200 KP wieder her.', imageUrl: 'https://archives.bulbagarden.net/media/upload/f/f6/Dream_Hyper_Potion_Sprite.png', category: 'Potion' },
  { id: 'item2', name: 'Top-Beleber', quantity: 2, description: 'Belebt ein Pokémon vollständig.', imageUrl: 'https://archives.bulbagarden.net/media/upload/c/c5/Dream_Revive_Sprite.png', category: 'Potion' },
  { id: 'item3', name: 'Meisterball', quantity: 1, description: 'Fängt jedes Pokémon ohne Fehlschlag.', imageUrl: 'https://archives.bulbagarden.net/media/upload/6/69/Dream_Master_Ball_Sprite.png', category: 'Pokeball' },
  { id: 'item4', name: 'Fluchtseil', quantity: 3, description: 'Flieht sofort aus einer Höhle oder einem Dungeon.', imageUrl: 'https://archives.bulbagarden.net/media/upload/8/87/Dream_Escape_Rope_Sprite.png', category: 'Key Item' },
  { id: 'tm1', name: 'TM24 Donnerblitz', quantity: 1, description: 'Eine starke Elektro-Attacke.', imageUrl: 'https://archives.bulbagarden.net/media/upload/8/87/Bag_TM_sprite.png', category: 'TM' },
  { id: 'tm2', name: 'TM26 Erdbeben', quantity: 1, description: 'Eine starke Boden-Attacke.', imageUrl: 'https://archives.bulbagarden.net/media/upload/8/87/Bag_TM_sprite.png', category: 'TM' },
];

export default function BagPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  const filteredItems = selectedCategory === 'All'
    ? dummyBagItems
    : dummyBagItems.filter(item => item.category === selectedCategory);

  const categories = ['All', ...Array.from(new Set(dummyBagItems.map(item => item.category)))];

  const handleUseItem = (item: BagItem) => {
    alert(`Du hast ${item.name} benutzt!`);
    // Logic to decrease quantity, apply effect, etc.
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center text-brown-800 mb-8">Dein Beutel</h1>

        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Zurück zur Startseite
        </Link>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                selectedCategory === category
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category === 'TM' ? 'TMs' : category === 'Potion' ? 'Tränke' : category === 'Pokeball' ? 'Pokébälle' : category === 'Key Item' ? 'Basis-Items' : 'Alle'}
            </button>
          ))}
        </div>

        {/* Item Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 mb-2 object-contain" />
                <h2 className="text-lg font-semibold text-gray-800">{item.name} x{item.quantity}</h2>
                <p className="text-gray-600 text-sm mt-1 flex-grow">{item.description}</p>
                <button
                  onClick={() => handleUseItem(item)}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md w-full"
                >
                  Benutzen
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">Keine Gegenstände in dieser Kategorie.</p>
        )}
      </div>
    </div>
  );
}