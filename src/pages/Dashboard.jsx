import React, { useState, useMemo, useRef, useEffect } from "react";
import Header from "../components/Header";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FaDollarSign,
  FaBox,
  FaChevronDown,
  FaStore,
  FaMapMarkerAlt,
  FaTags,
} from "react-icons/fa";

export default function Dashboard() {
  // ===========================
  // ROLE LOGIN
  // ===========================

  const role = localStorage.getItem("role") || "owner";
  const nama = localStorage.getItem("nama") || "Admin Hebepku";
  const user = JSON.parse(localStorage.getItem("user"));

  const roleTitle = {
    owner: "Owner",
    leader: "Leader",
    ba: "Business Analyst",
  };

  const isOwner = role === "owner";
  const isLeader = role === "leader";
  const isBA = role === "ba";

  // ===========================
  // FILTER
  // ===========================

  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ===========================
  // DATA
  // ===========================

  const [salesData, setSalesData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [summary, setSummary] = useState({});
  const [chartData, setChartData] = useState([]);

  const [isBrandOpen, setIsBrandOpen] = useState(false);

  const brandRef = useRef(null);

  // ===========================
  // GET DETAIL PENJUALAN
  // ===========================

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`http://localhost:5000/api/dashboard/detail?id_user=${user.id_user}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setSalesData(result.data);
        }
      })
      .catch(console.log);
  }, []);

  // ===========================
  // GET BRAND
  // ===========================

  useEffect(() => {
    fetch("http://localhost:5000/api/brand")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setBrands(result.data);
        }
      })
      .catch(console.log);
  }, []);

  // ===========================
  // GET SUMMARY
  // ===========================

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`http://localhost:5000/api/dashboard/summary?id_user=${user.id_user}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setSummary(result.summary);
        }
      })
      .catch(console.log);
  }, []);
  // ===========================
  // GET CHART
  // ===========================

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`http://localhost:5000/api/dashboard/chart?id_user=${user.id_user}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setChartData(
            result.data.map((item) => ({
              bulan: item.bulan,

              total_penjualan: Number(item.total_penjualan),
            })),
          );
        }
      })
      .catch(console.log);
  }, []);

  // ===========================
  // LIST BRAND
  // ===========================

  const availableBrands = [
    ...new Set(salesData.map((item) => item.nama_brand)),
  ];

  // ===========================
  // FILTER DATA
  // ===========================

  const filteredData = useMemo(() => {
    return salesData.filter((item) => {
      const wilayah =
        selectedRegion === "ALL" || item.nama_wilayah === selectedRegion;

      const brand =
        selectedBrands.length === 0 || selectedBrands.includes(item.nama_brand);

      const tanggal = item.tanggal_penjualan.substring(0, 10);

      const date =
        (!startDate || tanggal >= startDate) &&
        (!endDate || tanggal <= endDate);

      const ba = !isBA || item.id_user === user.id_user;

      return wilayah && brand && date;
    });
  }, [salesData, selectedRegion, selectedBrands, startDate, endDate]);

  // ===========================
  // FILTER CHART
  // ===========================

  const filteredChartData = useMemo(() => {
    const hasil = [];

    filteredData.forEach((item) => {
      const bulan = item.tanggal_penjualan.substring(0, 7);

      const cek = hasil.find((x) => x.bulan === bulan);

      if (cek) {
        cek.total_penjualan += Number(item.total);
      } else {
        hasil.push({
          bulan,

          total_penjualan: Number(item.total),
        });
      }
    });

    return hasil;
  }, [filteredData]);

  // ===========================
  // TOTAL
  // ===========================

  const totalSales = filteredData.reduce(
    (sum, item) => sum + Number(item.total),

    0,
  );

  const totalQty = filteredData.reduce(
    (sum, item) => sum + Number(item.jumlah),

    0,
  );

  // ===========================
  // TOP 5 PRODUK
  // ===========================

  const topProduk = useMemo(() => {
    const data = {};

    filteredData.forEach((item) => {
      if (!data[item.nama_produk]) {
        data[item.nama_produk] = 0;
      }

      data[item.nama_produk] += Number(item.total);
    });

    return Object.entries(data)
      .map(([nama, total]) => ({ nama, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [filteredData]);

  // ===========================
  // TOP 5 BRAND
  // ===========================

  const topBrand = useMemo(() => {
    const data = {};

    filteredData.forEach((item) => {
      if (!data[item.nama_brand]) {
        data[item.nama_brand] = 0;
      }

      data[item.nama_brand] += Number(item.total);
    });

    return Object.entries(data)
      .map(([nama, total]) => ({ nama, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [filteredData]);

  // ===========================
  // TOP 5 WILAYAH
  // ===========================
  const topWilayah = useMemo(() => {
    const data = {};

    filteredData.forEach((item) => {
      if (!data[item.nama_wilayah]) {
        data[item.nama_wilayah] = 0;
      }

      data[item.nama_wilayah] += Number(item.total);
    });

    return Object.entries(data)
      .map(([nama, total]) => ({ nama, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [filteredData]);

  // ===========================
  // TOP 5 BUSINESS ANALYST
  // ===========================
  const topBA = useMemo(() => {
    const data = {};

    filteredData.forEach((item) => {
      if (!data[item.nama_ba]) {
        data[item.nama_ba] = 0;
      }

      data[item.nama_ba] += Number(item.total);
    });

    return Object.entries(data)
      .map(([nama, total]) => ({ nama, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [filteredData]);

  // ===========================
  // OWNER KPI
  // ===========================

  const totalBrand = new Set(filteredData.map((item) => item.nama_brand)).size;

  const totalWilayah = new Set(filteredData.map((item) => item.nama_wilayah))
    .size;

  const totalToko = new Set(filteredData.map((item) => item.nama_toko)).size;

  const recentSales = [...filteredData]
    .sort(
      (a, b) => new Date(b.tanggal_penjualan) - new Date(a.tanggal_penjualan),
    )
    .slice(0, 5);
  // ===========================
  // FORMAT RUPIAH
  // ===========================

  const formatRupiah = (angka) => {
    return "Rp " + Number(angka).toLocaleString("id-ID");
  };

  const exportExcel = () => {
    const exportData = filteredData.map((item) => ({
      Tanggal: item.tanggal_penjualan,
      Produk: item.nama_produk,
      Brand: item.nama_brand,
      Wilayah: item.nama_wilayah,
      Toko: item.nama_toko,
      Jumlah: item.jumlah,
      Total: item.total,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Penjualan");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(file, "Data_Penjualan.xlsx");
  };
  // ===========================
  // BRAND CHECKBOX
  // ===========================

  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // ===========================
  // CLOSE DROPDOWN
  // ===========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandRef.current && !brandRef.current.contains(event.target)) {
        setIsBrandOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#FFF8FB] min-h-screen">
      {/* ================= FILTER ================= */}

      {!isBA && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="flex items-center flex-wrap gap-5">
            {/* Wilayah hanya Owner */}
            {isOwner && (
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="border border-pink-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-300"
              >
                <option value="ALL">Semua Wilayah</option>

                {[...new Set(salesData.map((item) => item.nama_wilayah))].map(
                  (wilayah) => (
                    <option key={wilayah} value={wilayah}>
                      {wilayah}
                    </option>
                  ),
                )}
              </select>
            )}

            {/* Brand */}
            <div className="relative" ref={brandRef}>
              <button
                className="
w-44
bg-white
border
border-pink-200
rounded-xl
px-5
py-3
flex
justify-between
items-center
shadow-sm
hover:border-pink-400
transition
"
                onClick={() => setIsBrandOpen(!isBrandOpen)}
              >
                Brand
                <FaChevronDown />
              </button>

              {isBrandOpen && (
                <div
                  className="
  absolute
  left-0
  top-full
  mt-2
  w-56
  bg-white
  border
  border-pink-200
  rounded-2xl
  shadow-xl
  p-4
  z-50
  "
                >
                  {brands.map((brand) => (
                    <label
                      key={brand.id_brand}
                      className="flex items-center gap-3 py-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="accent-pink-500"
                        checked={selectedBrands.includes(brand.nama_brand)}
                        onChange={() => handleBrandToggle(brand.nama_brand)}
                      />

                      {brand.nama_brand}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Tanggal Awal */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="
w-48
bg-white
border
border-pink-200
rounded-xl
px-4
py-3
shadow-sm
focus:ring-2
focus:ring-pink-300
outline-none
"
            />

            {/* Tanggal Akhir */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="
w-48
bg-white
border
border-pink-200
rounded-xl
px-4
py-3
shadow-sm
focus:ring-2
focus:ring-pink-300
outline-none
"
            />
          </div>
        </div>
      )}

      {/* ================= CARD ================= */}

      {!isBA ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
          {/* Total Penjualan */}
          <div className="bg-white rounded-3xl border border-pink-100 shadow-md p-6 hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center">
                  <FaDollarSign className="text-pink-500 text-2xl" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total Penjualan</p>

                  <h2 className="text-3xl font-bold text-[#D94C8B] mt-1">
                    {formatRupiah(totalSales)}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Total Produk */}
          <div className="bg-white rounded-3xl border border-pink-100 shadow-md p-6 hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <FaBox className="text-violet-600 text-2xl" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total Produk</p>

                  <h2 className="text-3xl font-bold text-[#7A5AA6] mt-1">
                    {totalQty}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          {/* Total Brand */}

          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FaTags className="text-3xl text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Brand</p>
              <h2 className="text-4xl font-bold">{totalBrand}</h2>
            </div>
          </div>

          {/* Total Wilayah */}

          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
              <FaMapMarkerAlt className="text-3xl text-green-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Wilayah</p>
              <h2 className="text-4xl font-bold">{totalWilayah}</h2>
            </div>
          </div>

          {/* Total Toko */}

          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
              <FaStore className="text-3xl text-orange-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Toko</p>
              <h2 className="text-4xl font-bold">{totalToko}</h2>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Data Hari Ini */}
          <div className="bg-white rounded-3xl border border-pink-100 shadow-md p-6 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center">
                <FaDollarSign className="text-pink-500 text-xl" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Data Hari Ini</p>

                <h2 className="text-3xl font-bold text-[#D94C8B] mt-1">
                  {filteredData.length}
                </h2>
              </div>
            </div>
          </div>

          {/* Total Input */}
          <div className="bg-white rounded-3xl border border-pink-100 shadow-md p-6 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <FaBox className="text-blue-600 text-xl" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Input</p>

                <h2 className="text-3xl font-bold text-blue-600 mt-1">
                  {filteredData.length}
                </h2>
              </div>
            </div>
          </div>

          {/* Produk Diinput */}
          <div className="bg-white rounded-3xl border border-pink-100 shadow-md p-6 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                <FaBox className="text-orange-500 text-xl" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Produk Diinput</p>

                <h2 className="text-3xl font-bold text-orange-500 mt-1">
                  {totalQty}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= GRAFIK ================= */}

      {!isBA ? (
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-5">Grafik Penjualan Bulanan</h2>

          <div
            style={{
              width: "100%",
              height: 280,
            }}
          >
            <ResponsiveContainer>
              <LineChart data={filteredChartData}>
                <CartesianGrid stroke="#F7D5E4" />

                <XAxis dataKey="bulan" />

                <YAxis tickFormatter={(v) => v / 1000 + "K"} />

                <Tooltip formatter={(value) => formatRupiah(value)} />

                <Line
                  type="monotone"
                  dataKey="total_penjualan"
                  stroke="#D94C8B"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Aktivitas Input Terbaru</h2>

          <div className="space-y-3">
            {filteredData.slice(0, 5).map((item) => (
              <div
                key={item.id_penjualan}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-semibold">{item.nama_produk}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.tanggal_penjualan).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>{" "}
                </div>

                <span className="font-bold text-hijau">{item.jumlah} pcs</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isBA && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* TOP PRODUK */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-5 text-[#2F243A]">
              Top 5 Produk
            </h2>

            <div className="space-y-4">
              {topProduk.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-3">
                  <span>{item.nama}</span>

                  <span className="font-semibold text-pink-600">
                    {formatRupiah(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TOP BRAND */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-5 text-[#2F243A]">
              Top 5 Brand
            </h2>

            <div className="space-y-4">
              {topBrand.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-3">
                  <span>{item.nama}</span>

                  <span className="font-semibold text-violet-600">
                    {formatRupiah(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TOP WILAYAH & TOP BA ================= */}

      {isOwner && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* TOP WILAYAH */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-5">Top 5 Wilayah</h2>

            <div className="space-y-3">
              {topWilayah.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <span>{item.nama}</span>

                  <span className="font-semibold text-blue-600">
                    {formatRupiah(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TOP BA */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-5">Top 5 Business Analyst</h2>

            <div className="space-y-3">
              {topBA.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <span>{item.nama}</span>

                  <span className="font-semibold text-green-600">
                    {formatRupiah(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TABEL ================= */}
      {isBA && (
        <p className="text-sm text-gray-500 mb-4">
          Menampilkan data penjualan yang telah Anda input.
        </p>
      )}

      {isOwner && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-5">Penjualan Terbaru</h2>

          <div className="space-y-4">
            {recentSales.map((item) => (
              <div
                key={item.id_penjualan}
                className="flex justify-between border-b pb-3"
              >
                <div>
                  <p className="font-semibold">{item.nama_produk}</p>

                  <p className="text-sm text-gray-500">
                    {item.nama_brand} • {item.nama_wilayah}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-pink-600">
                    {formatRupiah(item.total)}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(item.tanggal_penjualan).toLocaleDateString(
                      "id-ID",
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
