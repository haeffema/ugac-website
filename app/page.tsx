// app/page.tsx
'use client';

// Import components
import ProfessorMessage from './components/ProfessorMessage';
import UserProfile from './components/UserProfile';
import LeadPokemon from './components/LeadPokemon';
import BattleButton from './components/BattleButton';
import ChallengeTeam from './components/ChallengeTeam';
import BagOverview from './components/BagOverview';
import Link from 'next/link'; // Import Link

// --- START: Define Interfaces for your data structures ---
interface UserData {
  name: string;
  level: number;
  badges: number;
  avatar: string;
}

interface LeadPokemonData {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  sprite: string;
  status: string;
}

interface ProfessorMessageDataType {
  message: string;
  professor: string;
}

interface TeamPokemon {
  name: string;
  hp: number;
  maxHp: number;
  spriteSrc: string;
}

interface BagItem {
  name: string;
  quantity: number;
}

interface BagTM {
  name: string;
  number: number;
}
// --- END: Define Interfaces for your data structures ---


// --- START: Your data, now strongly typed and OUTSIDE the Home component ---
const userData: UserData = {
  name: "Ash Ketchum",
  level: 25,
  badges: 5,
  avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/ash.png",
};

const leadPokemonData: LeadPokemonData = {
  name: "Pikachu",
  level: 60,
  hp: 85,
  maxHp: 100,
  sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  status: "Healthy",
};

const professorMessageData: ProfessorMessageDataType = {
  message: "Guten Morgen, Trainer! Vergiss nicht, deine Pokémon zu trainieren und neue Herausforderungen zu suchen!",
  professor: "Professor Eich",
};

const challengeTeamData: TeamPokemon[] = [
  { name: "Charizard", hp: 90, maxHp: 100, spriteSrc: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
  { name: "Blastoise", hp: 75, maxHp: 100, spriteSrc: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" },
  { name: "Venusaur", hp: 100, maxHp: 100, spriteSrc: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" },
  { name: "Snorlax", hp: 60, maxHp: 100, spriteSrc: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" },
];

const bagItemsData: BagItem[] = [
  { name: "Hypertrank", quantity: 3 },
  { name: "Top-Beleber", quantity: 1 },
  { name: "Fluchtseil", quantity: 2 },
];

const bagTmsData: BagTM[] = [
  { name: "Donnerblitz", number: 24 },
  { name: "Erdbeben", number: 26 },
];
// --- END: Your data ---


export default function Home() {
  const handleBattleClick = () => {
    alert("Battle Commencing! (This would navigate to a battle screen)");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar */}
        <nav className="bg-white p-4 rounded-lg shadow-md mb-8 flex justify-center space-x-6">
          <Link href="/shop" className="text-blue-600 hover:text-blue-800 font-semibold text-lg">
            Shop
          </Link>
          <Link href="/tutor" className="text-blue-600 hover:text-blue-800 font-semibold text-lg">
            Trainer
          </Link>
          <Link href="/bag" className="text-blue-600 hover:text-blue-800 font-semibold text-lg">
            Beutel
          </Link>
          <Link href="/pokedex" className="text-blue-600 hover:text-blue-800 font-semibold text-lg">
            Pokédex
          </Link>
        </nav>

        <ProfessorMessage
          message={professorMessageData.message}
          professorName={professorMessageData.professor}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <UserProfile
              userName={userData.name}
              level={userData.level}
              badgesCollected={userData.badges}
              avatarSrc={userData.avatar}
            />
          </div>

          <div className="md:col-span-2">
            <LeadPokemon
              name={leadPokemonData.name}
              level={leadPokemonData.level}
              hp={leadPokemonData.hp}
              maxHp={leadPokemonData.maxHp}
              spriteSrc={leadPokemonData.sprite}
              status={leadPokemonData.status}
            />

            <BattleButton onClick={handleBattleClick} />

            <ChallengeTeam pokemonList={challengeTeamData} />

            {/* You could remove the small BagOverview from here now if the dedicated Bag page is sufficient */}
            {/* <BagOverview items={bagItemsData} tms={bagTmsData} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}