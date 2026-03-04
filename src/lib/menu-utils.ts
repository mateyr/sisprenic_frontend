import type { MenuItem } from "@/modules/authentication/types/user-types";

export function getAllowedRoutes(menu: MenuItem[]): string[] {
  const routes: string[] = [];
  for (const item of menu) {
    routes.push(item.route);
    for (const sub of item.subMenus) {
      routes.push(sub.route);
    }
  }
  return routes;
}

// TODO: Make this function recursive to support deep nested menus
export function getDefaultRoute(menu: MenuItem[]): string | null {
  if (menu.length === 0) return null;
  const first = menu[0];
  return first.subMenus.length > 0 ? first.subMenus[0].route : first.route;
}

export function isRouteAllowed(menu: MenuItem[], pathname: string): boolean {
  const allowedRoutes = getAllowedRoutes(menu);
  return allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}
