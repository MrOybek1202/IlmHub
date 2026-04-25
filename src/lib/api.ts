/**
 * API client for ILM Hub.
 *
 * The frontend never talks to MongoDB directly (browser cannot, and it would
 * leak your connection string). Point VITE_API_URL to your Node/Express
 * backend that owns the Mongo connection. Until that backend is live,
 * requests fall back to the in-memory mock implementation below so the
 * whole UI is fully usable for design/demo.
 */

// Use empty string so requests are relative (e.g. /api/auth/...) and go through Vite proxy
export const API_URL = "";
const USE_BACKEND = true;

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
  if (!USE_BACKEND) throw new Error("API_URL not configured");
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
    try {
      const parsed = text ? JSON.parse(text) : null;
      const message =
        parsed?.message ||
        parsed?.error?.message ||
        (typeof parsed?.error === "string" ? parsed.error : "");
      throw new Error(message || `Request failed: ${res.status}`);
    } catch {
      throw new Error(text || `Request failed: ${res.status}`);
    }
  }
  return res.json() as Promise<T>;
}

export const api = {
  // ---------------- Auth ----------------
  async signin(email: string, _password: string): Promise<AuthResult> {
    if (USE_BACKEND) {
      const res = await http<AuthResult>("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password: _password }),
      });
      saveMockUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.token);
      return res;
    }
    const user = loadMockUser() ?? makeMockUser(email);
    saveMockUser(user);
    const token = "mock-token";
    localStorage.setItem(TOKEN_KEY, token);
    return { user, token };
  },

  async signup(email: string, _password: string, name: string): Promise<AuthResult> {
    if (USE_BACKEND) {
      const res = await http<AuthResult>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password: _password, name }),
      });
      saveMockUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.token);
      return res;
    }
    const user = makeMockUser(email, name);
    saveMockUser(user);
    const token = "mock-token";
    localStorage.setItem(TOKEN_KEY, token);
    return { user, token };
  },

  async google(idToken: string): Promise<AuthResult> {
    if (USE_BACKEND) {
      const res = await http<AuthResult>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      saveMockUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.token);
      return res;
    }
    const user = loadMockUser() ?? makeMockUser("google.user@ilm.uz", "Google User");
    saveMockUser(user);
    localStorage.setItem(TOKEN_KEY, "mock-token");
    return { user, token: "mock-token" };
  },

  async sendCode(email: string): Promise<{ ok: true }> {
    if (USE_BACKEND) return http("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    console.info("[mock] verification code is mock for", email);
    return { ok: true };
  },

  async verifyCode(email: string, code: string): Promise<{ ok: boolean }> {
    if (USE_BACKEND) return http("/api/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    return { ok: code.length === 6 };
  },

  async resetPassword(email: string, code: string, newPassword: string) {
    if (USE_BACKEND) return http("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, code, newPassword }),
    });
    return { ok: true };
  },

  // ---------------- Profile ----------------
  async me(): Promise<User | null> {
    // Bypassing backend for profile per user request
    return loadMockUser();
    return loadMockUser();
  },

  async updateProfile(patch: Partial<User>): Promise<User> {
    // Bypassing backend for profile per user request
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
