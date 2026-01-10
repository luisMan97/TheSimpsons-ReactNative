import React, { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { initializeDatabase } from '@/core/db';
import { SessionProvider, useSession } from '@/core/session/SessionProvider';
import { LoadingState } from '@/components/states';

function BootstrapGate({ children }: { children: React.ReactNode }) {
  const { restore, ready } = useSession();
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const boot = async () => {
      try {
        await initializeDatabase();
        if (active) {
          setDbReady(true);
        }
        await restore();
      } catch (err) {
        if (active) {
          setError('No se pudo preparar la base de datos local.');
        }
      }
    };
    boot();
    return () => {
      active = false;
    };
  }, [restore]);

  if (!dbReady || !ready) {
    return <LoadingState message={error ?? 'Preparando la app...'} />;
  }

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const client = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 1000 * 60,
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={client}>
      <SessionProvider>
        <BootstrapGate>{children}</BootstrapGate>
      </SessionProvider>
    </QueryClientProvider>
  );
}
