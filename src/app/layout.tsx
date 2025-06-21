'use client';

import { UserData } from '@/types/user';
import '../styles/globals.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiHome, HiBookOpen } from 'react-icons/hi'; // Example icons

interface RootLayoutProps {
  children: React.ReactNode;
}

// Dummy user data for demonstration

const sidebarLinks = [
  { name: 'Home', href: '/', icon: <HiHome size={24} /> },
  { name: 'Pokédex', href: '/pokedex', icon: <HiBookOpen size={24} /> },
  // Add more links as needed
];

export default function RootLayout({ children }: RootLayoutProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const pathname = usePathname();
  const activeLink = sidebarLinks.find((link) =>
    link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
  );

  useEffect(() => {
    const fetchUserData = async (id: string) => {
      setLoading(true);
      setStatusMessage('Loading player data...');
      try {
        const response = await fetch(`/api/backend/${id}`);

        console.log('Fetch response:', response);

        if (response.status === 400) {
          setStatusMessage(
            'Invalid User: Player data not found. Please ensure you are logged in via the correct URL.'
          );
          setUserData(null);
          localStorage.removeItem('user_id');
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
        console.error('Error fetching user data:', err);
        setStatusMessage('Error loading player data. Please try again later.');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    const storedId = localStorage.getItem('user_id');
    if (storedId) {
      fetchUserData(storedId);
    } else {
      setUserData(null);
      setStatusMessage(
        'Invalid User: No player ID found. Please login via the given URL.'
      );
      setLoading(false);
    }
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100">
        {/* Top Bar */}
        <header className="w-full bg-gray-800 shadow flex items-center px-6 py-3 justify-between border-b border-black">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold tracking-wide text-red-400">
              UGAC
            </span>
          </div>
          {userData && (
            <div className="flex items-center gap-3">
              <span className="font-semibold">{userData?.name}</span>
              <Image
                src={userData?.sprite}
                alt={userData?.name}
                width={40}
                height={40}
                className="rounded-full bg-gray-700"
                unoptimized
              />
            </div>
          )}
        </header>
        {/* Layout with Sidebar */}
        <div className="flex min-h-screen border-l border-black border-t">
          {/* Sidebar */}
          <aside className="w-20 bg-gray-800 border-r border-black flex flex-col py-6 px-2 items-center">
            <nav className="flex flex-col gap-6 w-full items-center">
              {sidebarLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-center w-12 h-12 rounded transition-colors ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'hover:bg-gray-700 text-gray-100'
                    }`}
                    title={link.name}
                  >
                    {link.icon}
                  </a>
                );
              })}
            </nav>
          </aside>
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Selected Sidebar Name at the Top */}
            {activeLink && (
              <div className="bg-gray-900 border-b border-black px-8 py-4 text-2xl font-bold text-red-400 shadow-sm">
                {activeLink.name}
              </div>
            )}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
