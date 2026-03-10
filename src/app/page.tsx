"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useNewsletterForm } from "@/hooks/use-newsletter-form";

export default function LandingPage() {
  const { email, setEmail, isSubmitting, isSuccess, handleSubmit } = useNewsletterForm();

  return (
    <div className="min-h-screen font-[var(--font-body)]">
      <Navbar variant="landing" />

      {/* ─── Hero ─── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand via-brand-700 to-brand-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-20 h-[400px] w-[400px] rounded-full bg-accent-400/[.04] blur-[100px] animate-float" />
          <div className="absolute bottom-20 right-0 h-[500px] w-[500px] rounded-full bg-accent-400/[.04] blur-[120px] animate-float delay-300" />
          <div className="absolute inset-0 bg-grid" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-12 pt-28 text-center">
          <div className="mb-8 inline-flex animate-fade-in items-center gap-2.5 rounded-full border border-white/10 bg-white/[.05] px-5 py-2 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-white/60">Mais de 1.200 assinantes ativos</span>
          </div>

          <h1 className="animate-fade-up font-[var(--font-heading)] text-[clamp(2.25rem,5.5vw,5rem)] font-extrabold leading-[1.08] tracking-tight text-white">
            Onde eventos se tornam{" "}
            <span className="bg-gradient-to-r from-accent-200 to-accent-400 bg-clip-text text-transparent">histórias inesquecíveis</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/50 delay-100" style={{ opacity: 0 }}>
            A newsletter premium sobre eventos, palestras e storytelling que vai
            transformar a maneira como você se conecta com audiências.
          </p>

          <div id="inscrever" className="mx-auto mt-10 max-w-md animate-fade-up delay-200" style={{ opacity: 0 }}>
            {!isSuccess ? (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="hero-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Seu melhor email"
                    className="flex-1 rounded-xl border border-white/10 bg-white/[.06] px-5 py-3.5 text-sm text-white placeholder-white/30 backdrop-blur transition focus:border-accent-400/40 focus:bg-white/[.08] focus:outline-none focus:ring-2 focus:ring-accent-400/20"
                  />
                  <Button id="hero-submit" type="submit" loading={isSubmitting} size="lg" className="!bg-white !text-brand hover:!bg-slate-100 dark:!bg-white dark:!text-brand">
                    Inscrever-se
                  </Button>
                </div>
                <p className="mt-3 text-xs text-white/25">Sem spam. Cancele quando quiser.</p>
              </form>
            ) : (
              <div className="animate-scale-up rounded-2xl border border-white/10 bg-white/[.06] p-7 backdrop-blur">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="mb-1 font-[var(--font-heading)] text-lg font-bold text-white">Bem-vindo à comunidade</h3>
                <p className="text-sm text-white/50">Enviamos seu acesso para <strong className="text-white/70">{email}</strong></p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 dark:bg-brand-900 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-500 dark:text-accent-400">O que oferecemos</p>
            <h2 className="mx-auto max-w-lg font-[var(--font-heading)] text-4xl font-extrabold text-brand dark:text-white sm:text-5xl">Conteúdo que transforma</h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 dark:text-slate-400">Insights exclusivos sobre o universo de eventos, palestras e storytelling entregues diretamente no seu email.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Bastidores de Eventos", desc: "Acesso exclusivo ao que acontece por trás dos maiores eventos. Análises, tendências e insights que você não encontra em outro lugar.", icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                )
              },
              {
                title: "Análise de Palestras", desc: "Deconstruímos as melhores palestras e revelamos as técnicas dos speakers mais influentes do mundo.", icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                )
              },
              {
                title: "Storytelling Aplicado", desc: "Frameworks práticos para dominar a arte de contar histórias e impactar qualquer audiência de forma memorável.", icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.467.89 6.067 2.35m0-14.308A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.042" /></svg>
                )
              },
            ].map((f, i) => (
              <div key={i} className="card-premium p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition dark:bg-accent-400/10 dark:text-accent-400">{f.icon}</div>
                <h3 className="mb-2 font-[var(--font-heading)] text-lg font-bold text-brand dark:text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="bg-gradient-to-br from-brand via-brand-700 to-brand-900 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {[
            { n: "1.200+", l: "Assinantes ativos" },
            { n: "42", l: "Edições publicadas" },
            { n: "68%", l: "Taxa de abertura" },
            { n: "4.9/5", l: "Satisfação dos leitores" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-[var(--font-heading)] text-4xl font-extrabold text-white sm:text-5xl">{s.n}</p>
              <p className="mt-1 text-sm text-white/40">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 dark:bg-brand-900 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-500 dark:text-accent-400">Depoimentos</p>
            <h2 className="font-[var(--font-heading)] text-4xl font-extrabold text-brand dark:text-white">O que dizem nossos leitores</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { q: "A melhor newsletter sobre eventos que já assinei. Conteúdo profundo, curadoria impecável e uma qualidade editorial surpreendente.", n: "Maria Silva", r: "Produtora de Eventos" },
              { q: "Mudou completamente minha forma de pensar storytelling para apresentações. Cada edição é uma aula.", n: "João Santos", r: "Head de Marketing" },
              { q: "Os bastidores de eventos são fascinantes. É como ter acesso VIP sem sair de casa.", n: "Ana Oliveira", r: "Speaker & Consultora" },
            ].map((t, i) => (
              <div key={i} className="card-premium p-6">
                <div className="mb-5 flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="mb-5 text-sm italic leading-relaxed text-slate-600 dark:text-slate-400">&ldquo;{t.q}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white dark:bg-accent-400/20 dark:text-accent-300">{t.n[0]}</div>
                  <div><p className="text-sm font-semibold text-brand dark:text-white">{t.n}</p><p className="text-xs text-slate-400">{t.r}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 dark:bg-brand-900 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-[var(--font-heading)] text-4xl font-extrabold text-brand dark:text-white sm:text-5xl">Pronto para começar?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500 dark:text-slate-400">Junte-se a mais de 1.200 profissionais que transformam sua perspectiva toda semana.</p>
          <a href="#inscrever">
            <Button size="lg" className="mt-8" icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>}>
              Inscrever-se gratuitamente
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
