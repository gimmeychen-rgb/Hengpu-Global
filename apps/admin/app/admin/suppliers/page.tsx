'use client';

import { useEffect, useState } from 'react';
import { apiFetch, services } from '../../../lib/api';

type Supplier = { company_name: string; country: string; product_categories: string[]; verified: boolean; trust_score: number };

export default function AdminSuppliersPage() {
  const [rows, setRows] = useState<Supplier[]>([]);
  useEffect(() => {
    apiFetch<Supplier[]>(`${services.suppliers}/suppliers`).then(setRows).catch(() => setRows([]));
  }, []);
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <h1 className="mb-5 text-2xl font-semibold">Suppliers</h1>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 text-zinc-600"><tr><th className="p-3">Company</th><th className="p-3">Country</th><th className="p-3">Categories</th><th className="p-3">Verified</th><th className="p-3">Trust</th></tr></thead>
          <tbody>{rows.map((r) => <tr className="border-t border-zinc-200" key={r.company_name}><td className="p-3">{r.company_name}</td><td className="p-3">{r.country}</td><td className="p-3">{r.product_categories?.join(', ')}</td><td className="p-3">{String(r.verified)}</td><td className="p-3">{r.trust_score}</td></tr>)}</tbody>
        </table>
      </div>
    </main>
  );
}
