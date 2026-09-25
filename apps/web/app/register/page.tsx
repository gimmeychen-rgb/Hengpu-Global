'use client';

import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { services } from '../../lib/api';

export default function RegisterPage() {
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const response = await fetch(`${services.auth}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
        role: form.get('role'),
        company_name: form.get('company_name'),
        country: form.get('country')
      })
    });
    if (!response.ok) {
      setError('Registration failed');
      return;
    }
    const data = await response.json();
    localStorage.setItem('hengpu_token', data.token);
    window.location.href = '/dashboard';
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-md content-center px-5">
      <form onSubmit={submit} className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Register</h1>
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" minLength={6} required />
        <select name="role" defaultValue="buyer">
          <option value="buyer">Buyer</option>
          <option value="supplier">Supplier</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
        </select>
        <input name="company_name" placeholder="Company name" />
        <input name="country" placeholder="Country" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white">
          <UserPlus size={16} /> Register
        </button>
        <Link className="text-sm text-zinc-600" href="/login">Already have an account</Link>
      </form>
    </main>
  );
}
