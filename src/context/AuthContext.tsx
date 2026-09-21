import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { logout as logoutRequest, refresh as refreshRequest } from "@/api/auth";
import { setAccessToken } from "@/api/client";
import { PATHS } from "@/routes/paths";

export interface Session {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (session: Session) => void;
  logout: () => void;
}

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(
    () => window.location.pathname !== PATHS.AUTH_CALLBACK,
  );

  const login = useCallback((next: Session) => {
    console.log(next.accessToken);
    setAccessToken(next.accessToken);
    setSession(next);
    setUser(decodeUser(next.accessToken));
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setSession(null);
    setUser(null);
    void logoutRequest();
  }, []);

  useEffect(() => {
    if (window.location.pathname === PATHS.AUTH_CALLBACK) {
      return;
    }

    let cancelled = false;
    refreshRequest().then((result) => {
      if (cancelled) return;
      if (result.success && result.data) {
        login(result.data);
      }
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [login]);

  return (
    <AuthContext.Provider
      value={{ session, user, isAuthenticated: session !== null, isLoading, login, logout }}
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
