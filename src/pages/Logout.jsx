import {
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logoutImg from "../assets/images/logout.png";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");

    navigate("/login", { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh]">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden">

        <div className="grid grid-cols-2">

          {/* ================= Gambar ================= */}

          <div className="bg-[#3A2946] flex items-center justify-center p-10">

            <img
              src={logoutImg}
              alt="Logout"
              className="w-[320px] object-contain"
            />

          </div>

          {/* ================= Konten ================= */}

          <div className="flex flex-col justify-center px-12 py-10">

            <h1 className="text-5xl font-bold text-[#2F243A] mb-5">
              Logout
            </h1>

            <p className="text-lg text-gray-500 leading-8">
              Apakah Anda yakin ingin keluar dari aplikasi
              <span className="font-semibold text-[#E85D9E]">
                {" "}HEBEPKU
              </span>
              ?
            </p>

            <p className="text-gray-400 mt-3">
              Pastikan seluruh data sudah tersimpan sebelum mengakhiri sesi.
            </p>

            <div className="flex gap-5 mt-12">

              <button
                onClick={() => navigate(-1)}
                className="flex-1 h-14 rounded-2xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                <div className="flex items-center justify-center gap-3">

                  <FaArrowLeft />

                  Batalkan

                </div>
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 h-14 rounded-2xl bg-[#E85D9E] hover:bg-[#D94C8B] text-white font-semibold transition"
              >
                <div className="flex items-center justify-center gap-3">

                  <FaSignOutAlt />

                  Logout

                </div>
              </button>

            </div>

            <p className="text-center text-xs text-gray-400 mt-10">
              © 2026 HEBEPKU
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}