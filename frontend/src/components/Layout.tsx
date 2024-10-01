import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function PageLayout() {
  return (
    <body>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </body>
  );
}
