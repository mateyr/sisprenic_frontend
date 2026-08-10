import { AUTH_EXPIRED_EVENT } from "@/lib/http";
import { queryKeys } from "@/lib/query-keys";
import {
  getMe,
  loginRequest,
  logoutRequest,
} from "@/modules/authentication/services/auth-api";
import type {
  AuthContext,
  UserInfo,
} from "@/modules/authentication/types/user-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const meQueryKey = queryKeys.auth.me();

  const [hasStoredUser] = useState(() => !!getStoredUser());

  const meQuery = useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    enabled: hasStoredUser,
    retry: false,
    staleTime: Infinity,
  });

  const user = meQuery.data ?? null;
  const isAuthenticated = !!user;
  const isPending = hasStoredUser && meQuery.isPending;

  useEffect(() => {
    if (!hasStoredUser) return;
    if (meQuery.isSuccess) {
      setStoredUser(meQuery.data);
    } else if (meQuery.isError) {
      setStoredUser(null);
    }
  }, [hasStoredUser, meQuery.isSuccess, meQuery.isError, meQuery.data]);

  const login = useCallback(
    async (userName: string, password: string) => {
      await loginRequest(userName, password);
      const userInfo = await getMe();
      // Flush synchronously so the router's context (fed via the `context`
      // prop on RouterProvider) is updated before the caller runs
      // router.invalidate()/navigate() right after login() resolves.
      flushSync(() => {
        queryClient.setQueryData(meQueryKey, userInfo);
      });
      setStoredUser(userInfo);
      return userInfo;
    },
    [queryClient, meQueryKey],
  );

  const logout = useCallback(async () => {
    flushSync(() => {
      queryClient.setQueryData(meQueryKey, null);
    });
    setStoredUser(null);
    await logoutRequest();
  }, [queryClient, meQueryKey]);

  useEffect(() => {
    function handleSessionExpired() {
      queryClient.setQueryData(meQueryKey, null);
      setStoredUser(null);
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleSessionExpired);
    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleSessionExpired);
  }, [queryClient, meQueryKey]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isPending, user, login, logout }}
    >
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
