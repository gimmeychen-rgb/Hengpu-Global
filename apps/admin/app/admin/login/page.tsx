'use client';

import { FormEvent, useState } from 'react';
import { LogIn } from 'lucide-react';
import { services } from '../../../lib/api';

export default function AdminLoginPage() {
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const response = await fetch(`${services.auth}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') })
    });
    if (!response.ok) {
      setError('Admin login failed');
      return;
    }
    const data = await response.json();
    localStorage.setItem('hengpu_token', data.token);
    window.location.href = '/admin/users';
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-md content-center px-5">
      <form onSubmit={submit} className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white">
          <LogIn size={16} /> Login
        </button>
      </form>
    </main>
  );
}
