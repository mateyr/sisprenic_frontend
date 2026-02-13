import MainLayout from "@/layouts/main-layout";
import ClientIndex from "@/modules/clients/pages/client-index";
import {
  authIndexRoute,
  authRouteLayout,
  logInRoute,
} from "@/routes/auth-routes";
import { rootRoute } from "@/routes/root";
import { createRoute, redirect } from "@tanstack/react-router";

// Main Layout
const mainRouteLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "main-route",
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: MainLayout,
});

const clientRoute = createRoute({
  getParentRoute: () => mainRouteLayout,
  path: "/clients",
  component: ClientIndex,
});

export const routeTree = rootRoute.addChildren([
  authRouteLayout.addChildren([authIndexRoute, logInRoute]),
  mainRouteLayout.addChildren([clientRoute]),
]);
