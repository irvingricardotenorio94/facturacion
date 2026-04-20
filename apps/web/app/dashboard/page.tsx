"use client";
import { FileText, Truck } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DashboardSelection() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      {/* CONTENIDO PRINCIPAL*/}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Panel Principal</h1>
          <p className="text-slate-700 text-lg font-medium">¿Qué módulo deseas gestionar hoy?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* TARJETA FACTURACIÓN */}
          <Link href="/facturacion" className="group">
            <div className="bg-white p-10 rounded-2xl shadow-md border-2 border-transparent hover:border-blue-600 hover:shadow-2xl transition-all flex flex-col items-center text-center space-y-6">
              <div className="p-5 bg-blue-100 text-blue-700 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <FileText size={56} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Facturación CFDI 4.0</h2>
                <p className="text-slate-700 text-base font-bold">Ingreso,Egreso ,Pago y Nómina</p>
              </div>
            </div>
          </Link>

          {/* TARJETA DELIVERY */}
          <Link href="/delivery" className="group">
            <div className="bg-white p-10 rounded-2xl shadow-md border-2 border-transparent hover:border-orange-600 hover:shadow-2xl transition-all flex flex-col items-center text-center space-y-6">
              <div className="p-5 bg-orange-100 text-orange-700 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                <Truck size={56} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Delivery</h2>
                <p className="text-slate-700 text-base font-bold">Gestión de pedidos y logística</p>
              </div>
            </div>
          </Link>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="p-6 text-center text-slate-600 font-bold text-sm">
        ISABEL v1.0 © 2026 - Mérida, Yucatán.
      </footer>
    </div>
  );
}