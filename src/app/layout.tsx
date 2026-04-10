import type { Metadata } from "next"; // importa los metadatos de la aplicacion
import "./globals.css"; // importa los estilos de la aplicacion

// exportacion de los metadatos de la aplicacion
export const metadata: Metadata = {
  title: "IA for Devs - Embeddings",
  description: "Dashboard de vectores de Kevin",
};

// molde de la aplicacion como en page insertamos todo el html necesita las configuraciones de html
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
} 