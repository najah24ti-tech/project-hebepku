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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
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
    <div className="w-full bg-gradient-to-r from-pink-200 to-pink-50 rounded-3xl shadow-md border border-pink-100 px-10 py-8 mb-8">

      <div className="flex justify-between items-center">

        {/* Kiri */}

        <div>

          <h1 className="text-5xl font-bold text-[#2F243A]">

            Selamat Datang {roleTitle[role]}, {nama}

          </h1>

          <p className="mt-3 text-gray-600 text-lg">

            Pantau performa penjualan skincare secara real-time.

          </p>

        </div>

        {/* Kanan */}

        <div
          className="relative"
          ref={dropdownRef}
        >

          <button
            onClick={() => setOpen(!open)}
            className="bg-white rounded-2xl border border-pink-100 shadow-md px-5 py-3 flex items-center gap-4 hover:shadow-lg duration-300"
          >

            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">

              <FaUserCircle className="text-3xl text-pink-500" />

            </div>

            <div className="text-left">

              <p className="font-semibold text-gray-800">

                {nama}

              </p>

              <p className="text-sm text-gray-500">

                {roleTitle[role]}

              </p>

            </div>

            <FaChevronDown
              className={`transition ${
                open ? "rotate-180" : ""
              }`}
            />

          </button>

          {open && (

            <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-pink-100 overflow-hidden z-50">

              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-pink-50 duration-200"
              >

                <FaUser className="text-pink-500" />

                Profil Saya

              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 text-red-500 duration-200"
              >

                <FaSignOutAlt />

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}