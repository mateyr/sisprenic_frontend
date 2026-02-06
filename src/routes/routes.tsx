import AuthLayout from "@/layouts/auth-layout";
import MainLayout from "@/layouts/main-layout";
import Signup from "@/modules/authentication/pages/signup";
import { createRootRoute, createRoute } from "@tanstack/react-router";

const rootRoute = createRootRoute();

// Auth Layout
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AuthLayout,
});

const signUpRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/signup",
  component: Signup,
});

// Main Layout
const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/main",
  component: MainLayout,
});

export const routeTree = rootRoute.addChildren([
  authRoute,
  signUpRoute,
  mainRoute,
]);
