import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CorporateHome } from '../../../components/corporate-home';
import { isLocale, siteContent } from '../../../lib/site-content';

type CorporatePageProps = { params: { locale: string } };

export function generateMetadata({ params }: CorporatePageProps): Metadata {
  if (!isLocale(params.locale)) notFound();
  const content = siteContent[params.locale];

  // Production origin confirmed for Mission 04C; allow an explicit build-time override.
  const origin = new URL(process.env.CORPORATE_SITE_URL ?? 'https://hengpuglobal.com');
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash || origin.port) {
    throw new Error('CORPORATE_SITE_URL must be an HTTPS origin without credentials, port, path, query, or fragment');
  }

  return {
    metadataBase: origin,
    alternates: {
      canonical: `/${params.locale}`,
      languages: { en: '/en', zh: '/zh' }
    },
    title: content.seoTitle,
    description: content.seoDescription
  };
}

export default function CorporatePage({ params }: CorporatePageProps) {
  if (!isLocale(params.locale)) notFound();

  return <CorporateHome content={siteContent[params.locale]} language={params.locale} />;
}
