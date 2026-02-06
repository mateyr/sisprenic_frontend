import { Outlet } from "@tanstack/react-router";

const MainLayout = () => {
  return (
    <div>
      <h1>Main Layout</h1>
      <Outlet />
    </div>
  );
};

export default MainLayout;
