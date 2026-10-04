import type { Metadata } from "next";
import "./globals.css";
import { businessInfo } from "@/data/site";

export const metadata: Metadata = {
  title: "Anna & Fluffy's Grooming | Peluquería Canina",
  description: businessInfo.description,
  applicationName: businessInfo.name,
  metadataBase: new URL("https://anna-fluffys.example"),
  openGraph: {
    title: "Anna & Fluffy's Grooming | Peluquería Canina",
    description: businessInfo.description,
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: businessInfo.logo,
        width: 1200,
        height: 1200,
        alt: "Logo de Anna & Fluffy's Grooming"
      }
    ]
  },
  icons: {
    icon: businessInfo.logo,
    apple: businessInfo.logo
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
