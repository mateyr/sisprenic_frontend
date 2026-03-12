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
  {
    path: "/clients/$clientId",
    component: lazy(() => import("@/modules/clients/pages/client-detail")),
  },
  {
    path: "/loans",
    component: lazy(() => import("@/modules/loans/pages/loan-index")),
  },
  {
    path: "/loans/new",
    component: lazy(() => import("@/modules/loans/pages/loan-create")),
  },
  {
    path: "/loans/$loanId",
    component: lazy(() => import("@/modules/loans/pages/loan-detail")),
  },
  {
    path: "/loans/$loanId/edit",
    component: lazy(() => import("@/modules/loans/pages/loan-edit")),
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
