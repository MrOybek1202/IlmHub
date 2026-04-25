import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ArrowRight, Atom, BookOpen, FlaskConical, Flame, Gamepad2, Play, Sparkles, TrendingUp, Trophy, Zap } from "lucide-react";

export default function Dashboard() {
  const { t } = useI18n();
  const { user } = useAuth();

  const continueLessons = [
    { subject: t("dash.subject.physics"), topic: t("dash.lesson.kinematics"), progress: 35, color: "physics", icon: Atom },
    { subject: t("dash.subject.math"), topic: t("dash.lesson.derivative"), progress: 60, color: "math", icon: TrendingUp },
    { subject: t("dash.subject.chemistry"), topic: t("dash.lesson.oxidation"), progress: 12, color: "chem", icon: FlaskConical },
  ];

  const recommendations = [
    { title: t("dash.recommend.friction"), reason: t("dash.recommend.frictionReason"), subject: t("dash.subject.physics") },
    { title: t("dash.recommend.quadratic"), reason: t("dash.recommend.quadraticReason"), subject: t("dash.subject.math") },
    { title: t("dash.recommend.cell"), reason: t("dash.recommend.cellReason"), subject: t("dash.subject.biology") },
  ];

  const quickActions = [
    { to: "/app/games", label: t("nav.games"), icon: Gamepad2 },
    { to: "/app/lab", label: t("nav.lab"), icon: FlaskConical },
    { to: "/app/books", label: t("nav.books"), icon: BookOpen },
    { to: "/app/virtual", label: t("nav.virtual"), icon: Atom },
  ];

  const pillParts = [
    user?.grade ? `${t("profile.grade")} ${user.grade}` : "",
    user?.goal ? t(`goal.${user.goal}`) : "",
  ].filter(Boolean);

  return (
    <div className="container py-8 space-y-10">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="paper-card rounded-3xl p-7 lg:col-span-2">
          <span className="pill mb-3">{pillParts.join(" • ")}</span>
          <h1 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight mb-2">
            {t("dash.welcome")}, <span className="italic text-primary-soft">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground mb-6">{t("app.tagline")}</p>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>{t("dash.progress")}</span>
            <span className="font-mono text-foreground">38%</span>
          </div>
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: "38%" }} />
          </div>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
          <StatCard icon={Flame} value={user?.streak ?? 0} label={t("dash.streak")} variant="paper" />
          <StatCard icon={Trophy} value={user?.level ?? 1} label={t("dash.level")} variant="ink" />
          <StatCard icon={Zap} value={user?.xp ?? 0} label={t("dash.xp")} variant="accent" />
        </div>
      </section>

      <section>
        <SectionHeader icon={Play} title={t("dash.continue")} desc={t("dash.continue.desc")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {continueLessons.map((l, i) => (
            <Link to="/app/subjects" key={l.topic} className="group paper-card paper-card-hover rounded-2xl p-6 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className={`h-11 w-11 rounded-xl bg-subject-${l.color}-tint flex items-center justify-center`}>
                  <l.icon className={`h-5 w-5 text-subject-${l.color}`} />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{l.progress}%</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{l.subject}</p>
              <h3 className="font-serif text-lg font-semibold mb-4">{l.topic}</h3>
              <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden mb-4">
                <div className={`h-full bg-subject-${l.color} rounded-full`} style={{ width: `${l.progress}%` }} />
              </div>
              <span className="text-sm text-primary font-medium inline-flex items-center">
                {t("cta.continue")} <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader icon={Sparkles} title={t("dash.recommend")} desc={t("dash.recommend.desc")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((r, i) => (
            <div key={r.title} className="paper-card paper-card-hover rounded-2xl p-6 animate-slide-up bg-accent/15 border-accent/30" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="pill pill-accent mb-3">
                <Sparkles className="h-3 w-3" /> AI
              </span>
              <p className="text-xs text-muted-foreground mb-1">{r.subject}</p>
              <h3 className="font-serif text-lg font-semibold mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader icon={Zap} title={t("dash.quick")} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((a, i) => (
            <Link key={a.to} to={a.to} className="group paper-card paper-card-hover rounded-2xl aspect-[5/4] flex flex-col items-center justify-center p-6 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="h-12 w-12 rounded-2xl bg-surface-2 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <a.icon className="h-6 w-6" />
              </div>
              <span className="font-serif font-semibold text-center">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, variant }: { icon: any; value: number; label: string; variant: "paper" | "ink" | "accent" }) {
  const styles = {
    paper: "paper-card text-foreground",
    ink: "ink-card",
    accent: "bg-accent text-accent-foreground border border-accent",
  }[variant];

  return (
    <div className={`${styles} rounded-2xl p-5 flex flex-col justify-between min-h-[120px]`}>
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 opacity-70" />
        <span className="text-xs uppercase tracking-wider opacity-70">{label}</span>
      </div>
      <div className="font-serif text-4xl font-semibold mt-3">{value}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc }: { icon: any; title: string; desc?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-serif text-2xl font-semibold flex items-center gap-2 tracking-tight">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {title}
        </h2>
        {desc ? <p className="text-sm text-muted-foreground mt-1">{desc}</p> : null}
      </div>
    </div>
  );
}
