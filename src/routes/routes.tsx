import MainLayout from "@/layouts/main-layout/main-layout";
import { getDefaultRoute, isRouteAllowed } from "@/lib/menu-utils";
import { pages } from "@/lib/page-registry";
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

    const menu = context.auth.user?.menu ?? [];

    if (menu.length === 0) {
      const defaultRoute = getDefaultRoute(menu);

      if (location.pathname !== defaultRoute) {
        throw redirect({ to: defaultRoute });
      }

      return;
    }

    if (!isRouteAllowed(menu, location.pathname)) {
      const defaultRoute = getDefaultRoute(menu);
      if (defaultRoute) {
        throw redirect({ to: defaultRoute });
      }
    }
  },
  component: MainLayout,
});

const pageRoutes = pages.map(({ path, component }) =>
  createRoute({
    getParentRoute: () => mainRouteLayout,
    path,
    component,
  }),
);

export const routeTree = rootRoute.addChildren([
  authRouteLayout.addChildren([authIndexRoute, logInRoute]),
  mainRouteLayout.addChildren([...pageRoutes]),
]);
