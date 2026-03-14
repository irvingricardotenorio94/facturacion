import type { Metadata } from "next";
import "./globals.css"; // Importante: Esto carga Tailwind

export const metadata: Metadata = {
  title: "ISABEL - Facturación y Delivery",
  description: "Sistema inteligente de gestión",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-50">
        {children}
      </body>
    </html>
  );
}