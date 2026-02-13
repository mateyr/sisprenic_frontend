import AuthLayout from "@/layouts/auth-layout";
import LogIn from "@/modules/authentication/pages/login";
import { rootRoute } from "@/routes/root";
import { createRoute } from "@tanstack/react-router";

export const authRouteLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth-layout",
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
