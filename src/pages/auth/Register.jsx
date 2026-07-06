import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsFillExclamationDiamondFill, BsFillCheckCircleFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [dataForm, setDataForm] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ba", // default role
  });

  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (dataForm.password !== dataForm.confirmPassword) {
      setError("Konfirmasi password tidak sesuai");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          nama: dataForm.nama,
          email: dataForm.email,
          password: dataForm.password,
          role: dataForm.role,
        }
      );

      if (response.data.success) {
        setSuccess("Registrasi berhasil");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data.message || "Registrasi gagal");
      } else {
        setError("Server tidak dapat dihubungi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">

        <h2 className="text-3xl font-bold text-center mb-2">
          HEBEPKU<span className="text-green-500">.</span>
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Buat Akun Baru
        </p>

        {error && (
          <div className="flex items-center bg-red-100 border border-red-300 text-red-700 rounded-xl p-3 mb-4">
            <BsFillExclamationDiamondFill className="mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center bg-green-100 border border-green-300 text-green-700 rounded-xl p-3 mb-4">
            <BsFillCheckCircleFill className="mr-2" />
            {success}
          </div>
        )}

        {loading && (
          <div className="flex items-center bg-blue-100 border border-blue-300 text-blue-700 rounded-xl p-3 mb-4">
            <ImSpinner2 className="animate-spin mr-2" />
            Memproses...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-2 font-medium">
              Nama
            </label>

            <input
              type="text"
              name="nama"
              value={dataForm.nama}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              placeholder="Masukkan Nama"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={dataForm.email}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              placeholder="Masukkan Email"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              placeholder="********"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Konfirmasi Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={dataForm.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              placeholder="********"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Role
            </label>

            <select
              name="role"
              value={dataForm.role}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            >
              <option value="ba">BA</option>
              <option value="leader">Leader</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Loading..." : "Register"}
          </button>

        </form>

      </div>
    </div>
  );
}