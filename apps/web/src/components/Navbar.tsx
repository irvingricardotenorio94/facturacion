"use client";
import { User as UserIcon, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("isabel_token");
    router.push("/login");
  };

  // Verificamos si no estamos en el dashboard para mostrar la flecha de volver
  const isNotDashboard = pathname !== "/dashboard";

  return (
    <nav className="bg-white border-b border-slate-300 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        {isNotDashboard && (
          <Link href="/dashboard" className="text-slate-700 hover:text-blue-600 transition-colors">
            <ArrowLeft size={24} strokeWidth={3} />
          </Link>
        )}
        <span className="text-2xl font-bold text-slate-900 italic">ISABEL</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
          <UserIcon size={18} className="text-slate-700" />
          <span className="text-slate-900 font-bold text-sm">Administrador</span>
        </div>
        <button 
          onClick={handleLogout}
          className="text-slate-700 hover:text-red-600 transition-colors flex items-center gap-1 font-medium"
        >
          <LogOut size={20} />
          Salir
        </button>
      </div>
    </nav>
  );
}

