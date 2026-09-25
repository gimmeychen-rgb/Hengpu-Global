'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';

export function Nav() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/dashboard" className="text-lg font-semibold">Hengpu Platform</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/requests">Requests</Link>
          <Link href="/requests/create">Create</Link>
          <Link href="/suppliers">Suppliers</Link>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300"
            title="Log out"
            onClick={() => {
              localStorage.removeItem('hengpu_token');
              window.location.href = '/login';
            }}
          >
            <LogOut size={16} />
          </button>
        </nav>
      </div>
    </header>
  );
}
