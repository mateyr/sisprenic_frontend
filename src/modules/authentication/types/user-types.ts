export type AuthContext = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: UserInfo | null;
};

export type UserInfo = {
  user_name: string;
  email: string;
};
