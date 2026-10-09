'use client';

import type { CorporateContent, Locale } from '../lib/site-content';

type CorporateHeaderProps = {
  content: CorporateContent;
  language: Locale;
  onLanguageChange?: (language: Locale) => void;
};

export function CorporateHeader({ content, language, onLanguageChange }: CorporateHeaderProps) {
  const isChinese = language === 'zh';

  return (
      <header className="border-b border-zinc-200/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="text-xl font-semibold tracking-[0.2em]">
            {content.brand}
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden gap-8 text-sm md:flex">
              <a href="#about" className="hover:opacity-60">
                {content.navAbout}
              </a>

              <a href="#capabilities" className="hover:opacity-60">
                {content.navCapabilities}
              </a>

              <a href="#projects" className="hover:opacity-60">
                {content.navProjects}
              </a>

              <a href="#contact" className="hover:opacity-60">
                {content.navContact}
              </a>
            </nav>

            <div className="flex items-center gap-2 text-sm">
              {onLanguageChange ? (
                <>
              <button
                onClick={() => onLanguageChange('zh')}
                className={isChinese ? 'font-semibold' : 'text-zinc-400'}
              >
                {content.chineseLabel}
              </button>

              <span className="text-zinc-300">|</span>

              <button
                onClick={() => onLanguageChange('en')}
                className={!isChinese ? 'font-semibold' : 'text-zinc-400'}
              >
                {content.englishLabel}
              </button>
                </>
              ) : (
                <>
                  <a href="/zh" hrefLang="zh" lang="zh" aria-current={isChinese ? 'page' : undefined} className={isChinese ? 'font-semibold' : 'text-zinc-400'}>
                    {content.chineseLabel}
                  </a>
                  <span className="text-zinc-300">|</span>
                  <a href="/en" hrefLang="en" lang="en" aria-current={!isChinese ? 'page' : undefined} className={!isChinese ? 'font-semibold' : 'text-zinc-400'}>
                    {content.englishLabel}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
  );
}
