import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginImg from "../../assets/images/loginhebepku.png";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: dataForm.email,
          password: dataForm.password,
        },
      );

      if (response.data.success) {
        const user = response.data.user;
        console.log("USER LOGIN:", user);
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);
        localStorage.setItem("nama", user.nama);
        localStorage.setItem("id_wilayah", user.id_wilayah);
        localStorage.setItem("nama_wilayah", user.nama_wilayah);

        navigate("/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login gagal");
      } else {
        setError("Server tidak dapat dihubungi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8FB] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl bg-white rounded-[35px] overflow-hidden shadow-2xl grid lg:grid-cols-2">
        {/* KIRI */}
        <div className="bg-[#3A2946] flex flex-col justify-between p-12 text-white">
          <div>
            <h1 className="text-5xl font-bold">
              HEBEPKU<span className="text-pink-300">.</span>
            </h1>

            <p className="mt-3 text-pink-100 text-lg">
              Sales Management System
            </p>
          </div>

          <div className="flex justify-center my-8">
            <img src={loginImg} alt="Login" className="w-[350px]" />
          </div>

          <p className="text-center text-pink-200 text-sm">
            Kelola data penjualan skincare dengan mudah, cepat, dan akurat.
          </p>
        </div>

        {/* KANAN */}
        <div className="bg-[#FDF8FB] flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-[#3A2946]">Welcome Back</h2>

            <p className="text-gray-500 mt-2 mb-8">Sign in to your account</p>

            {error && (
              <div className="flex items-center bg-red-100 border border-red-300 text-red-600 rounded-xl p-3 mb-4">
                <BsFillExclamationDiamondFill className="mr-2" />
                {error}
              </div>
            )}

            {loading && (
              <div className="flex items-center bg-blue-100 border border-blue-300 text-blue-600 rounded-xl p-3 mb-4">
                <ImSpinner2 className="animate-spin mr-2" />
                Memproses...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-[#3A2946]">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={dataForm.email}
                  onChange={handleChange}
                  placeholder="Masukkan Email"
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 focus:outline-none focus:border-pink-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#3A2946]">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={dataForm.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full rounded-xl border border-pink-200 px-4 py-3 pr-12 focus:outline-none focus:border-pink-400"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E85D9E] hover:bg-[#D94C8B] text-white rounded-xl py-3 font-semibold transition"
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-8">
              Hubungi <b>Owner</b> apabila Anda belum memiliki akun.
            </p>

            <p className="text-center text-xs text-gray-400 mt-4">
              © 2026 HEBEPKU
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
