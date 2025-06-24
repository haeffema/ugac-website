'use client';

import '../globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { HiHome, HiBookOpen } from 'react-icons/hi';
import { RxBackpack } from 'react-icons/rx';
import LoginRedirect from './components/LoginRedirect';
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

  const { user, isLoading, error, fetchCurrentUser } = useUserStore();

  const activeLink = sidebarLinks.find((link) =>
    link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
  );

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    if (id) {
      fetchCurrentUser(id);
    } else {
      router.push('/login');
    }
  }, [fetchCurrentUser, router]);

  useEffect(() => {
    if (!isLoading && !user && error) {
      console.log(
        'User data fetch failed or invalid user. Redirecting to /login (or similar).'
      );
    }
  }, [isLoading, user, error, router]);

  if (isLoading) {
    return (
      <html lang="en">
        <body className="bg-gray-900 text-gray-100 flex items-center justify-center min-h-screen">
          <Suspense fallback={null}>
            <LoginRedirect />
          </Suspense>
          <p className="text-xl">Loading player data...</p>
        </body>
      </html>
    );
  }

  if (error && !user) {
    return (
      <html lang="en">
        <body className="bg-gray-900 text-gray-100 flex items-center justify-center min-h-screen">
          <Suspense fallback={null}>
            <LoginRedirect />
          </Suspense>
          <p className="text-xl text-red-400">{error}</p>
        </body>
      </html>
    );
  }

  if (!user && !isLoading && !error) {
    return (
      <html lang="en">
        <body className="bg-gray-900 text-gray-100 flex items-center justify-center min-h-screen">
          <Suspense fallback={null}>
            <LoginRedirect />
          </Suspense>
          <p>Redirecting...</p> {/* Or a simple loading spinner */}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      {/* Changed `flex-col h-screen` here */}
      <body className="bg-gray-900 text-gray-100 flex flex-col h-screen">
        <Suspense fallback={null}>
          <LoginRedirect />
        </Suspense>
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
        {/* Layout with Sidebar - Changed `min-h-screen` to `flex-1` */}
        <div className="flex flex-1 overflow-hidden">
          {' '}
          {/* Added `overflow-hidden` here */}
          {/* Sidebar */}
          <aside className="w-20 bg-gray-800 flex flex-col py-6 px-2 items-center flex-shrink-0">
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
          {/* Main Content Area - Removed `min-h-screen`, added `flex-1` and `overflow-y-auto` */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1 overflow-y-auto">
              {' '}
              {/* Added p-4 for padding */}
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
