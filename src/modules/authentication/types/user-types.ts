export type MenuItem = {
  id: number;
  name: string;
  route: string;
  icon: string;
  section: string;
  subMenus: MenuItem[];
};

export type UserInfo = {
  user_name: string;
  email: string;
  menu: MenuItem[];
};

export type AuthContext = {
  isAuthenticated: boolean;
  login: (userName: string, password: string) => Promise<UserInfo>;
  logout: () => Promise<void>;
  user: UserInfo | null;
};
