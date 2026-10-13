import '../../globals.css';
import { notFound } from 'next/navigation';
import { isLocale } from '../../../lib/site-content';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export default async function CorporateRootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
