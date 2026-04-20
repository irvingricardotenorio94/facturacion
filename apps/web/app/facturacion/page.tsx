"use client";
import { Landmark } from "lucide-react";

export default function FacturacionWelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-700">
      <div className="p-6 bg-white rounded-full shadow-xl mb-6 border-2 border-slate-200">
        <Landmark size={80} className="text-blue-600" strokeWidth={1.5} />
      </div>
      <h1 className="text-5xl font-black text-slate-900 mb-4">Módulo Fiscal ISABEL</h1>
      <p className="text-slate-700 text-xl font-bold max-w-lg">
        Selecciona un tipo de comprobante en el menú de la izquierda para comenzar la emisión de tus CFDI 4.0.
      </p>
    </div>
  );
}