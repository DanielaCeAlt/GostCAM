import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GostCAM - Sistema de Inventario",
  description: "Sistema de Gestión de Inventario para GostCAM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="h-full bg-gray-50">
        {children}
      </body>
    </html>
  );
}
