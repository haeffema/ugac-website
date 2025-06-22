'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function LoginRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/login') {
      const id = searchParams.get('id');
      if (id) {
        localStorage.setItem('user_id', id);
      }
      router.push('/');
    }
  }, [searchParams, router, pathname]);

  return null;
}
