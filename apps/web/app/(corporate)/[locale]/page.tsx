import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CorporateHome } from '../../../components/corporate-home';
import { isLocale, siteContent } from '../../../lib/site-content';

type CorporatePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: CorporatePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = siteContent[locale];

  // Production origin confirmed for Mission 04C; allow an explicit build-time override.
  const origin = new URL(process.env.CORPORATE_SITE_URL ?? 'https://hengpuglobal.com');
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash || origin.port) {
    throw new Error('CORPORATE_SITE_URL must be an HTTPS origin without credentials, port, path, query, or fragment');
  }

  return {
    metadataBase: origin,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', zh: '/zh' }
    },
    title: content.seoTitle,
    description: content.seoDescription
  };
}

export default async function CorporatePage({ params }: CorporatePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <CorporateHome content={siteContent[locale]} language={locale} />;
}
