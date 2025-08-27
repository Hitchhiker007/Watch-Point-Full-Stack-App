import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar/navbar";

const roboto = Roboto({
  variable: "--font-roboto",   // define CSS variable
  subsets: ["latin"],
  weight: ["400", "500", "700"], // normal, medium, bold
});

export const metadata: Metadata = {
  title: "Watch Point",
  description: "Watch Point Made By Yours Truly Willzo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
