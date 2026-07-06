import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 p-4 space-y-4">
        <Header />
        {children}
      </div>
    </div>
  );
}

