import AuthLayout from "@/layouts/auth-layout";
import { getDefaultRoute } from "@/lib/menu-utils";
import LogIn from "@/modules/authentication/pages/login";
import { rootRoute } from "@/routes/root";
import { createRoute, redirect } from "@tanstack/react-router";

export const authRouteLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth-layout",
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      const defaultRoute = getDefaultRoute(context.auth.user.menu);
      throw redirect({ to: defaultRoute });
    }
  },
  component: AuthLayout,
});

export const authIndexRoute = createRoute({
  getParentRoute: () => authRouteLayout,
  path: "/",
  component: LogIn,
});

export const logInRoute = createRoute({
  getParentRoute: () => authRouteLayout,
  path: "/login",
  component: LogIn,
});
