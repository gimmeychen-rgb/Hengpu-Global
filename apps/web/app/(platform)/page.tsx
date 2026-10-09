import { redirect } from 'next/navigation';

// Next.js 14.2.5 prerendered redirects can omit the HTTP Location header.
export const dynamic = 'force-dynamic';

export default function Home() {
  redirect('/en');
}
