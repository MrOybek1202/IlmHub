import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Button } from "@/components/ui/button";
import { Atom, FlaskConical, Magnet, Play, Waves, Zap } from "lucide-react";

const SIMS = [
  { id: 1, titleKey: "lab.forces", tagKey: "dash.subject.physics", icon: Zap, color: "physics" },
  { id: 2, titleKey: "lab.magnets", tagKey: "dash.subject.physics", icon: Magnet, color: "physics" },
  { id: 3, titleKey: "lab.molecule", tagKey: "dash.subject.chemistry", icon: Atom, color: "chem" },
  { id: 4, titleKey: "lab.reactions", tagKey: "dash.subject.chemistry", icon: FlaskConical, color: "chem" },
  { id: 5, titleKey: "lab.wave", tagKey: "dash.subject.physics", icon: Waves, color: "physics" },
  { id: 6, titleKey: "lab.circuit", tagKey: "dash.subject.physics", icon: Zap, color: "physics" },
];

export default function Lab() {
  const { t } = useI18n();

  return (
    <div className="container py-8">
      <PageHeader title={t("lab.title")} desc={t("lab.desc")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SIMS.map((s, i) => (
          <div key={s.id} className="group paper-card paper-card-hover rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`relative h-40 bg-subject-${s.color}-tint flex items-center justify-center`}>
              <s.icon className={`h-14 w-14 text-subject-${s.color}`} />
            </div>
            <div className="p-5">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{t(s.tagKey)}</span>
              <h3 className="font-serif text-lg font-semibold mt-1 mb-4">{t(s.titleKey)}</h3>
              <Button size="sm" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary-soft">
                <Play className="h-4 w-4 mr-2" /> {t("lab.run")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
