'use client';

import { useState } from 'react';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  const isChinese = language === 'zh';

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#18181b]">
      <header className="border-b border-zinc-200/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="text-xl font-semibold tracking-[0.2em]">
            HENGPU
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden gap-8 text-sm md:flex">
              <a href="#about" className="hover:opacity-60">
                {isChinese ? '关于恒普' : 'About'}
              </a>

              <a href="#capabilities" className="hover:opacity-60">
                {isChinese ? '业务能力' : 'Capabilities'}
              </a>

              <a href="#projects" className="hover:opacity-60">
                {isChinese ? '项目' : 'Projects'}
              </a>

              <a href="#contact" className="hover:opacity-60">
                {isChinese ? '联系我们' : 'Contact'}
              </a>
            </nav>

            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setLanguage('zh')}
                className={isChinese ? 'font-semibold' : 'text-zinc-400'}
              >
                中
              </button>

              <span className="text-zinc-300">|</span>

              <button
                onClick={() => setLanguage('en')}
                className={!isChinese ? 'font-semibold' : 'text-zinc-400'}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[78vh] max-w-6xl items-center px-6 py-24">
        <div className="max-w-4xl">
          <p className="mb-7 text-sm uppercase tracking-[0.3em] text-zinc-500">
            {isChinese
              ? '全球供应链 · 技术 · 协作'
              : 'Global Supply Chain · Technology · Collaboration'}
          </p>

          <h1 className="text-5xl font-light leading-[1.08] tracking-tight md:text-7xl">
            {isChinese ? (
              <>
                连接全球需求
                <br />
                与值得信赖的资源。
              </>
            ) : (
              <>
                Connecting Global Demand
                <br />
                with Trusted Resources.
              </>
            )}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
            {isChinese
              ? '恒普连接全球需求与值得信赖的中国资源、技术、制造商及长期合作伙伴。'
              : 'Hengpu connects international demand with trusted Chinese resources, technology, manufacturers and long-term partners.'}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#capabilities"
              className="rounded-full bg-[#18181b] px-7 py-3 text-sm text-white hover:opacity-80"
            >
              {isChinese ? '了解恒普' : 'Explore Hengpu'}
            </a>

            <a
              href="#contact"
              className="rounded-full border border-zinc-300 px-7 py-3 text-sm hover:bg-white"
            >
              {isChinese ? '开始交流' : 'Start a Conversation'}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}