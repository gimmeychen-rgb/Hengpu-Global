'use client';

import { useEffect, useState } from 'react';
import { apiFetch, services } from '../../../lib/api';

type RequestRow = { title: string; category: string; budget_min: string; budget_max: string; country_target: string; status: string };

export default function AdminRequestsPage() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  useEffect(() => {
    apiFetch<RequestRow[]>(`${services.requests}/requests`).then(setRows).catch(() => setRows([]));
  }, []);
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <h1 className="mb-5 text-2xl font-semibold">Requests</h1>
      <DataTable headers={['Title', 'Category', 'Budget', 'Country', 'Status']} rows={rows.map((r) => [r.title, r.category, `${r.budget_min} - ${r.budget_max}`, r.country_target, r.status])} />
    </main>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-100 text-zinc-600"><tr>{headers.map((h) => <th className="p-3" key={h}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr className="border-t border-zinc-200" key={i}>{row.map((cell, j) => <td className="p-3" key={j}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
