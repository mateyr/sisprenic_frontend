import { AUTH_EXPIRED_EVENT } from "@/lib/http";
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
import { flushSync } from "react-dom";

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

  const login = useCallback(async (userName: string, password: string) => {
    await loginRequest(userName, password);
    const userInfo = await getMe();
    // Flush synchronously so the router's context (fed via the `context`
    // prop on RouterProvider) is updated before the caller runs
    // router.invalidate()/navigate() right after login() resolves.
    flushSync(() => {
      setUser(userInfo);
    });
    setStoredUser(userInfo);
    return userInfo;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setStoredUser(null);
    await logoutRequest();
  }, []);

  useEffect(() => {
    if (!getStoredUser()) return;

    let cancelled = false;

    getMe()
      .then((userInfo) => {
        if (cancelled) return;
        setUser(userInfo);
        setStoredUser(userInfo);
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setStoredUser(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
      setStoredUser(null);
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleSessionExpired);
    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleSessionExpired);
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
