import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#FFF8FB]">

      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">

        <Header />

        <main className="flex-1 overflow-auto bg-[#FFF8FB] p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}