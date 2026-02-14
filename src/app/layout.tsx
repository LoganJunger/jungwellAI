import "./globals.css";
import { Shell } from "@/components/Shell";

export const metadata = {
  title: "Var Nöjd",
  description: "Track CS team happiness and act on what improves it."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
