import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: appConfig.siteName,
  description: "Track CS team happiness and act on what improves it."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="mx-auto min-h-[calc(100vh-140px)] w-full max-w-6xl px-6 py-8">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
