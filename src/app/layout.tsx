'use client';

import '../globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HiHome, HiBookOpen } from 'react-icons/hi';
import { RxBackpack } from 'react-icons/rx';

import { useUserStore } from '../userStore';

interface RootLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  { name: 'Home', href: '/', icon: <HiHome size={24} /> },
  { name: 'Pokédex', href: '/pokedex', icon: <HiBookOpen size={24} /> },
  { name: 'Items', href: '/items', icon: <RxBackpack size={24} /> },
];

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isLoading, error, fetchCurrentUser, clearUser } =
    useUserStore();

  const activeLink = sidebarLinks.find((link) =>
    link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
  );

  useEffect(() => {
    if (!user && !isLoading && !error) {
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        fetchCurrentUser(storedUserId);
      } else {
        console.log(
          'No user_id found in localStorage. Redirecting to /login (or similar).'
        );
        router.push('/login');
      }
    }
  }, [user, isLoading, error, fetchCurrentUser, router]);

  useEffect(() => {
    if (!isLoading && !user && error) {
      console.log(
        'User data fetch failed or invalid user. Redirecting to /login (or similar).'
      );
      router.push('/login');
    }
  }, [isLoading, user, error, router]);

  if (isLoading) {
    return (
      <html lang="en">
        <body className="bg-gray-900 text-gray-100 flex items-center justify-center min-h-screen">
          <p className="text-xl">Loading player data...</p>
        </body>
      </html>
    );
  }

  if (error && !user) {
    return (
      <html lang="en">
        <body className="bg-gray-900 text-gray-100 flex items-center justify-center min-h-screen">
          <p className="text-xl text-red-400">{error}</p>
        </body>
      </html>
    );
  }

  if (!user && !isLoading && !error) {
    return (
      <html lang="en">
        <body className="bg-gray-900 text-gray-100 flex items-center justify-center min-h-screen">
          <p>Redirecting...</p> {/* Or a simple loading spinner */}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="w-full bg-gray-800 shadow flex items-center px-6 py-3 justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {activeLink && (
              <span className="text-2xl font-bold tracking-wide text-red-400">
                {activeLink.name}
              </span>
            )}
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className="font-semibold">{user.name}</span>
              <Image
                src={user.sprite}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full bg-gray-700"
                unoptimized
              />
            </div>
          )}
        </header>
        {/* Layout with Sidebar */}
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-20 bg-gray-800 flex flex-col py-6 px-2 items-center">
            <nav className="flex flex-col gap-6 w-full items-center">
              {sidebarLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
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
                  </Link>
                );
              })}
            </nav>
          </aside>
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen">
            <main className="overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
