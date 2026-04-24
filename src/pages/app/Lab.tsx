import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Button } from "@/components/ui/button";
import { Atom, FlaskConical, Magnet, Play, Waves, Zap } from "lucide-react";

const SIMS = [
  { id: 1, title: "Forces and Motion", icon: Zap, tag: "Physics", color: "subject-physics" },
  { id: 2, title: "Magnets and Compasses", icon: Magnet, tag: "Physics", color: "subject-physics" },
  { id: 3, title: "Build a Molecule", icon: Atom, tag: "Chemistry", color: "subject-chem" },
  { id: 4, title: "Reactions & Rates", icon: FlaskConical, tag: "Chemistry", color: "subject-chem" },
  { id: 5, title: "Wave on a String", icon: Waves, tag: "Physics", color: "subject-physics" },
  { id: 6, title: "Circuit Construction", icon: Zap, tag: "Physics", color: "subject-physics" },
];

export default function Lab() {
  const { t } = useI18n();
  return (
    <div className="container py-8">
      <PageHeader title={t("lab.title")} desc={t("lab.desc")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SIMS.map((s, i) => (
          <div
            key={s.id}
            className="group relative rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all hover:-translate-y-1 overflow-hidden animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`relative h-40 bg-gradient-to-br from-${s.color}/30 to-surface-2 flex items-center justify-center overflow-hidden`}>
              <div className="absolute inset-0 grid-bg opacity-50" />
              <s.icon className={`relative h-16 w-16 text-${s.color} animate-glow`} />
            </div>
            <div className="p-5">
              <span className={`inline-block text-xs font-mono text-${s.color} mb-2`}>{s.tag}</span>
              <h3 className="font-display text-lg font-semibold mb-4">{s.title}</h3>
              <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary">
                <Play className="h-4 w-4 mr-2" /> {t("lab.run")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
