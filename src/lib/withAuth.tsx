'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function withAuth<P>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { token, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !token) {
        router.push('/login');
      }
    }, [token, loading, router]);

    if (loading) return <p className="p-4">Loading...</p>;

    if (!token) return null;

    return <Component {...props} />;
  };
}
