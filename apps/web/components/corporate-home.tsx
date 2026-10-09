import type { CorporateContent, Locale } from '../lib/site-content';
import { CorporateHeader } from './corporate-header';

type CorporateHomeProps = {
  content: CorporateContent;
  language: Locale;
  onLanguageChange?: (language: Locale) => void;
};

export function CorporateHome({ content, language, onLanguageChange }: CorporateHomeProps) {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#18181b]">
      <CorporateHeader content={content} language={language} onLanguageChange={onLanguageChange} />

      <section className="mx-auto flex min-h-[78vh] max-w-6xl items-center px-6 py-24">
        <div className="max-w-4xl">
          <p className="mb-7 text-sm uppercase tracking-[0.3em] text-zinc-500">
            {content.heroEyebrow}
          </p>

          <h1 className="text-5xl font-light leading-[1.08] tracking-tight md:text-7xl">
            {content.heroTitleFirstLine}
            <br />
            {content.heroTitleSecondLine}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
            {content.heroDescription}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#capabilities"
              className="rounded-full bg-[#18181b] px-7 py-3 text-sm text-white hover:opacity-80"
            >
              {content.exploreLabel}
            </a>

            <a
              href="#contact"
              className="rounded-full border border-zinc-300 px-7 py-3 text-sm hover:bg-white"
            >
              {content.conversationLabel}
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
              {content.aboutLabel}
            </p>

            <h2 className="mt-5 text-3xl font-light tracking-tight md:text-5xl">
              {content.aboutTitle}
            </h2>

            <p className="mt-8 text-lg leading-8 text-zinc-600">
              {content.aboutDescription}
            </p>
          </div>
        </div>
      </section>

      <section id="capabilities" className="border-t border-zinc-200/70">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            {content.capabilitiesLabel}
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-light">
                {content.sourcingTitle}
              </h3>

              <p className="mt-4 leading-7 text-zinc-600">
                {content.sourcingDescription}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light">
                {content.technologyTitle}
              </h3>

              <p className="mt-4 leading-7 text-zinc-600">
                {content.technologyDescription}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light">
                {content.collaborationTitle}
              </h3>

              <p className="mt-4 leading-7 text-zinc-600">
                {content.collaborationDescription}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light">
                {content.tradeTitle}
              </h3>

              <p className="mt-4 leading-7 text-zinc-600">
                {content.tradeDescription}
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
            {content.focusLabel}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="border border-zinc-200 p-8">
              <h3 className="text-2xl font-light">
                {content.miningTitle}
              </h3>
            </div>

            <div className="border border-zinc-200 p-8">
              <h3 className="text-2xl font-light">
                {content.equipmentTitle}
              </h3>
            </div>

            <div className="border border-zinc-200 p-8">
              <h3 className="text-2xl font-light">
                {content.hardwareTitle}
              </h3>
            </div>

            <div className="border border-zinc-200 p-8">
              <h3 className="text-2xl font-light">
                {content.focusTradeTitle}
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200/70">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            {content.workLabel}
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-5">
            {[
              content.understandStep,
              content.identifyStep,
              content.connectStep,
              content.supportStep,
              content.growStep
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
            {content.contactLabel}
          </p>

          <h2 className="mt-5 max-w-3xl text-4xl font-light tracking-tight md:text-6xl">
            {content.contactTitle}
          </h2>

          <div className="mt-10">
            <a
              href={`mailto:${content.contactEmail}`}
              className="inline-block rounded-full bg-white px-7 py-3 text-sm text-[#18181b] hover:opacity-80"
            >
              {content.contactEmail}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
