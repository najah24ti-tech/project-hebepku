export default function PageHeader() {
  return (
    <div className="flex justify-between items-center mt-4">

      <h2 className="font-semibold">Trend Penjualan</h2>

      <div className="flex gap-2">
        <button className="bg-white px-3 py-1 rounded shadow text-sm">
          01 June 2025 - 30 June 2025
        </button>

        <button className="bg-white px-3 py-1 rounded shadow text-sm">
          Semua Kategori
        </button>

        <button className="bg-white px-3 py-1 rounded shadow text-sm">
          Filter
        </button>
      </div>

    </div>
  );
}
