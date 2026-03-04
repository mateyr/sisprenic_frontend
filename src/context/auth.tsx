import {
  getMe,
  loginRequest,
  logoutRequest,
} from "@/modules/authentication/services/auth-api";
import type {
  AuthContext,
  UserInfo,
} from "@/modules/authentication/types/user-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContext | null>(null);

const USER_STORAGE_KEY = "sisprenic.user";

function getStoredUser(): UserInfo | null {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UserInfo;
  } catch {
    return null;
  }
}

function setStoredUser(user: UserInfo | null): void {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(getStoredUser);
  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string) => {
    await loginRequest(email, password);
    const userInfo = await getMe();
    setUser(userInfo);
    setStoredUser(userInfo);
    return userInfo;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setStoredUser(null);
    await logoutRequest();
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
