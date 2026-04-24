import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Button } from "@/components/ui/button";
import { Brain, FlaskConical, Gamepad2, Play, Spline, Type, Zap } from "lucide-react";

const GAMES = [
  { id: 1, title: "Quiz Battle", desc: "1-on-1 fan kvizlari", icon: Brain, color: "physics" },
  { id: 2, title: "Math Race", desc: "Tezlikka misol yech", icon: Zap, color: "math" },
  { id: 3, title: "Chemistry Builder", desc: "Molekulalar quring", icon: FlaskConical, color: "chem" },
  { id: 4, title: "Spelling Master", desc: "Imloni sayqallang", icon: Type, color: "lang" },
  { id: 5, title: "Bio Memory", desc: "Hujayralarni eslang", icon: Spline, color: "bio" },
  { id: 6, title: "Logic Puzzle", desc: "Mantiqiy o'yinlar", icon: Gamepad2, color: "cs" },
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
            className="group paper-card paper-card-hover rounded-2xl p-6 animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`inline-flex h-12 w-12 rounded-xl bg-subject-${g.color}-tint items-center justify-center mb-4`}>
              <g.icon className={`h-6 w-6 text-subject-${g.color}`} />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-1">{g.title}</h3>
            <p className="text-sm text-muted-foreground mb-5">{g.desc}</p>
            <Button size="sm" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary-soft">
              <Play className="h-4 w-4 mr-2" /> {t("games.play")}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
