// app/components/UserProfile.tsx
import React from 'react';

interface UserProfileProps {
  userName: string;
  level: number;
  badgesCollected: number;
  avatarSrc?: string; // Optional prop
}

const UserProfile: React.FC<UserProfileProps> = ({ userName, level, badgesCollected, avatarSrc }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
      <img
        src={avatarSrc || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png"}
        alt={`${userName} Avatar`}
        className="w-24 h-24 mx-auto rounded-full border-4 border-yellow-400 mb-4"
      />
      <h3 className="text-2xl font-bold text-gray-800">{userName}</h3>
      <p className="text-lg text-gray-600 mt-2">Level: <span className="font-semibold text-green-600">{level}</span></p>
      <div className="mt-4">
        <h4 className="text-md font-semibold text-gray-700">Abzeichen:</h4>
        <div className="flex justify-center space-x-2 mt-2">
          {badgesCollected > 0 ? (
            Array.from({ length: badgesCollected }).map((_, i) => (
              <span key={i} className="text-yellow-500 text-3xl" title="Badge">🌟</span>
            ))
          ) : (
            <p className="text-sm text-gray-500">Noch keine Abzeichen</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;