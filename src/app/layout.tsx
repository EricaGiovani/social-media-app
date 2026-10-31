import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const sfPro = Inter({ variable: "--font-sf-pro", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sociality",
  description: "Sociality social media app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sfPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}