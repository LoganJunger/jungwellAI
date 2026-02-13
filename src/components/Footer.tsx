import { appConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-black/5 px-6 py-6 text-sm">
      Built by Jungwell. Learn more at <a className="underline" href={appConfig.jungwellUrl}>jungwell.com</a>
    </footer>
  );
}
