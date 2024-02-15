import type { Metadata } from "next";
import { Poppins, Courgette } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const courgette = Courgette({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-courgette",
});

export const metadata: Metadata = {
  title: "MOGi KiDS",
  description: "MOGi KiDS is a website for professional child care services",
  icons: { icon: "/assets/images/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${courgette.variable}`}>
        {children}
      </body>
    </html>
  );
}
