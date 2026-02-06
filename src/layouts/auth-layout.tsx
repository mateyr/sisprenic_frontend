import { Outlet } from "@tanstack/react-router";

const AuthLayout = () => {
  return (
    <div>
      <h1>Auth Layout</h1>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
