export default function Header() {
  return (
    <div className="flex justify-between items-center bg-[#e9cfcf] p-4 rounded-lg">
      
      <div>
        <h1 className="text-xl font-semibold">
          Selamat Datang Owner, Siti
        </h1>
        <p className="text-sm text-gray-600">
          Pantau performa penjualan skincare Happy Puku secara real-time.
        </p>
      </div>

      <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg shadow cursor-pointer">
        
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          👤
        </div>

        <span className="text-sm font-medium">Siti</span>
        <span className="text-gray-400">⌄</span>

      </div>
    </div>
  );
}