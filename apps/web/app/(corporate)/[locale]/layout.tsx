import '../../globals.css';
import { notFound } from 'next/navigation';
import { isLocale } from '../../../lib/site-content';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export default function CorporateRootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();

  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}
