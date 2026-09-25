'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Nav } from '../../components/nav';
import { apiFetch, services } from '../../lib/api';

type RequestRow = {
  id: string;
  title: string;
  category: string;
  budget_min: string;
  budget_max: string;
  country_target: string;
  status: string;
};

export default function RequestsPage() {
  const [rows, setRows] = useState<RequestRow[]>([]);

  useEffect(() => {
    apiFetch<RequestRow[]>(`${services.requests}/requests`).then(setRows);
  }, []);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Requests</h1>
          <Link href="/requests/create" className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-900 px-4 text-sm text-white">
            <Plus size={16} /> New Request
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 text-zinc-600">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Country</th>
                <th className="p-3">Status</th>
                <th className="p-3">Matches</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-zinc-200">
                  <td className="p-3 font-medium">{row.title}</td>
                  <td className="p-3">{row.category}</td>
                  <td className="p-3">{row.budget_min} - {row.budget_max}</td>
                  <td className="p-3">{row.country_target}</td>
                  <td className="p-3">{row.status}</td>
                  <td className="p-3">
                    <Link className="text-zinc-900 underline" href={`/requests/${row.id}/matches`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
