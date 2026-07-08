import { AiOutlineUser } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { FaClipboardList, FaUserCircle } from "react-icons/fa";
import { MdOutlineAssessment } from "react-icons/md";

export default function Sidebar() {
  const role = localStorage.getItem("role");
  const nama = localStorage.getItem("nama") || "HEBEPKU";

  const idWilayah = Number(localStorage.getItem("id_wilayah"));

  const wilayah = {
    1: "Pekanbaru",
    2: "Batam",
    3: "Bengkulu",
    4: "Bukittinggi",
    5: "Padang",
  };

  const menuClass = ({ isActive }) =>
    `flex items-center rounded-xl px-5 py-4 font-medium transition-all duration-300 ${
      isActive
        ? "bg-[#E89BC0] text-white shadow-md"
        : "text-[#E9D8F1] hover:bg-[#513560] hover:text-white"
    }`;

  return (
    <aside className="flex min-h-screen w-80 flex-col bg-[#3A2946] p-8 text-white shadow-xl">
      {/* LOGO */}
      <div>
        <h1 className="text-5xl font-bold">
          HEBEPKU<span className="text-pink-300">.</span>
        </h1>

        <p className="text-pink-100 mt-2 text-sm">Sales Management System</p>
      </div>

      {/* MENU */}
      <nav className="mt-10 flex-1">
        <ul className="space-y-3">
          <li>
            <NavLink to="/dashboard" className={menuClass}>
              <RxDashboard className="mr-4 text-xl" />
              Dashboard
            </NavLink>
          </li>

          {role === "owner" && (
            <>
              <li>
                <NavLink to="/data-penjualan" className={menuClass}>
                  <FaClipboardList className="mr-4 text-xl" />
                  Data Penjualan
                </NavLink>
              </li>

              <li>
                <NavLink to="/laporan" className={menuClass}>
                  <MdOutlineAssessment className="mr-4 text-xl" />
                  Laporan
                </NavLink>
              </li>

              <li>
                <NavLink to="/kelola-akun" className={menuClass}>
                  <AiOutlineUser className="mr-4 text-xl" />
                  Kelola Akun
                </NavLink>
              </li>
            </>
          )}

          {role === "leader" && (
            <>
              <li>
                <NavLink to="/data-penjualan" className={menuClass}>
                  <FaClipboardList className="mr-4 text-xl" />
                  Data Penjualan
                </NavLink>
              </li>

              <li>
                <NavLink to="/laporan" className={menuClass}>
                  <MdOutlineAssessment className="mr-4 text-xl" />
                  Laporan
                </NavLink>
              </li>
            </>
          )}

          {role === "ba" && (
            <>
              <li>
                <NavLink to="/input-penjualan" className={menuClass}>
                  <FaClipboardList className="mr-4 text-xl" />
                  Input Penjualan
                </NavLink>
              </li>

              <li>
                <NavLink to="/data-penjualan" className={menuClass}>
                  <FaClipboardList className="mr-4 text-xl" />
                  Data Penjualan
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* FOOTER */}
      <div className="border-t border-[#5A4765] pt-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
            <FaUserCircle className="text-3xl text-pink-500" />
          </div>

          <div>
            <h3 className="font-semibold text-white">{nama}</h3>

            <p className="text-xs text-pink-200">
              {role === "owner"
                ? "Owner"
                : role === "leader"
                  ? "Leader"
                  : "Business Analyst"}
            </p>

            {role !== "owner" && (
              <p className="text-xs text-pink-300 mt-1">
                📍 {wilayah[idWilayah] || "Wilayah belum tersedia"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          © 2026 HEBEPKU
        </div>
      </div>
    </aside>
  );
}
