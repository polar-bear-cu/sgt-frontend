import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export interface Session {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface StoredSession extends Session {
  expiresAt: number;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (session: Session) => void;
  logout: () => void;
}

const STORAGE_KEY = "sgt_session";

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeUser(accessToken: string): User | null {
  try {
    const payload = accessToken.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const claims = JSON.parse(json) as {
      sub?: string;
      email?: string;
      name?: string;
      picture?: string;
    };
    if (!claims.sub || !claims.email) return null;
    return { id: claims.sub, email: claims.email, name: claims.name, picture: claims.picture };
  } catch {
    return null;
  }
}

function loadStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredSession;
    if (stored.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadStoredSession);
  const [user, setUser] = useState<User | null>(() =>
    session ? decodeUser(session.accessToken) : null,
  );

  const login = useCallback((next: Session) => {
    const stored: StoredSession = { ...next, expiresAt: Date.now() + next.expiresIn * 1000 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setSession(next);
    setUser(decodeUser(next.accessToken));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, user, isAuthenticated: session !== null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
