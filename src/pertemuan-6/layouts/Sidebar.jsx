import { MdDashboard } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";

export default function Sidebar() {
  return (
    <div className="flex min-h-screen w-64 flex-col bg-[#3b2c3c] p-6 text-white">
      
      <h1 className="mb-10 text-lg">Dashboard Owner</h1>

      <ul className="space-y-4">
        <li className="flex items-center gap-3 bg-white text-black px-4 py-2 rounded-md cursor-pointer">
          <MdDashboard />
          Dashboard
        </li>

        <li className="flex items-center gap-3 hover:bg-white/10 px-4 py-2 rounded-md cursor-pointer">
          <BsFillPersonFill />
          Kelola Akun
        </li>

        <li className="flex items-center gap-3 hover:bg-white/10 px-4 py-2 rounded-md cursor-pointer">
          <BiLogOut />
          Logout
        </li>
      </ul>

      <div className="mt-auto text-center opacity-30 text-3xl">
        🧴
      </div>
    </div>
  );
}

