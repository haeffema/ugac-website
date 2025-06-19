// app/shop/page.tsx
'use client'; // Needed if you plan to have client-side interactivity like buttons

import React from 'react';
import Link from 'next/link'; // For navigation

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const dummyShopItems: ShopItem[] = [
  { id: '1', name: 'Pokéball', description: 'Ein Ball zum Fangen von Pokémon.', price: 200, imageUrl: 'https://archives.bulbagarden.net/media/upload/f/f6/Dream_Pok%C3%A9_Ball_Sprite.png' },
  { id: '2', name: 'Supertrank', description: 'Stellt 50 KP eines Pokémon wieder her.', price: 700, imageUrl: 'https://archives.bulbagarden.net/media/upload/3/36/Dream_Super_Potion_Sprite.png' },
  { id: '3', name: 'Beleber', description: 'Belebt ein bewusstloses Pokémon mit halber KP.', price: 1500, imageUrl: 'https://archives.bulbagarden.net/media/upload/c/c5/Dream_Revive_Sprite.png' },
  { id: '4', name: 'TM01 (Power-Punch)', description: 'Starke Kampf-Attacke.', price: 3000, imageUrl: 'https://archives.bulbagarden.net/media/upload/8/87/Bag_TM_sprite.png' },
];

export default function ShopPage() {
  const handleBuy = (item: ShopItem) => {
    alert(`Du hast ${item.name} für ${item.price} gekauft!`);
    // In a real app, you'd handle payment, inventory update, etc.
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Pokémon Shop</h1>

        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Zurück zur Startseite
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {dummyShopItems.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 mb-4 object-contain" />
              <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
              <p className="text-gray-600 text-sm mt-1 flex-grow">{item.description}</p>
              <p className="text-lg font-bold text-green-600 mt-3">{item.price} $</p>
              <button
                onClick={() => handleBuy(item)}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md w-full"
              >
                Kaufen
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}