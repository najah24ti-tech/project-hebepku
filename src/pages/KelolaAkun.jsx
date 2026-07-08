import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import {
  FaUserPlus,
  FaEdit,
  FaTrashAlt,
  FaUserShield,
  FaUserTag,
  FaUsers,
} from "react-icons/fa";

export default function KelolaAkun() {
  const [users, setUsers] = useState([]);
  const [wilayah, setWilayah] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
    getWilayah();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    role: "ba",
    id_wilayah: "",
    is_active: 1,
  });
  const [editId, setEditId] = useState(null);

  const handleEdit = (user) => {
    setEditId(user.id_user);

    setFormData({
      nama: user.nama,
      email: user.email,
      password: "",
      role: user.role,
      id_wilayah: user.id_wilayah || "",
      is_active: user.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Yakin ingin menghapus ${user.nama}?`)) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id_user}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        getUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");

      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWilayah = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/wilayah");

      const result = await response.json();

      if (result.success) {
        setWilayah(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.nama.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editId
        ? `http://localhost:5000/api/users/${editId}`
        : "http://localhost:5000/api/users";

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      alert(result.message);

      if (result.success) {
        setShowModal(false);
        setEditId(null);

        setFormData({
          nama: "",
          email: "",
          password: "",
          role: "ba",
          id_wilayah: "",
          is_active: 1,
        });

        getUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen space-y-2">
      {/* SECTION TOP: Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-blue-600" />
            Kelola Akun
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manajemen data pengguna sistem dan pengaturan hak akses.
          </p>
        </div>

        {/* <PageHeader /> */}
      </div>

      {/* ================= CARD STATISTIK ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Total User</p>

          <h2 className="text-4xl font-bold mt-2 text-blue-600">
            {users.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Leader</p>

          <h2 className="text-4xl font-bold mt-2 text-orange-500">
            {users.filter((u) => u.role === "leader").length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Business Analyst</p>

          <h2 className="text-4xl font-bold mt-2 text-green-600">
            {users.filter((u) => u.role === "ba").length}
          </h2>
        </div>
      </div>

      {/* SECTION ACTION */}

      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Cari User..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
        >
          <FaUserPlus />
          Tambah User Baru
        </button>
      </div>
      {/* SECTION TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Tidak ada data pengguna.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Nama Pengguna
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>

                  {/* TAMBAHKAN INI */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Wilayah
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id_user}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {user.nama.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {user.nama}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit
    ${
      user.role === "owner"
        ? "bg-yellow-100 text-yellow-700"
        : user.role === "leader"
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
    }`}
                      >
                        {user.role === "owner" ? (
                          <FaUserShield />
                        ) : (
                          <FaUserTag />
                        )}

                        {user.role === "owner"
                          ? "Owner"
                          : user.role === "leader"
                            ? "Leader"
                            : "Business Analyst"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === "owner" ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                          {user.nama_wilayah || "-"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          user.is_active == 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active == 1 ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FaEdit />
                        </button>
                        {user.role !== "owner" && (
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus User"
                          >
                            <FaTrashAlt />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER TABLE: Info & Pagination */}
        <div className="bg-gray-50 px-6 py-3 border-t">
          <span className="text-sm text-gray-500">
            Total User : <strong>{filteredUsers.length}</strong>
          </span>
        </div>
      </div>

      {/* MODAL TAMBAH USER */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold mb-5">
              {editId ? "Edit User" : "Tambah User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nama</label>

                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editId
                      ? "Kosongkan jika tidak ingin mengubah password"
                      : "Masukkan password"
                  }
                  required={!editId}
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                />

                {editId && <p className="text-xs text-gray-500 mt-1"></p>}
              </div>

              <div>
                <label className="text-sm font-medium">Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                >
                  <option value="leader">Leader</option>
                  <option value="ba">Business Analyst</option>
                </select>
              </div>
              {formData.role !== "owner" && (
                <div>
                  <label className="text-sm font-medium">Wilayah</label>

                  <select
                    name="id_wilayah"
                    value={formData.id_wilayah}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2"
                  >
                    <option value="">Pilih Wilayah</option>

                    {wilayah.map((item) => (
                      <option key={item.id_wilayah} value={item.id_wilayah}>
                        {item.nama_wilayah}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Status</label>

                <select
                  name="is_active"
                  value={formData.is_active}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Nonaktif</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);

                    setEditId(null);

                    setFormData({
                      nama: "",
                      email: "",
                      password: "",
                      role: "ba",
                      id_wilayah: "",
                      is_active: 1,
                    });
                  }}
                  className="px-4 py-2 rounded-lg border"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editId ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
