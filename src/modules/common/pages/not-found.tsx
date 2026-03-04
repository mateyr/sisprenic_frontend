import { useAuth } from "@/context/auth";
import { getDefaultRoute } from "@/lib/menu-utils";
import { Link } from "@tanstack/react-router";

export default function NotFound() {
  const { user } = useAuth();
  const defaultRoute = user ? getDefaultRoute(user.menu) : "/";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground mt-2">
          La página que buscas no existe o no tienes acceso.
        </p>
      </div>
      {defaultRoute && (
        <Link
          to={defaultRoute}
          className="text-primary hover:underline underline-offset-4"
        >
          Volver al inicio
        </Link>
      )}
    </div>
  );
}
