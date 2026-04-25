import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { dashboardSubjectProgress, dashboardWeeklyProgress, getSubjectById, labItems, localize } from "@/lib/content";
import { ArrowRight, BookOpen, FlaskConical, Gamepad2, LineChart as LineChartIcon, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const { lang, t } = useI18n();

  const radarData = dashboardSubjectProgress.map((item) => ({
    subject: localize(getSubjectById(item.id)!.name, lang),
    progress: item.progress,
  }));

  const quickResources = labItems.slice(0, 3);

  return (
    <div className="container py-8 space-y-8">
      <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="paper-card rounded-[32px] p-7">
          <span className="pill mb-3">{t("dash.analytics")}</span>
          <h1 className="font-serif text-4xl mb-2">
            {t("dash.welcome")}, <span className="italic text-primary-soft">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground mb-6">{t("dash.analytics.desc")}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label={t("dash.streak")} value={user?.streak ?? 0} />
            <MetricCard label={t("dash.level")} value={user?.level ?? 1} />
            <MetricCard label={t("dash.xp")} value={user?.xp ?? 0} />
            <MetricCard label={t("common.progress")} value="73%" />
          </div>
        </div>

        <div className="ink-card p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm opacity-75">{t("dash.recentResources")}</div>
              <div className="font-serif text-3xl mt-1">3</div>
            </div>
            <Target className="h-8 w-8 text-accent" />
          </div>
          <div className="space-y-3">
            {quickResources.map((item) => (
              <Link key={item.id} to={`/app/lab?subject=${item.subjectId}`} className="block rounded-2xl bg-white/10 px-4 py-3">
                <div className="font-medium">{localize(item.title, lang)}</div>
                <div className="text-sm opacity-75">{item.provider}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="paper-card rounded-[32px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <LineChartIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-serif text-2xl">{t("dash.weeklyTarget")}</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardWeeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="target" fill="hsl(var(--surface-3))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="paper-card rounded-[32px] p-6">
          <h2 className="font-serif text-2xl mb-4">{t("dash.subjectBreakdown")}</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar dataKey="progress" stroke="hsl(var(--primary))" fill="hsl(var(--accent))" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <QuickCard to="/app/subjects" icon={BookOpen} title={t("subj.title")} desc={t("subj.desc")} />
        <QuickCard to="/app/lab?subject=physics" icon={FlaskConical} title={t("lab.title")} desc={t("lab.desc")} />
        <QuickCard to="/app/games" icon={Gamepad2} title={t("games.title")} desc={t("games.desc")} />
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className="font-serif text-3xl">{value}</div>
    </div>
  );
}

function QuickCard({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) {
  const { t } = useI18n();
  return (
    <Link to={to} className="paper-card paper-card-hover rounded-[28px] p-6">
      <Icon className="h-8 w-8 text-primary mb-4" />
      <h3 className="font-serif text-2xl mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{desc}</p>
      <span className="inline-flex items-center text-primary font-medium">{t("common.open")} <ArrowRight className="h-4 w-4 ml-2" /></span>
    </Link>
  );
}
