'use client';

import { useState } from 'react';
import { CorporateHome } from '../../components/corporate-home';
import { siteContent, type Locale } from '../../lib/site-content';

export default function Home() {
  const [language, setLanguage] = useState<Locale>('en');

  return (
    <CorporateHome
      content={siteContent[language]}
      language={language}
      onLanguageChange={setLanguage}
    />
  );
}
