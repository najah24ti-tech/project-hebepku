import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    role: "",
    password: "",
    konfirmasi: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/profile/${user.id_user}`,
      );

      const result = await response.json();

      if (result.success) {
        setForm({
          nama: result.user.nama,
          email: result.user.email,
          role: result.user.role,
          password: "",
          konfirmasi: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.konfirmasi) {
      alert("Konfirmasi password tidak sama");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/profile/${user.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama: form.nama,
            email: form.email,
            password: form.password,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        const newUser = {
          ...user,
          nama: form.nama,
          email: form.email,
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("nama", form.nama);

        alert("Profil berhasil diperbarui!");

        navigate("/dashboard", { replace: true });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8FB] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3A2946] to-[#E85D9E] py-4 flex flex-col items-center">
            {" "}
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-lg">
              <FaUserCircle className="text-7xl text-pink-500" />
            </div>
            <h1 className="text-white text-l font-bold mt-5">
              {form.nama || "Pengguna"}
            </h1>
            <span className="mt-2 px-5 py-2 rounded-full bg-white/20 text-white capitalize">
              {form.role}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {/* Nama */}
            <div>
              <label className="block mb-2 font-semibold text-[#3A2946]">
                Nama
              </label>

              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-semibold text-[#3A2946]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block mb-2 font-semibold text-[#3A2946]">
                Role
              </label>

              <input
                type="text"
                value={form.role}
                readOnly
                className="w-full rounded-xl bg-gray-100 border border-gray-200 px-4 py-3 capitalize cursor-not-allowed"
              />
            </div>

            {/* Password Baru */}
            <div>
              <label className="block mb-2 font-semibold text-[#3A2946]">
                Password Baru
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Kosongkan jika tidak ingin mengganti password"
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block mb-2 font-semibold text-[#3A2946]">
                Konfirmasi Password
              </label>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="konfirmasi"
                  value={form.konfirmasi}
                  onChange={handleChange}
                  placeholder="Masukkan kembali password"
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Tombol */}
            <button
              type="submit"
              className="w-full bg-[#E85D9E] hover:bg-[#D94C8B] text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
