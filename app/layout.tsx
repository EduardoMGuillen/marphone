import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marphone | Smartphones de alta gama",
  description:
    "Tienda premium de celulares en Honduras. iPhone 17, Galaxy S25, Pixel y más. Consulta por WhatsApp o Instagram.",
  openGraph: {
    title: "Marphone",
    description: "Smartphones de alta gama. Compra por WhatsApp e Instagram.",
    locale: "es_HN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
