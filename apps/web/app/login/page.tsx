"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("isabel_token", data.token); // Guardamos el token
        router.push("/dashboard"); // Redirigimos al menú
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LADO IZQUIERDO */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-center p-12 relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-5xl font-bold mb-4 italic">ISABEL</h1>
          <p className="text-slate-400 text-lg">Sistema Inteligente de Facturación y Delivery.</p>
        </div>
        {/* Gráfico abstracto (simulado con un gradiente) */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* LADO DERECHO*/}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Bienvenido</h2>
            <p className="text-slate-500">Ingresa tus credenciales para continuar</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-600" size={20} /> 
              <input
                type="text"
                placeholder="Usuario"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 placeholder:text-slate-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-600" size={20} />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-200"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}