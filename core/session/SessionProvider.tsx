import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { createUser, verifyUser } from '@/core/db/users';
import { uuidv4 } from '@/core/utils/uuid';
import { clearSession, loadSession, saveSession, StoredSession } from '@/core/session/sessionStorage';

type SessionState = {
  userId: string | null;
  token: string | null;
  ready: boolean;
};

type SessionContextValue = SessionState & {
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>({
    userId: null,
    token: null,
    ready: false,
  });

  const restore = useCallback(async () => {
    const stored = await loadSession();
    if (!stored) {
      setState({ userId: null, token: null, ready: true });
      return;
    }
    setState({ userId: stored.userId, token: stored.token, ready: true });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const user = await createUser(email, password);
    const token = await uuidv4();
    const session: StoredSession = { userId: user.id, token };
    await saveSession(session);
    setState({ userId: user.id, token, ready: true });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await verifyUser(email, password);
    const token = await uuidv4();
    const session: StoredSession = { userId: user.id, token };
    await saveSession(session);
    setState({ userId: user.id, token, ready: true });
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setState({ userId: null, token: null, ready: true });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      register,
      login,
      logout,
      restore,
    }),
    [state, register, login, logout, restore],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
