import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export interface Session {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

interface AuthContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  login: (session: Session) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const login = useCallback((next: Session) => {
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: session !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
