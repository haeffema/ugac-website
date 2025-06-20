"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface UserData {
  discordId: string;
  name: string;
  badges: number;
  money: number;
  encounters: number;
  newEncounters: number;
  sprite: string;
  delay: number;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async (id: string) => {
      setLoading(true);
      setStatusMessage("Loading player data...");
      try {
        const response = await fetch(`/api/backend/${id}`);

        console.log("Fetch response:", response);

        if (response.status === 400) {
          setStatusMessage(
            "Invalid User: Player data not found. Please ensure you are logged in via the correct URL."
          );
          setUserData(null);
          localStorage.removeItem("user_id");
        } else if (!response.ok) {
          throw new Error(
            `Failed to fetch player data: ${response.statusText}`
          );
        } else {
          const data: UserData = await response.json();
          setUserData(data);
          setStatusMessage(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setStatusMessage("Error loading player data. Please try again later.");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    const storedId = localStorage.getItem("user_id");
    if (storedId) {
      fetchUserData(storedId);
    } else {
      setUserData(null);
      setStatusMessage(
        "Invalid User: No player ID found. Please login via the given URL (e.g., /login?id=YOUR_DISCORD_ID)."
      );
      setLoading(false);
    }
  }, []);

  const MAX_BADGES_TO_DISPLAY = 8;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="max-w-xl mx-auto bg-gray-800 p-10 rounded-lg shadow-xl text-center border border-gray-700">
        {loading && (
          <p className="text-xl text-gray-400 mb-6 font-semibold">
            {statusMessage}
          </p>
        )}
        {!loading && statusMessage && !userData && (
          <p className="text-xl text-red-400 mb-6 font-semibold">
            {statusMessage}
          </p>
        )}
        {userData && (
          <>
            <h1 className="text-5xl font-extrabold text-blue-500 mb-6 tracking-wider">
              Trainer {userData.name}
            </h1>
            <div className="flex flex-col items-center justify-center mb-6">
              {userData.sprite && (
                <img
                  src={userData.sprite}
                  alt={`${userData.name}'s trainer sprite`}
                  className="w-48 h-48 rounded-full border-4 border-blue-500 shadow-lg mb-4 object-contain"
                />
              )}
              <p className="text-3xl font-semibold text-gray-50 mb-4">
                {userData.name}
              </p>
            </div>

            <div className="text-center mb-6 border-t border-gray-700 pt-6">
              <p className="text-gray-200 text-xl">
                <span className="font-semibold text-blue-300">
                  Poke Dollar:
                </span>{" "}
                {userData.money.toLocaleString("de-DE")} ₱
              </p>
              <p className="text-gray-200 text-xl">
                <span className="font-semibold text-green-300">Delay:</span>{" "}
                {userData.delay} days
              </p>
            </div>

            <div className="mt-4 border-t border-gray-700 pt-6">
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                Badges:
              </h3>
              <div className="grid grid-cols-4 gap-3 justify-items-center">
                {Array.from({ length: MAX_BADGES_TO_DISPLAY }).map(
                  (_, index) => {
                    const badgeNumber = index + 1;
                    const badgeSrc =
                      badgeNumber <= userData.badges
                        ? `/badges/badge${badgeNumber}.png`
                        : `/badges/empty.png`;
                    return (
                      <img
                        key={index}
                        src={badgeSrc}
                        alt={`Badge ${badgeNumber}`}
                        className="w-16 h-16 object-contain"
                      />
                    );
                  }
                )}
              </div>
            </div>
          </>
        )}

        {userData && (
          <div className="space-y-4 mt-8">
            <Link
              href="/pokedex"
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              Go to Pokédex
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
