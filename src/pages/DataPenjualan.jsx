import { useEffect, useState } from "react";

export default function DataPenjualan() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const role = localStorage.getItem("role") || "owner";

  const isOwner = role === "owner";
  const isLeader = role === "leader";
  const isBA = role === "ba";

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/dashboard/detail",
      );

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const formatRupiah = (angka) => {
    return "Rp " + Number(angka).toLocaleString("id-ID");
  };

  const filteredData = data.filter((item) => {
    return (
      item.nama_produk.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_toko.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_brand.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Data Penjualan</h1>

          <p className="text-gray-500 mt-1">
            {isOwner
              ? "Kelola seluruh data penjualan."
              : isLeader
                ? "Melihat data penjualan untuk analisis."
                : "Melihat data penjualan yang telah diinput."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-72"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Tanggal</th>

                <th className="p-3">Produk</th>

                <th className="p-3">Brand</th>

                {!isBA && <th className="p-3">Wilayah</th>}

                <th className="p-3">Toko</th>

                <th className="p-3">Qty</th>

                <th className="p-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={isOwner ? 8 : isBA ? 6 : 7}
                    className="text-center p-6"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={isOwner ? 8 : isBA ? 6 : 7}
                    className="text-center p-6"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id_penjualan}
                    className="border-t hover:bg-gray-50"
                  >
                    {new Date(item.tanggal_penjualan).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                    <td className="p-3">{item.nama_produk}</td>

                    <td className="p-3">{item.nama_brand}</td>

                    {!isBA && <td className="p-3">{item.nama_wilayah}</td>}

                    <td className="p-3">{item.nama_toko}</td>

                    <td className="p-3">{item.jumlah}</td>

                    <td className="p-3">{formatRupiah(item.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
