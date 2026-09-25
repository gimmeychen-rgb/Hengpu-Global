import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hengpu Admin',
  description: 'Hengpu admin panel'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/admin/users" className="text-lg font-semibold">Hengpu Admin</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin/login">Login</Link>
              <Link href="/admin/users">Users</Link>
              <Link href="/admin/requests">Requests</Link>
              <Link href="/admin/suppliers">Suppliers</Link>
              <Link href="/admin/projects">Projects</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
