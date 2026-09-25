'use client';

import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import { Nav } from '../../../components/nav';
import { apiFetch, services } from '../../../lib/api';

export default function CreateRequestPage() {
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const created = await apiFetch<{ id: string }>(`${services.requests}/requests/create`, {
        method: 'POST',
        body: JSON.stringify({
          title: form.get('title'),
          description: form.get('description'),
          category: form.get('category'),
          budget_min: Number(form.get('budget_min')),
          budget_max: Number(form.get('budget_max')),
          country_target: form.get('country_target')
        })
      });
      window.location.href = `/requests/${created.id}/matches`;
    } catch {
      setError('Only buyer accounts can create valid requests.');
    }
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-5 py-8">
        <form onSubmit={submit} className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Create Request</h1>
          <input name="title" placeholder="Title" required />
          <textarea name="description" placeholder="Description" rows={5} required />
          <select name="category" defaultValue="mining">
            <option value="mining">Mining</option>
            <option value="hinge">Hinge</option>
            <option value="trade">Trade</option>
          </select>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="budget_min" type="number" min="0" placeholder="Budget min" required />
            <input name="budget_max" type="number" min="0" placeholder="Budget max" required />
          </div>
          <input name="country_target" placeholder="Target country" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white">
            <Send size={16} /> Create
          </button>
        </form>
      </main>
    </>
  );
}
