'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import React from 'react';

export function withAuth(Component: React.ComponentType) {
  function Wrapped(props: Record<string, unknown>) {
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
  }
  Wrapped.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;
  return Wrapped;
}
