import React, { useState, useRef, useEffect } from "react";
import {
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const nama = localStorage.getItem("nama") || "User";
  const role = localStorage.getItem("role") || "owner";

  const roleTitle = {
    owner: "Owner",
    leader: "Leader",
    ba: "Business Analyst",
  };

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="w-full bg-gradient-to-r from-pink-200 via-pink-100 to-pink-50 rounded-2xl shadow-lg border border-pink-100 px-8 py-5 mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        {/* ================= KIRI ================= */}

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#2F243A]">
            Selamat Datang, {nama}
          </h1>

          <p className="mt-2 text-gray-600 text-base">
            <span className="font-medium text-pink-600">{roleTitle[role]}</span>{" "}
            • Pantau performa penjualan skincare secara real-time.
          </p>
        </div>

        {/* ================= KANAN ================= */}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="bg-white rounded-xl border border-pink-100 shadow-md px-4 py-2.5 flex items-center gap-3 hover:shadow-lg transition duration-300"
          >
            <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center">
              <FaUserCircle className="text-2xl text-pink-500" />
            </div>

            <div className="text-left">
              <p className="font-semibold text-sm text-gray-800">{nama}</p>

              <p className="text-xs text-gray-500">{roleTitle[role]}</p>
            </div>

            <FaChevronDown
              className={`text-gray-500 transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-pink-100 overflow-hidden z-50">
              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-pink-50 transition"
              >
                <FaUser className="text-pink-500" />

                <span className="text-gray-700">Profil Saya</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 text-red-500 transition"
              >
                <FaSignOutAlt />

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
