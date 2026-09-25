'use client';

import { useEffect, useState } from 'react';
import { apiFetch, services } from '../../../lib/api';

type User = { id: string; name: string; email: string; role: string; trust_score: number; created_at: string };

export default function AdminUsersPage() {
  const [rows, setRows] = useState<User[]>([]);
  useEffect(() => {
    apiFetch<User[]>(`${services.users}/users`).then(setRows).catch(() => setRows([]));
  }, []);

  return <AdminTable title="Users" headers={['Name', 'Email', 'Role', 'Trust Score']} rows={rows.map((r) => [r.name, r.email, r.role, r.trust_score])} />;
}

function AdminTable({ title, headers, rows }: { title: string; headers: string[]; rows: Array<Array<string | number>> }) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <h1 className="mb-5 text-2xl font-semibold">{title}</h1>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 text-zinc-600"><tr>{headers.map((h) => <th className="p-3" key={h}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((row, i) => <tr className="border-t border-zinc-200" key={i}>{row.map((cell, j) => <td className="p-3" key={j}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </main>
  );
}
