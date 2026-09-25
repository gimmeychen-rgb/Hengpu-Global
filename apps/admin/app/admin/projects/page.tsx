'use client';

import { useEffect, useState } from 'react';
import { apiFetch, services } from '../../../lib/api';

type Project = { id: string; title: string; buyer_company: string; supplier_company: string; status: string; created_at: string };

export default function AdminProjectsPage() {
  const [rows, setRows] = useState<Project[]>([]);
  useEffect(() => {
    apiFetch<Project[]>(`${services.projects}/projects`).then(setRows).catch(() => setRows([]));
  }, []);
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <h1 className="mb-5 text-2xl font-semibold">Projects</h1>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 text-zinc-600"><tr><th className="p-3">Request</th><th className="p-3">Buyer</th><th className="p-3">Supplier</th><th className="p-3">Status</th></tr></thead>
          <tbody>{rows.map((r) => <tr className="border-t border-zinc-200" key={r.id}><td className="p-3">{r.title}</td><td className="p-3">{r.buyer_company}</td><td className="p-3">{r.supplier_company}</td><td className="p-3">{r.status}</td></tr>)}</tbody>
        </table>
      </div>
    </main>
  );
}
