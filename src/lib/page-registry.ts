import { lazy } from "react";

export type PageEntry = {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  breadcrumb?: string;
};

export const pages: PageEntry[] = [
  {
    path: "/dashboard",
    breadcrumb: "Panel",
    component: lazy(() => import("@/modules/dashboard/pages/dashboard")),
  },
  {
    path: "/clients",
    breadcrumb: "Clientes",
    component: lazy(() => import("@/modules/clients/pages/client-index")),
  },
  {
    path: "/clients/$clientId",
    breadcrumb: "Detalle",
    component: lazy(() => import("@/modules/clients/pages/client-detail")),
  },
  {
    path: "/loans",
    breadcrumb: "Préstamos",
    component: lazy(() => import("@/modules/loans/pages/loan-index")),
  },
  {
    path: "/loans/new",
    breadcrumb: "Nuevo",
    component: lazy(() => import("@/modules/loans/pages/loan-create")),
  },
  {
    path: "/loans/$loanId",
    breadcrumb: "Detalle",
    component: lazy(() => import("@/modules/loans/pages/loan-detail")),
  },
  {
    path: "/loans/$loanId/edit",
    breadcrumb: "Editar",
    component: lazy(() => import("@/modules/loans/pages/loan-edit")),
  },
  {
    path: "/payments",
    breadcrumb: "Pagos",
    component: lazy(() => import("@/modules/payments/pages/payment-index")),
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
