"use client";
import { FilePlus, FileMinus, Wallet, Users, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function FacturacionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "INGRESO", path: "/facturacion/ingreso", icon: <FilePlus size={24} strokeWidth={2.5} />, lightBg: "bg-blue-100", textColor: "text-blue-700" },
    { name: "EGRESO", path: "/facturacion/egreso", icon: <FileMinus size={24} strokeWidth={2.5} />, lightBg: "bg-red-100", textColor: "text-red-700" },
    { name: "PAGO", path: "/facturacion/pago", icon: <Wallet size={24} strokeWidth={2.5} />, lightBg: "bg-green-100", textColor: "text-green-700" },
    { name: "NÓMINA", path: "/facturacion/nomina", icon: <Users size={24} strokeWidth={2.5} />, lightBg: "bg-purple-100", textColor: "text-purple-700" },
    { name: "REPORTES", path: "/facturacion/reportes", icon: <BarChart3 size={24} strokeWidth={2.5} />, lightBg: "bg-slate-200", textColor: "text-slate-800" },
    { name: "CONFIGURAR EMISOR", path: "/facturacion/configuracion", icon: <Settings size={24} strokeWidth={2.5} />, lightBg: "bg-orange-100", textColor: "text-orange-700" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* SIDEBAR LATERAL*/}
        <aside className="w-80 bg-white border-r border-slate-300 flex flex-col p-6 shadow-sm h-[calc(100vh-73px)] sticky top-[73px]">
          <div className="mb-8">
            <h2 className="text-xs font-black text-slate-500 tracking-[0.2em] uppercase italic">Menú Fiscal</h2>
          </div>

          <nav className="space-y-6">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`
                    flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 border-2
                    ${isActive 
                      ? `bg-white border-blue-600 shadow-xl scale-[1.02]` 
                      : `bg-white border-slate-200 text-slate-900 hover:border-blue-600 hover:shadow-2xl hover:scale-[1.02]`}
                  `}>
                    <div className={`p-2 rounded-xl ${item.lightBg} ${item.textColor}`}>
                      {item.icon}
                    </div>
                    <span className={`font-black text-sm tracking-wider ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200">
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4">
              <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                Sistema
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-slate-900 text-xs font-black uppercase">
                  Modo Fiscal CFDI 4.0
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL CORRESPONDIENTE A FORMULARIOS*/}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="w-full md:w-4/5 mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}