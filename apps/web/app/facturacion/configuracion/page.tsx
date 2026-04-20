"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Building2, FileKey, Lock, Save, ShieldCheck, MapPin, Hash } from "lucide-react";

interface FiscalData {
  rfc: string;
  razonSocial: string;
  regimenFiscal: string;
  lugarExpedicion: string;
}

interface CsdFiles {
  cer: File | null;
  key: File | null;
  password: string;
}

export default function ConfiguracionEmisorPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ 
    type: "", 
    text: "" 
  });

  const [fiscalData, setFiscalData] = useState<FiscalData>({
    rfc: "",
    razonSocial: "",
    regimenFiscal: "",
    lugarExpedicion: "",
  });

  const [csdFiles, setCsdFiles] = useState<CsdFiles>({ 
    cer: null, 
    key: null, 
    password: "" 
  });

  const handleFiscalChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiscalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'cer' | 'key') => {
    const file = e.target.files?.[0] || null;
    setCsdFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleSaveAll = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const resFiscal = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emisores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fiscalData),
      });

      if (!resFiscal.ok) throw new Error("Error al guardar datos fiscales");

      if (csdFiles.cer && csdFiles.key && csdFiles.password) {
        const formData = new FormData();
        formData.append("cer", csdFiles.cer);
        formData.append("key", csdFiles.key);
        formData.append("password", csdFiles.password);

        const resCsd = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emisores/configurar-csd`, {
          method: "POST",
          body: formData,
        });

        if (!resCsd.ok) throw new Error("Error al subir certificados CSD");
      }

      setMessage({ type: "success", text: "¡CONFIGURACIÓN GUARDADA EXITOSAMENTE!" });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error desconocido";
      setMessage({ type: "error", text: errorMsg.toUpperCase() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[95%] mx-auto animate-in fade-in duration-500 pb-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* ENCABEZADO ESTILO INGRESO */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Configuración del Emisor</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Identidad Fiscal y Sellos Digitales</p>
        </div>

        <form onSubmit={handleSaveAll} className="p-12 space-y-12">
          
          {/* SECCIÓN 1: IDENTIDAD FISCAL */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* RFC y Razón Social */}
              <div className="space-y-8">
                <div>
                  <label className="block text-slate-500 font-bold text-xs uppercase mb-3 tracking-widest">
                    RFC del Emisor
                  </label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                      name="rfc"
                      type="text"
                      placeholder="AAAA000000XXX"
                      className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-400 uppercase transition-all"
                      value={fiscalData.rfc}
                      onChange={handleFiscalChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold text-xs uppercase mb-3 tracking-widest">
                    Razón Social
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                      name="razonSocial"
                      type="text"
                      placeholder="Nombre oficial como aparece en el SAT"
                      className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-400 transition-all"
                      value={fiscalData.razonSocial}
                      onChange={handleFiscalChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Régimen y CP */}
              <div className="space-y-8">
                <div>
                  <label className="block text-slate-500 font-bold text-xs uppercase mb-3 tracking-widest">
                    Régimen Fiscal
                  </label>
                  <div className="relative">
                    {/* TODO: Implementar fetch dinámico de catálogos del SAT */}
                    <select 
                      name="regimenFiscal"
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 appearance-none cursor-pointer transition-all"
                      value={fiscalData.regimenFiscal}
                      onChange={handleFiscalChange}
                      required
                    >
                      <option value="">Selecciona un régimen...</option>
                      <option value="601">601 - General de Ley Personas Morales</option>
                      <option value="626">626 - RESICO</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold text-xs uppercase mb-3 tracking-widest">
                    Lugar de Expedición (C.P.)
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                      name="lugarExpedicion"
                      type="text"
                      placeholder="Ej: 97000"
                      className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-400 transition-all"
                      value={fiscalData.lugarExpedicion}
                      onChange={handleFiscalChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

         {/* SECCIÓN 2: CERTIFICADOS (CSD) */}
<div className="space-y-8">
  {/* Cambiamos a grid-cols-3 para que los 3 elementos compartan el mismo ancho */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    
    {/* 1. Certificado .cer */}
    <div>
      <label className="block text-slate-500 font-bold text-[10px] uppercase mb-3 tracking-widest">
        Certificado (.cer)
      </label>
      <label className="flex items-center justify-between w-full p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 transition-all h-[46px]">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileKey size={16} className="text-slate-400 shrink-0" />
          <span className="text-slate-800 font-medium text-xs truncate">
            {csdFiles.cer ? csdFiles.cer.name : "Seleccionar"}
          </span>
        </div>
        <input type="file" accept=".cer" className="hidden" onChange={(e) => handleFileChange(e, 'cer')} />
      </label>
    </div>

    {/* 2. Llave Privada .key */}
    <div>
      <label className="block text-slate-500 font-bold text-[10px] uppercase mb-3 tracking-widest">
        Llave Privada (.key)
      </label>
      <label className="flex items-center justify-between w-full p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 transition-all h-[46px]">
        <div className="flex items-center gap-2 overflow-hidden">
          <Lock size={16} className="text-slate-400 shrink-0" />
          <span className="text-slate-800 font-medium text-xs truncate">
            {csdFiles.key ? csdFiles.key.name : "Seleccionar"}
          </span>
        </div>
        <input type="file" accept=".key" className="hidden" onChange={(e) => handleFileChange(e, 'key')} />
      </label>
    </div>

    {/* 3. Contraseña CSD (Ahora mide lo mismo que los anteriores) */}
    <div>
      <label className="block text-slate-500 font-bold text-[10px] uppercase mb-3 tracking-widest">
        Contraseña CSD
      </label>
      <div className="relative group">
        <ShieldCheck className="absolute left-3 top-[15px] text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
        <input 
          type="password"
          placeholder="Contraseña de llave privada"
          className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 text-xs outline-none focus:border-orange-400 transition-all h-[46px] placeholder:font-normal"
          value={csdFiles.password}
          onChange={(e) => setCsdFiles({...csdFiles, password: e.target.value})}
          required
        />
      </div>
    </div>

  </div>
</div>
          {/* BOTÓN DE ACCIÓN */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className={`w-full font-black py-5 rounded-2xl flex items-center justify-center gap-3 text-xl transition-all shadow-md active:scale-[0.98] ${
                loading 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2 italic">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  PROCESANDO...
                </span>
              ) : (
                <><Save size={22} /> GUARDAR CONFIGURACIÓN</>
              )}
            </button>

            {message.text && (
              <div className={`mt-6 p-5 rounded-xl font-bold text-center text-sm border ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {message.text}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}