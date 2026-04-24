import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Atom, ArrowRight, BrainCircuit, FlaskConical, Gamepad2, LineChart, Sparkles, Zap } from "lucide-react";

export default function Landing() {
  const { t } = useI18n();

  const features = [
    { icon: BrainCircuit, title: t("land.f1.title"), desc: t("land.f1.desc"), color: "text-primary", glow: "shadow-glow-primary" },
    { icon: FlaskConical, title: t("land.f2.title"), desc: t("land.f2.desc"), color: "text-secondary", glow: "shadow-glow-secondary" },
    { icon: Gamepad2, title: t("land.f3.title"), desc: t("land.f3.desc"), color: "text-accent", glow: "shadow-glow-accent" },
    { icon: LineChart, title: t("land.f4.title"), desc: t("land.f4.desc"), color: "text-success", glow: "shadow-glow-primary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Top bar */}
      <header className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">
            ILM<span className="gradient-text">Hub</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <Link to="/auth/signin">
            <Button variant="ghost" size="sm">{t("cta.login")}</Button>
          </Link>
          <Link to="/auth/signup">
            <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary">
              {t("cta.signup")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="container relative py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/30 text-xs font-medium text-primary mb-8 animate-fade-in">
            <Zap className="h-3.5 w-3.5" />
            {t("land.hero.badge")}
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up">
            {t("land.hero.title")}<br />
            <span className="gradient-text">{t("land.hero.title2")}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-slide-up [animation-delay:100ms]">
            {t("land.hero.desc")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up [animation-delay:200ms]">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary text-base h-12 px-8">
                {t("cta.start")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth/signin">
              <Button size="lg" variant="outline" className="h-12 px-8 border-border-glow/40 text-base">
                {t("cta.explore")}
              </Button>
            </Link>
          </div>

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl animate-float" />
          <div className="absolute top-1/2 right-10 h-40 w-40 rounded-full bg-secondary/20 blur-3xl animate-float [animation-delay:1.5s]" />
          <div className="absolute bottom-10 left-1/3 h-24 w-24 rounded-full bg-accent/20 blur-3xl animate-float [animation-delay:3s]" />
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-16">
          {t("land.features.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 ${f.color} mb-4 group-hover:${f.glow} transition-all`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-card border border-border p-12 md:p-20 text-center">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative">
            <Atom className="h-12 w-12 text-primary mx-auto mb-6 animate-glow" />
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">{t("app.tagline")}</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t("land.hero.desc")}</p>
            <Link to="/auth/signup">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary h-12 px-8">
                {t("cta.start")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="container py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        © {new Date().getFullYear()} ILM Hub. {t("app.tagline")}.
      </footer>
    </div>
  );
}
