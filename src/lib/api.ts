/**
 * API client for ILM Hub.
 *
 * The frontend never talks to MongoDB directly (browser cannot, and it would
 * leak your connection string). Point VITE_API_URL to your Node/Express
 * backend that owns the Mongo connection. Until that backend is live,
 * requests fall back to the in-memory mock implementation below so the
 * whole UI is fully usable for design/demo.
 */

export const API_URL = import.meta.env.VITE_API_URL as string | undefined;

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  grade?: number;
  goal?: "school" | "experiments" | "exam" | "games";
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

const MOCK_KEY = "ilm.mock.user";
const TOKEN_KEY = "ilm.token";

function loadMockUser(): User | null {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
function saveMockUser(u: User | null) {
  if (u) localStorage.setItem(MOCK_KEY, JSON.stringify(u));
  else localStorage.removeItem(MOCK_KEY);
}

function makeMockUser(email: string, name?: string): User {
  return {
    id: crypto.randomUUID(),
    email,
    name: name || email.split("@")[0],
    xp: 1240,
    level: 4,
    streak: 7,
    createdAt: new Date().toISOString(),
  };
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("API_URL not configured");
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // ---------------- Auth ----------------
  async signin(email: string, _password: string): Promise<AuthResult> {
    if (API_URL) return http<AuthResult>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password: _password }),
    });
    const user = loadMockUser() ?? makeMockUser(email);
    saveMockUser(user);
    const token = "mock-token";
    localStorage.setItem(TOKEN_KEY, token);
    return { user, token };
  },

  async signup(email: string, _password: string, name: string): Promise<AuthResult> {
    if (API_URL) return http<AuthResult>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password: _password, name }),
    });
    const user = makeMockUser(email, name);
    saveMockUser(user);
    const token = "mock-token";
    localStorage.setItem(TOKEN_KEY, token);
    return { user, token };
  },

  async google(idToken: string): Promise<AuthResult> {
    if (API_URL) return http<AuthResult>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
    const user = loadMockUser() ?? makeMockUser("google.user@ilm.uz", "Google User");
    saveMockUser(user);
    localStorage.setItem(TOKEN_KEY, "mock-token");
    return { user, token: "mock-token" };
  },

  async sendCode(email: string): Promise<{ ok: true }> {
    if (API_URL) return http("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    // mock — always 123456
    console.info("[mock] verification code is 123456 for", email);
    return { ok: true };
  },

  async verifyCode(email: string, code: string): Promise<{ ok: boolean }> {
    if (API_URL) return http("/api/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    return { ok: code === "123456" };
  },

  async resetPassword(email: string, code: string, newPassword: string) {
    if (API_URL) return http("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, code, newPassword }),
    });
    return { ok: true };
  },

  // ---------------- Profile ----------------
  async me(): Promise<User | null> {
    if (API_URL) {
      try { return await http<User>("/api/users/me"); } catch { return null; }
    }
    return loadMockUser();
  },

  async updateProfile(patch: Partial<User>): Promise<User> {
    if (API_URL) return http<User>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    const current = loadMockUser();
    if (!current) throw new Error("Not authenticated");
    const next = { ...current, ...patch };
    saveMockUser(next);
    return next;
  },

  signout() {
    localStorage.removeItem(TOKEN_KEY);
    saveMockUser(null);
  },
};
