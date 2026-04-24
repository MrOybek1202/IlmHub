import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Atom, BookOpen, Brain, FlaskConical, Flame, Gamepad2,
  Play, Sparkles, Target, TrendingUp, Trophy, Zap
} from "lucide-react";

export default function Dashboard() {
  const { t } = useI18n();
  const { user } = useAuth();

  const continueLessons = [
    { subject: "Fizika", topic: "Kinematika — 2-dars", progress: 35, color: "subject-physics", icon: Atom },
    { subject: "Matematika", topic: "Hosila", progress: 60, color: "subject-math", icon: TrendingUp },
    { subject: "Kimyo", topic: "Oksidlanish", progress: 12, color: "subject-chem", icon: FlaskConical },
  ];

  const recommendations = [
    { title: "Ishqalanish kuchi", reason: "Bu mavzu sizga qiyinchilik tug'dirmoqda", subject: "Fizika" },
    { title: "Kvadrat tenglamalar", reason: "Keyingi qadamingiz", subject: "Matematika" },
    { title: "Hujayra", reason: "Yangi mavzu", subject: "Biologiya" },
  ];

  const quickActions = [
    { to: "/app/games", label: t("nav.games"), icon: Gamepad2, color: "from-accent to-secondary" },
    { to: "/app/lab", label: t("nav.lab"), icon: FlaskConical, color: "from-primary to-secondary" },
    { to: "/app/books", label: t("nav.books"), icon: BookOpen, color: "from-secondary to-primary" },
    { to: "/app/virtual", label: t("nav.virtual"), icon: Atom, color: "from-success to-primary" },
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Hero greeting */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-card border border-border p-8 md:p-10">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" /> {user?.goal && `Goal: ${user.goal}`} · Grade {user?.grade}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-2">
              {t("dash.welcome")}, <span className="gradient-text">{user?.name?.split(" ")[0]}</span> 👋
            </h1>
            <p className="text-muted-foreground">{t("app.tagline")}</p>
          </div>

          <div className="flex gap-4">
            <StatBadge icon={Flame} value={user?.streak ?? 0} label={t("dash.streak")} color="text-accent" />
            <StatBadge icon={Trophy} value={user?.level ?? 1} label={t("dash.level")} color="text-warning" />
            <StatBadge icon={Zap} value={user?.xp ?? 0} label={t("dash.xp")} color="text-primary" />
          </div>
        </div>

        <div className="relative mt-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">{t("dash.progress")}</span>
            <span className="font-mono text-primary">38%</span>
          </div>
          <Progress value={38} className="h-2 bg-surface-2 [&>div]:bg-gradient-primary" />
        </div>
      </section>

      {/* Continue learning */}
      <section>
        <SectionHeader icon={Play} title={t("dash.continue")} desc={t("dash.continue.desc")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {continueLessons.map((l, i) => (
            <div
              key={l.topic}
              className="group relative p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all hover:-translate-y-1 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-${l.color}/15 flex items-center justify-center`}>
                  <l.icon className={`h-6 w-6 text-${l.color}`} />
                </div>
                <Badge variant="outline" className="font-mono text-xs">{l.progress}%</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{l.subject}</p>
              <h3 className="font-display text-lg font-semibold mb-4">{l.topic}</h3>
              <Progress value={l.progress} className="h-1.5 bg-surface-2 mb-4 [&>div]:bg-gradient-primary" />
              <Button variant="ghost" size="sm" className="text-primary p-0 h-auto hover:bg-transparent">
                {t("cta.continue")} <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* AI recommendations */}
      <section>
        <SectionHeader icon={Brain} title={t("dash.recommend")} desc={t("dash.recommend.desc")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((r, i) => (
            <div
              key={r.title}
              className="group relative p-6 rounded-2xl glass border-secondary/20 hover:border-secondary/50 transition-all hover:-translate-y-1 animate-slide-up cursor-pointer overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-secondary/20 blur-2xl group-hover:bg-secondary/30 transition-colors" />
              <div className="relative">
                <Badge variant="outline" className="border-secondary/40 text-secondary mb-3">
                  <Sparkles className="h-3 w-3 mr-1" /> AI
                </Badge>
                <p className="text-xs text-muted-foreground mb-1">{r.subject}</p>
                <h3 className="font-display text-lg font-semibold mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section>
        <SectionHeader icon={Target} title={t("dash.quick")} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((a, i) => (
            <Link
              key={a.to}
              to={a.to}
              className="group relative aspect-square rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all hover:-translate-y-1 overflow-hidden flex flex-col items-center justify-center p-6 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
              <div className="relative h-14 w-14 rounded-2xl bg-surface-2 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <a.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="font-display font-semibold text-center relative">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatBadge({ icon: Icon, value, label, color }: { icon: any; value: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`flex items-center gap-1.5 ${color} font-display text-2xl font-bold`}>
        <Icon className="h-5 w-5" />
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc }: { icon: any; title: string; desc?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </h2>
        {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
      </div>
    </div>
  );
}
