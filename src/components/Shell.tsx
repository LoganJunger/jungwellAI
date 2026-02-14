import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <header className="header">
        <Link href="/" className="brand">Var <span className="brand-gradient">Nöjd</span></Link>
        <nav className="nav">
          <Link href="/companies">Companies</Link>
          <Link href="/rate">Rate</Link>
          <Link href="/account">Account</Link>
          <a href="https://jungwell.com" target="_blank">{BRAND.workbenchStrap}</a>
        </nav>
      </header>
      {children}
      <footer className="footer">Built by Jungwell. Learn more at <a href="https://jungwell.com" target="_blank">jungwell.com</a>.</footer>
    </div>
  );
}
