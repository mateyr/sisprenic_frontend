import { lazy } from "react";

type PageEntry = {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
}

export const pages: PageEntry[] = [
  {
    path: "/dashboard",
    component: lazy(
      () => import("@/modules/dashboard/pages/dashboard"),
    ),
  },
  {
    path: "/clients",
    component: lazy(() => import("@/modules/clients/pages/client-index")),
  },
];
