import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Logo } from "@/components/Logo";
import { ArrowRight, BookOpen, BrainCircuit, FlaskConical, Gamepad2, LineChart, Sparkles } from "lucide-react";

export default function Landing() {
  const { t } = useI18n();

  const features = [
    { icon: BrainCircuit, title: t("land.f1.title"), desc: t("land.f1.desc") },
    { icon: FlaskConical, title: t("land.f2.title"), desc: t("land.f2.desc") },
    { icon: Gamepad2, title: t("land.f3.title"), desc: t("land.f3.desc") },
    { icon: LineChart, title: t("land.f4.title"), desc: t("land.f4.desc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="container flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <Link to="/auth/signin">
            <Button variant="ghost" size="sm" className="rounded-full">{t("cta.login")}</Button>
          </Link>
          <Link to="/auth/signup">
            <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary-soft">
              {t("cta.signup")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container pt-16 md:pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="pill mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" /> {t("land.hero.badge")}
          </span>

          <h1 className="font-serif text-5xl md:text-7xl font-semibold tracking-tight mb-6 animate-slide-up text-foreground">
            {t("land.hero.title")}{" "}
            <span className="italic text-primary-soft">{t("land.hero.title2")}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 animate-slide-up [animation-delay:80ms]">
            {t("land.hero.desc")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 animate-slide-up [animation-delay:160ms]">
            <Link to="/auth/signup">
              <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary-soft h-12 px-7 text-base">
                {t("cta.start")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth/signin">
              <Button size="lg" variant="outline" className="rounded-full h-12 px-7 text-base bg-card hover:bg-surface-2">
                {t("cta.explore")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero visual — academic stack */}
        <div className="mt-20 max-w-5xl mx-auto grid grid-cols-3 gap-4 animate-fade-in [animation-delay:300ms]">
          <div className="paper-card rounded-2xl p-6 col-span-2 row-span-2 min-h-[260px]">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-3">
              <span className="h-2 w-2 rounded-full bg-success" /> 02:35 · {t("dash.continue")}
            </div>
            <h3 className="font-serif text-2xl mb-3">Kinematika — 2-dars</h3>
            <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary rounded-full w-[35%]" />
            </div>
            <p className="text-xs text-muted-foreground">35% · 12 daqiqa qoldi</p>
          </div>
          <div className="ink-card p-5 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider opacity-70">Streak</span>
            <div>
              <div className="font-serif text-4xl font-semibold">7</div>
              <div className="text-xs opacity-70 mt-1">kun ketma-ket</div>
            </div>
          </div>
          <div className="paper-card rounded-2xl p-5 bg-accent/30 border-accent/40 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-accent-foreground/70">XP</span>
            <div>
              <div className="font-serif text-4xl font-semibold text-accent-foreground">1,240</div>
              <div className="text-xs text-accent-foreground/70 mt-1">+120 bugun</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 border-t border-border">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-3 tracking-tight">
          {t("land.features.title")}
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">{t("app.tagline")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="paper-card paper-card-hover rounded-2xl p-6 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-primary mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container pb-20">
        <div className="ink-card p-12 md:p-20 text-center">
          <BookOpen className="h-10 w-10 mx-auto mb-6 text-accent" />
          <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-4 tracking-tight">{t("app.tagline")}</h2>
          <p className="opacity-75 mb-8 max-w-xl mx-auto">{t("land.hero.desc")}</p>
          <Link to="/auth/signup">
            <Button size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8">
              {t("cta.start")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="container py-8 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} ILM Hub
      </footer>
    </div>
  );
}
