'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Nav } from '../../components/nav';
import { apiFetch, services } from '../../lib/api';

type User = { id: string; name: string; email: string; role: string; trust_score: number };

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiFetch<User>(`${services.auth}/auth/profile`)
      .then(setUser)
      .catch(() => (window.location.href = '/login'));
  }, []);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-700" />
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>
          {user ? (
            <div className="grid gap-3 sm:grid-cols-4">
              <Info label="Name" value={user.name} />
              <Info label="Email" value={user.email} />
              <Info label="Role" value={user.role} />
              <Info label="Trust score" value={String(user.trust_score)} />
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 p-4">
      <p className="text-xs uppercase text-zinc-500">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
