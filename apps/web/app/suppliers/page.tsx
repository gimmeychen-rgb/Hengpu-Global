'use client';

import { useEffect, useState } from 'react';
import { Nav } from '../../components/nav';
import { apiFetch, services } from '../../lib/api';

type Supplier = {
  id: string;
  company_name: string;
  country: string;
  product_categories: string[];
  verified: boolean;
  trust_score: number;
};

export default function SuppliersPage() {
  const [rows, setRows] = useState<Supplier[]>([]);

  useEffect(() => {
    apiFetch<Supplier[]>(`${services.suppliers}/suppliers`).then(setRows);
  }, []);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="mb-5 text-2xl font-semibold">Suppliers</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((supplier) => (
            <article key={supplier.id} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{supplier.company_name}</h2>
              <p className="mt-1 text-sm text-zinc-600">{supplier.country}</p>
              <p className="mt-3 text-sm">Categories: {supplier.product_categories?.join(', ') || 'None'}</p>
              <p className="mt-2 text-sm">Trust score: {supplier.trust_score}</p>
              <p className="mt-2 text-sm">{supplier.verified ? 'Verified supplier' : 'Unverified supplier'}</p>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
