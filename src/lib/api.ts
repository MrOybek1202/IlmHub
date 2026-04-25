/**
 * API client for ILM Hub.
 */

// Use empty string so requests are relative (e.g. /api/auth/...) and go through Vite proxy
export const API_URL = "";
const USE_BACKEND = true;

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatarUrl?: string;
  grade?: number;
  goal?: "school" | "experiments" | "exam" | "games";
  xp: number;
  level: number;
  streak: number;
  subjectProgress?: Record<string, number>;
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
  const parts = (name || email.split("@")[0]).split(" ");
  const firstName = parts[0] || "User";
  const lastName = parts.slice(1).join(" ");
  return {
    id: crypto.randomUUID(),
    email,
    firstName,
    lastName,
    name: [firstName, lastName].filter(Boolean).join(" "),
    xp: 1240,
    level: 4,
    streak: 7,
    subjectProgress: {},
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

  async signup(email: string, _password: string, firstName: string, lastName: string = ""): Promise<AuthResult> {
    const name = `${firstName} ${lastName}`.trim();
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

  async google(token: string): Promise<AuthResult> {
    if (USE_BACKEND) {
      const res = await http<AuthResult>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken: token, accessToken: token }),
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

  async sendCode(email: string, type: 'signup' | 'reset' = 'signup'): Promise<{ ok: true }> {
    if (USE_BACKEND) return http("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify({ email, type }),
    });
    console.info("[mock] verification code is mock for", email, type);
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
    if (USE_BACKEND) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return null;
      try {
        const user = await http<User>("/api/users/me");
        saveMockUser(user);
        return user;
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        saveMockUser(null);
        return null;
      }
    }
    return loadMockUser();
  },

  async updateProfile(patch: Partial<User>): Promise<User> {
    if (USE_BACKEND) {
      const next = await http<User>("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      saveMockUser(next);
      return next;
    }
    const current = loadMockUser();
    if (!current) throw new Error("Not authenticated");
    const next = { ...current, ...patch };
    saveMockUser(next);
    return next;
  },

  async updateProgress(subjectId: string, progress: number): Promise<User> {
    if (USE_BACKEND) {
      const next = await http<User>("/api/users/progress", {
        method: "POST",
        body: JSON.stringify({ subjectId, progress }),
      });
      saveMockUser(next);
      return next;
    }
    const current = loadMockUser();
    if (!current) throw new Error("Not authenticated");
    const subjectProgress = { ...(current.subjectProgress || {}), [subjectId]: progress };
    const next = { ...current, subjectProgress };
    saveMockUser(next);
    return next;
  },

  signout() {
    localStorage.removeItem(TOKEN_KEY);
    saveMockUser(null);
  },
};
