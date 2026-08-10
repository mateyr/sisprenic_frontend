import { IconLoader2 } from "@tabler/icons-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import "./App.css";
import { AuthProvider, useAuth } from "./context/auth";
import { HttpError } from "./lib/api-errors";
import { RouteErrorComponent } from "./routes/route-error-component";
import { routeTree } from "./routes/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 4xx errors are permanent (bad request, not found, etc.) — retrying
      // sends the same request and gets the same result. Only retry
      // transient failures (network errors, 5xx) up to 3 times.
      retry: (failureCount, error) => {
        if (error instanceof HttpError && error.status < 500) return false;
        return failureCount < 3;
      },
      // Avoid refetching on every mount/focus; data is considered fresh
      // for 1 minute before a background refetch is triggered.
      staleTime: 60 * 1000,
    },
  },
});

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultErrorComponent: RouteErrorComponent,
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
});

function InnerApp() {
  const auth = useAuth();

  if (auth.isPending) {
    return (
      <div className="flex h-svh items-center justify-center">
        <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
