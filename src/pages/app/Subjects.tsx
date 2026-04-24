import { useI18n } from "@/lib/i18n/I18nProvider";
import { Atom, Calculator, Dna, FlaskConical, Globe2, Languages, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUBJECTS = [
  { id: "math", name: "Matematika", icon: Calculator, color: "math", topics: 84, progress: 42 },
  { id: "physics", name: "Fizika", icon: Atom, color: "physics", topics: 62, progress: 35 },
  { id: "chem", name: "Kimyo", icon: FlaskConical, color: "chem", topics: 48, progress: 18 },
  { id: "bio", name: "Biologiya", icon: Dna, color: "bio", topics: 56, progress: 60 },
  { id: "geo", name: "Geografiya", icon: Globe2, color: "cs", topics: 38, progress: 22 },
  { id: "lang", name: "Ingliz tili", icon: Languages, color: "lang", topics: 72, progress: 50 },
];

export default function Subjects() {
  const { t } = useI18n();
  return (
    <div className="container py-8">
      <PageHeader title={t("subj.title")} desc={t("subj.desc")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SUBJECTS.map((s, i) => (
          <div
            key={s.id}
            className="group paper-card paper-card-hover rounded-2xl p-6 cursor-pointer animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`h-12 w-12 rounded-xl bg-subject-${s.color}-tint flex items-center justify-center mb-4`}>
              <s.icon className={`h-6 w-6 text-subject-${s.color}`} />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-1">{s.name}</h3>
            <p className="text-sm text-muted-foreground mb-5">{s.topics} mavzu</p>

            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-mono text-foreground">{s.progress}%</span>
              </div>
              <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div className={`h-full bg-subject-${s.color} rounded-full transition-all`} style={{ width: `${s.progress}%` }} />
              </div>
            </div>

            <span className="text-sm text-primary font-medium inline-flex items-center">
              {t("cta.continue")} <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-8 animate-fade-in">
      <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2 tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
