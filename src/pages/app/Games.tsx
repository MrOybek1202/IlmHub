import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Button } from "@/components/ui/button";
import { Brain, FlaskConical, Gamepad2, Play, Spline, Type, Zap } from "lucide-react";

const GAMES = [
  { id: 1, title: "Quiz Battle", desc: "1-on-1 fan kvizlari", icon: Brain, color: "subject-physics" },
  { id: 2, title: "Math Race", desc: "Tezlikka misol yech", icon: Zap, color: "subject-math" },
  { id: 3, title: "Chemistry Builder", desc: "Molekulalar quring", icon: FlaskConical, color: "subject-chem" },
  { id: 4, title: "Spelling Master", desc: "Imloni sayqallang", icon: Type, color: "subject-lang" },
  { id: 5, title: "Bio Memory", desc: "Hujayralarni eslang", icon: Spline, color: "subject-bio" },
  { id: 6, title: "Logic Puzzle", desc: "Mantiqiy o'yinlar", icon: Gamepad2, color: "subject-cs" },
];

export default function Games() {
  const { t } = useI18n();
  return (
    <div className="container py-8">
      <PageHeader title={t("games.title")} desc={t("games.desc")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMES.map((g, i) => (
          <div
            key={g.id}
            className="group relative rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all hover:-translate-y-1 overflow-hidden animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="relative p-6">
              <div className={`absolute -top-8 -right-8 h-32 w-32 rounded-full bg-${g.color}/20 blur-2xl group-hover:bg-${g.color}/35 transition-colors`} />
              <div className="relative">
                <div className={`inline-flex h-14 w-14 rounded-2xl bg-${g.color}/15 items-center justify-center mb-4`}>
                  <g.icon className={`h-7 w-7 text-${g.color}`} />
                </div>
                <h3 className="font-display text-xl font-bold mb-1">{g.title}</h3>
                <p className="text-sm text-muted-foreground mb-5">{g.desc}</p>
                <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary">
                  <Play className="h-4 w-4 mr-2" /> {t("games.play")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
