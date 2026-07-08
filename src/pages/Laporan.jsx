import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Laporan() {
  const [laporan, setLaporan] = useState([]);
  const [bulanan, setBulanan] = useState([]);
  const [brand, setBrand] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [awal, setAwal] = useState("");
  const [akhir, setAkhir] = useState("");

  const getLaporan = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/laporan", {
        params: {
          awal,
          akhir,
        },
      });

      setLaporan(res.data.data);

      const bulananRes = await axios.get(
        "http://localhost:5000/api/laporan/bulanan",
      );

      setBulanan(bulananRes.data.data);

      const brandRes = await axios.get(
        "http://localhost:5000/api/laporan/brand",
      );

      setBrand(brandRes.data.data);

      const kategoriRes = await axios.get(
        "http://localhost:5000/api/laporan/kategori",
      );

      setKategori(kategoriRes.data.data);
      console.log(kategoriRes.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLaporan();
  }, []);

  const totalPenjualan = laporan.reduce(
    (sum, item) => sum + Number(item.total_penjualan),
    0,
  );

  const totalProduk = laporan.reduce(
    (sum, item) => sum + Number(item.total_produk),
    0,
  );

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  console.log(kategori);
  const kategoriChart = kategori.map((item) => ({
    ...item,
    total: Number(item.total),
  }));
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-[#2F243A]">Laporan Penjualan</h1>

      <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-5 mb-6">
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={awal}
            onChange={(e) => setAwal(e.target.value)}
            className="border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          <input
            type="date"
            value={akhir}
            onChange={(e) => setAkhir(e.target.value)}
            className="border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          <button
            onClick={getLaporan}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl transition"
          >
            Filter
          </button>

          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition ml-auto">
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Penjualan */}
        <div className="bg-white border border-pink-100 rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Penjualan</p>

            <h2 className="text-3xl font-bold text-pink-600 mt-2">
              Rp {totalPenjualan.toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500 text-3xl">
            💰
          </div>
        </div>

        {/* Total Produk */}
        <div className="bg-white border border-pink-100 rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Produk</p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {totalProduk}
            </h2>
          </div>

          <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-500 text-3xl">
            📦
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-pink-100 overflow-hidden">
        {" "}
        <table className="w-full">
          <thead className="bg-pink-50">
            {" "}
            <tr>
              <th className="p-3">Tanggal</th>

              <th className="p-3">Total Produk</th>

              <th className="p-3">Total Penjualan</th>
            </tr>
          </thead>

          <tbody>
            {laporan.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{formatTanggal(item.tanggal_penjualan)}</td>
                <td className="p-3">{item.total_produk}</td>

                <td className="p-3">
                  Rp {Number(item.total_penjualan).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-8 bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold text-xl mb-4">Penjualan Bulanan</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bulanan}>
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-8 bg-white p-5 rounded-xl shadow">
        <h2 className="font-bold text-xl mb-4">Penjualan Berdasarkan Brand</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={brand}>
            <XAxis dataKey="nama_brand" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-8 bg-white p-5 rounded-xl shadow">
        <h2 className="font-bold text-xl mb-4">
          Penjualan Berdasarkan Kategori
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={kategoriChart}
              dataKey="total"
              nameKey="nama_kategori"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ nama_kategori }) => nama_kategori}
            >
              {kategoriChart.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"][
                      index % 5
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) =>
                "Rp " + Number(value).toLocaleString("id-ID")
              }
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
