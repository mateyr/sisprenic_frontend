import { lazy } from "react";

type PageEntry = {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
};

export const pages: PageEntry[] = [
  {
    path: "/dashboard",
    component: lazy(() => import("@/modules/dashboard/pages/dashboard")),
  },
  {
    path: "/clients",
    component: lazy(() => import("@/modules/clients/pages/client-index")),
  },

  // TODO:
  // Replace catch route "$" with notFoundComponent
  // when TanStack Router resolves pathless layout matching
  // https://github.com/TanStack/router/pull/6409
  {
    path: "$",
    component: lazy(() => import("@/modules/common/pages/not-found")),
  },
  {
    path: "not-access",
    component: lazy(() => import("@/modules/common/pages/not-access")),
  },
];
