import PageHeader from "../components/PageHeader";
import { FaDollarSign, FaBox, FaChartLine, FaStar } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="bg-[#e9cfcf] p-4 rounded-lg space-y-4">

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Sales" value="RP 123.456.000" icon={<FaDollarSign />} color="bg-blue-100 text-blue-500"/>
        <Card title="Product Sold" value="1.500" icon={<FaBox />} color="bg-green-100 text-green-500"/>
        <Card title="Monthly Sales" value="RP 50.000.000" icon={<FaChartLine />} color="bg-yellow-100 text-yellow-500"/>
        <Card title="Top Product" value="Sunscreen" icon={<FaStar />} color="bg-pink-100 text-pink-500"/>
      </div>

      {/* FILTER */}
      <PageHeader />

      {/* CHART */}
      <div className="bg-white rounded-lg p-4">
        <div className="h-40 relative">
          <svg className="w-full h-full">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points="0,120 80,80 160,110 240,60 320,100 400,50 480,90"
            />
          </svg>
        </div>
      </div>

      {/* TABLE BAGUS */}
      <div className="bg-white rounded-lg p-4 shadow-sm">

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-700">Data Penjualan</h2>

          <button className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded text-xs">
            Export Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">No</th>
                <th>Date</th>
                <th>Product</th>
                <th className="text-center">Quantity</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">{i + 1}</td>
                  <td className="text-gray-600">{item.date}</td>
                  <td className="font-medium text-gray-700">{item.product}</td>

                  <td className="text-center">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                      {item.qty}
                    </span>
                  </td>

                  <td className="text-right font-semibold">
                    {item.total}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
          <span>Menampilkan 1 - 5 dari 30 data</span>

          <div className="flex gap-1">
            <button className="px-2 border rounded">&lt;</button>
            <button className="px-2 border rounded bg-gray-200">1</button>
            <button className="px-2 border rounded">2</button>
            <span>...</span>
            <button className="px-2 border rounded">6</button>
            <button className="px-2 border rounded">&gt;</button>
          </div>
        </div>

      </div>

    </div>
  );
}

function Card({ title, value, icon, color }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow border flex items-center gap-3">
      <div className={`w-10 h-10 rounded-md flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <h2 className="font-semibold text-sm">{value}</h2>
      </div>
    </div>
  );
}

const data = [
  { date: "30 June 2025", product: "Hydrating Serum", qty: 45, total: "Rp 4.500.000" },
  { date: "22 June 2025", product: "Brightening Toner", qty: 32, total: "Rp 3.200.000" },
  { date: "15 June 2025", product: "Moisture Cream", qty: 28, total: "Rp 2.800.000" },
  { date: "8 June 2025", product: "Acne Gel", qty: 20, total: "Rp 1.600.000" },
  { date: "1 June 2025", product: "Sunscreen SPF 50", qty: 35, total: "Rp 3.000.000" },
];