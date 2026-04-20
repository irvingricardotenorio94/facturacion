"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar, User, Building2, MapPin, Globe, Loader2 } from "lucide-react";

// 1. Tipado para el catálogo
interface UsoCFDI {
  id: string;
  descripcion: string;
}

export default function IngresoPage() {
  const router = useRouter();
  const hasFetchedUsosRef = useRef(false);
  const [usosCfdi, setUsosCfdi] = useState<UsoCFDI[]>([]);
  const [loadingUsos, setLoadingUsos] = useState(true);
  const [errorUsos, setErrorUsos] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    tipoComprobante: "Ingreso",
    emisor: "IRVING RICARDO TENORIO COSS",
    rfcEmisor: "TECI940509F49",
    certificado: "",
    lugarExpedicion: "",
    fechaHora: new Date().toLocaleString('es-MX'),
    receptor: "",
    usoCFDI: "",
    exportacion: "01 - No aplica",
    serie: "",
    folio: ""
  });

  // 2. Cargar catálogo desde tu API
  useEffect(() => {
    if (hasFetchedUsosRef.current) return;
    hasFetchedUsosRef.current = true;

    async function fetchUsos() {
      try {
        setErrorUsos(null);
        const token = localStorage.getItem("isabel_token");
        console.log("[IngresoPage] Token para uso-cfdi:", token);

        if (!token) {
          setErrorUsos("No hay sesión activa. Redirigiendo al login...");
          setLoadingUsos(false);
          router.push("/login");
          return;
        }

        const response = await fetch("http://localhost:8787/api/catalogos/uso-cfdi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.clear();
          setErrorUsos("Tu sesión expiró. Inicia sesión nuevamente.");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status} al cargar Uso de CFDI`);
        }

        const data = await response.json();
        setUsosCfdi(data);
      } catch (error) {
        console.error("Error cargando usos CFDI:", error);
        setErrorUsos("No se pudo cargar el catálogo de Uso de CFDI.");
      } finally {
        setLoadingUsos(false);
      }
    }

    fetchUsos();
  }, [router]);

  return (
    <div className="w-full max-w-[95%] mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <form className="p-12 space-y-12">
          
          {/* SECCIÓN 1: DATOS GENERALES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* COLUMNA IZQUIERDA */}
            <div className="space-y-8">
              <div>
                <label className="block text-slate-500 font-bold text-xs uppercase mb-3 tracking-widest">
                  Tipo de Comprobante
                </label>
                <input 
                  type="text" 
                  readOnly 
                  value={formData.tipoComprobante}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600 outline-none cursor-default"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold text-xs uppercase mb-3 tracking-widest">
                  Datos del Emisor
                </label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <textarea 
                    rows={2}
                    value={`${formData.rfcEmisor} - ${formData.emisor}`}
                    className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-blue-400 transition-all resize-none"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-500 font-bold text-[10px] uppercase mb-2">Certificado</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold text-[10px] uppercase mb-2">Lugar Expedición (CP)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input type="text" placeholder="97000" className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="space-y-8">
              <div>
                <label className="block text-slate-500 font-bold text-xs uppercase mb-3 tracking-widest">
                  Fecha y Hora de Emisión
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={formData.fechaHora}
                    className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold text-xs uppercase mb-3 tracking-widest">
                  Receptor
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-slate-400" size={20} />
                  <select className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 appearance-none cursor-pointer transition-all">
                    <option>Selecciona un cliente de tu catálogo...</option>
                    <option>XAXX010101000 - PÚBLICO EN GENERAL</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

          {/* SECCIÓN 2: DATOS FISCALES */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <label className="block text-slate-500 font-bold text-[10px] uppercase mb-3 tracking-widest">Uso de CFDI</label>
              <div className="relative">
                {errorUsos && (
                  <p className="mb-3 text-sm text-red-600 font-medium">{errorUsos}</p>
                )}
                <select 
                  value={formData.usoCFDI}
                  onChange={(e) => setFormData({...formData, usoCFDI: e.target.value})}
                  disabled={loadingUsos || !!errorUsos}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-400 appearance-none disabled:bg-slate-50"
                >
                  <option value="">
                    {loadingUsos
                      ? "Cargando catálogo..."
                      : errorUsos
                        ? "No disponible por error de sesión"
                        : "Selecciona el uso del CFDI"}
                  </option>
                  {usosCfdi.map((uso) => (
                    <option key={uso.id} value={uso.id}>
                      {uso.id} - {uso.descripcion}
                    </option>
                  ))}
                </select>
                {loadingUsos && (
                  <Loader2 className="absolute right-4 top-4 animate-spin text-slate-400" size={20} />
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-slate-500 font-bold text-[10px] uppercase mb-3 tracking-widest">Exportación</label>
              <div className="relative">
                <Globe className="absolute left-3 top-4 text-slate-400" size={18} />
                <select className="w-full pl-10 p-4 bg-white border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-400 appearance-none">
                  <option>01 - No aplica</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-slate-500 font-bold text-[10px] uppercase mb-3 tracking-widest">Serie / Folio</label>
              <div className="flex gap-3">
                <input type="text" placeholder="Serie" className="w-1/3 p-4 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-800 outline-none focus:border-blue-400" />
                <input type="text" placeholder="Folio" className="w-2/3 p-4 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-800 outline-none focus:border-blue-400" />
              </div>
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <div className="pt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 text-xl transition-all shadow-md active:scale-[0.98]">
              CONTINUAR A CONCEPTOS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}