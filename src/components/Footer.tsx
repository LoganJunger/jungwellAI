import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="brand-gradient-bg flex h-7 w-7 items-center justify-center rounded-lg"><span className="text-xs font-black text-white">VN</span></div>
              <span className="text-lg font-bold">Var Nöjd</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">The pulse of post-sales, in one number. Real CSM ratings. Anonymous feedback.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/companies" className="text-sm text-gray-500 hover:text-gray-900">Companies</Link></li>
              <li><Link href="/rate" className="text-sm text-gray-500 hover:text-gray-900">Rate Your CS Team</Link></li>
              <li><Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">Log In</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Jungwell</h3>
            <ul className="mt-3 space-y-2">
              <li><a href="https://jungwell.com" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-gray-900">jungwell.com</a></li>
              <li><span className="text-sm text-gray-400">A Jungwell.ai Workbench module</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-100 pt-6">
          <p className="text-center text-xs text-gray-400">&copy; 2025 Jungwell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
