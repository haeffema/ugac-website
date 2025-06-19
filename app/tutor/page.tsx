// app/tutor/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface TutorService {
  id: string;
  name: string;
  description: string;
  cost: number | 'Free';
}

const dummyTutorServices: TutorService[] = [
  { id: '1', name: 'Attacken-Lehrer', description: 'Lehrt einem Pokémon eine spezielle Attacke.', cost: 5000 },
  { id: '2', name: 'Attacken-Verlerner', description: 'Lässt ein Pokémon eine Attacke vergessen.', cost: 'Free' },
  { id: '3', name: 'EV-Reset-Trainer', description: 'Setzt die EV-Verteilung eines Pokémon zurück.', cost: 10000 },
  { id: '4', name: 'Namenstausch', description: 'Ändere den Spitznamen deines Pokémon.', cost: 'Free' },
];

export default function TutorPage() {
  const handleServiceSelect = (service: TutorService) => {
    alert(`Du hast den Service "${service.name}" ausgewählt. ${service.cost !== 'Free' ? `Kosten: ${service.cost} $` : 'Kostenlos!'}`);
    // Implement actual service logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">Pokémon Trainer</h1>

        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Zurück zur Startseite
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {dummyTutorServices.map((service) => (
            <div key={service.id} className="border p-4 rounded-lg shadow-sm flex flex-col">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{service.name}</h2>
              <p className="text-gray-600 flex-grow">{service.description}</p>
              <p className="text-lg font-bold text-purple-600 mt-3">
                Kosten: {typeof service.cost === 'number' ? `${service.cost} $` : service.cost}
              </p>
              <button
                onClick={() => handleServiceSelect(service)}
                className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Service wählen
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}