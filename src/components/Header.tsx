import Link from "next/link";
import { appConfig } from "@/lib/config";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-black/5 px-6 py-4">
      <Link href="/" className="text-xl font-bold">
        Var <span className="brand-gradient">Nöjd</span>
      </Link>
      <a href={appConfig.jungwellUrl} className="text-sm underline" target="_blank" rel="noreferrer">
        {appConfig.workbenchTagline}
      </a>
    </header>
  );
}
