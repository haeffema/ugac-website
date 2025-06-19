// app/components/BagOverview.tsx
import React from 'react';

// Define types for items and TMs
interface BagItem {
  name: string;
  quantity: number;
}

interface BagTM {
  name: string;
  number: number;
}

interface BagOverviewProps {
  items: BagItem[];
  tms: BagTM[];
}

const BagOverview: React.FC<BagOverviewProps> = ({ items, tms }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Tasche</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Gegenstände:</h4>
          {items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-600">
                  <span className="text-xl">✨</span>
                  <span>{item.name} x{item.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Keine Gegenstände im Beutel.</p>
          )}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">TMs:</h4>
          {tms.length > 0 ? (
            <ul className="space-y-2">
              {tms.map((tm, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-600">
                  <span className="text-xl">💿</span>
                  <span>{tm.name} (TM{tm.number})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Keine TMs im Beutel.</p>
          )}
        </div>
      </div>
      <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full">
        Alle Gegenstände anzeigen
      </button>
    </div>
  );
};

export default BagOverview;