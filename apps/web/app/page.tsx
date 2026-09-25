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
              ? '恒普连接国际需求与值得信赖的中国资源、技术、制造商及长期合作伙伴。'
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

      <section
        id="about"
        className="border-t border-zinc-200/70 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
              {isChinese ? '关于恒普' : 'About Hengpu'}
            </p>

            <h2 className="mt-5 text-3xl font-light tracking-tight md:text-5xl">
              {isChinese
                ? '让跨境合作变得更清晰、更可靠。'
                : 'Making cross-border collaboration clearer and more reliable.'}
            </h2>

            <p className="mt-8 text-lg leading-8 text-zinc-600">
              {isChinese
                ? '恒普不是单一产品供应商，而是一座连接全球需求、中国资源与长期合作伙伴的协作基础设施。我们关注真实需求、可信资源与长期价值。'
                : 'Hengpu is not a single-product supplier. We are building a collaboration infrastructure that connects global demand with Chinese resources and long-term partners, with a focus on real needs, trusted resources and lasting value.'}
            </p>
          </div>
        </div>
      </section>

      <section id="capabilities" className="border-t border-zinc-200/70">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            {isChinese ? '业务能力' : 'Capabilities'}
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-light">
                {isChinese ? '全球采购与供应链' : 'Global Sourcing & Supply Chain'}
              </h3>

              <p className="mt-4 leading-7 text-zinc-600">
                {isChinese
                  ? '从需求理解、资源寻找，到供应商筛选、采购与出口支持。'
                  : 'From understanding demand and identifying resources to supplier verification, sourcing and export support.'}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light">
                {isChinese ? '技术与设备' : 'Technology & Equipment'}
              </h3>

              <p className="mt-4 leading-7 text-zinc-600">
                {isChinese
                  ? '连接中国制造能力、工业技术与海外真实项目需求。'
                  : 'Connecting Chinese manufacturing capabilities and industrial technologies with real projects overseas.'}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light">
                {isChinese ? '项目协作' : 'Project Collaboration'}
              </h3>

              <p className="mt-4 leading-7 text-zinc-600">
                {isChinese
                  ? '围绕矿业、资源与产业项目建立长期合作网络。'
                  : 'Building long-term collaboration networks around mining, resources and industrial projects.'}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light">
                {isChinese ? '跨境贸易服务' : 'Cross-border Trade Services'}
              </h3>

              <p className="mt-4 leading-7 text-zinc-600">
                {isChinese
                  ? '提供代理出口、采购、物流协调及交易支持。'
                  : 'Supporting sourcing, export agency, logistics coordination and international transactions.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="border-t border-zinc-200/70 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            {isChinese ? '重点领域' : 'Focus Areas'}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="border border-zinc-200 p-8">
              <h3 className="text-2xl font-light">
                {isChinese ? '矿业与资源' : 'Mining & Resources'}
              </h3>
            </div>

            <div className="border border-zinc-200 p-8">
              <h3 className="text-2xl font-light">
                {isChinese ? '工业设备' : 'Industrial Equipment'}
              </h3>
            </div>

            <div className="border border-zinc-200 p-8">
              <h3 className="text-2xl font-light">
                {isChinese ? '五金与小家电' : 'Hardware & Small Appliances'}
              </h3>
            </div>

            <div className="border border-zinc-200 p-8">
              <h3 className="text-2xl font-light">
                {isChinese ? '跨境贸易' : 'Cross-border Trade'}
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200/70">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            {isChinese ? '合作方式' : 'How We Work'}
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-5">
            {[
              isChinese ? '理解需求' : 'Understand',
              isChinese ? '寻找资源' : 'Identify',
              isChinese ? '验证与连接' : 'Connect',
              isChinese ? '支持交易' : 'Support',
              isChinese ? '长期合作' : 'Grow'
            ].map((step, index) => (
              <div key={step}>
                <div className="text-sm text-zinc-400">
                  0{index + 1}
                </div>

                <h3 className="mt-3 text-xl font-light">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="border-t border-zinc-200/70 bg-[#18181b] text-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            {isChinese ? '联系我们' : 'Contact'}
          </p>

          <h2 className="mt-5 max-w-3xl text-4xl font-light tracking-tight md:text-6xl">
            {isChinese
              ? '如果你有真实的需求，我们愿意开始一次认真交流。'
              : 'If you have a real need, we are ready to start a meaningful conversation.'}
          </h2>

          <div className="mt-10">
            <a
              href="mailto:gimmey@hengpuglobal.com"
              className="inline-block rounded-full bg-white px-7 py-3 text-sm text-[#18181b] hover:opacity-80"
            >
              gimmey@hengpuglobal.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}