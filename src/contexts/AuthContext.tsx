import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { api, User } from "@/lib/api";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<User>;
  signinGoogle: (idToken: string) => Promise<User>;
  signout: () => void;
  updateUser: (patch: Partial<User>) => Promise<User>;
  updateProgress: (subjectId: string, progress: number) => Promise<User>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const u = await api.me();
    setUser(u);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const u = await api.me();
      if (alive) {
        setUser(u);
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const value: AuthCtx = {
    user,
    loading,
    async signin(email, password) {
      const r = await api.signin(email, password);
      setUser(r.user);
      return r.user;
    },
    async signup(email, password, firstName, lastName) {
      const r = await api.signup(email, password, firstName, lastName);
      setUser(r.user);
      return r.user;
    },
    async signinGoogle(idToken) {
      const r = await api.google(idToken);
      setUser(r.user);
      return r.user;
    },
    signout() {
      api.signout();
      setUser(null);
    },
    async updateUser(patch) {
      const u = await api.updateProfile(patch);
      setUser(u);
      return u;
    },
    async updateProgress(subjectId, progress) {
      const u = await api.updateProgress(subjectId, progress);
      setUser(u);
      return u;
    },
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
