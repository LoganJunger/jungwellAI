"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="brand-gradient-bg flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-sm font-black text-white">VN</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Var <span className="brand-gradient">Nöjd</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/companies" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">Companies</Link>
          <Link href="/rate" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">Rate</Link>
          <div className="ml-2 h-5 w-px bg-gray-200" />
          <Link href="/login" className="ml-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">Log in</Link>
          <Link href="/rate" className="btn-primary ml-1 !py-2 !text-xs">Add Rating</Link>
        </nav>

        <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 md:hidden" onClick={() => setOpen(!open)}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <Link href="/companies" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>Companies</Link>
          <Link href="/rate" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>Rate</Link>
          <Link href="/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>Log in</Link>
        </div>
      )}
    </header>
  );
}
