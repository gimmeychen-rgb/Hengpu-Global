'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Nav } from '../../../../components/nav';
import { apiFetch, services } from '../../../../lib/api';

type MatchResponse = { request_id: string; matches: Array<{ supplier_id: string; score: number }> };

export default function MatchesPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<MatchResponse | null>(null);

  useEffect(() => {
    apiFetch<MatchResponse>(`${services.matching}/requests/${params.id}/matches`).then(setData);
  }, [params.id]);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-5 py-8">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Matching Result</h1>
          <Link href="/requests" className="text-sm underline">Back to requests</Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 text-zinc-600">
              <tr>
                <th className="p-3">Supplier ID</th>
                <th className="p-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {data?.matches.map((match) => (
                <tr key={match.supplier_id} className="border-t border-zinc-200">
                  <td className="p-3 font-mono text-xs">{match.supplier_id}</td>
                  <td className="p-3 font-semibold">{match.score}</td>
                </tr>
              ))}
              {data && data.matches.length === 0 && (
                <tr><td className="p-3" colSpan={2}>No suppliers available yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
