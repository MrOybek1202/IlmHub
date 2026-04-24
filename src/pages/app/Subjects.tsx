import { useI18n } from "@/lib/i18n/I18nProvider";
import { Atom, Calculator, Dna, FlaskConical, Globe2, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const SUBJECTS = [
  { id: "math", name: "Matematika", icon: Calculator, color: "subject-math", topics: 84, progress: 42 },
  { id: "physics", name: "Fizika", icon: Atom, color: "subject-physics", topics: 62, progress: 35 },
  { id: "chem", name: "Kimyo", icon: FlaskConical, color: "subject-chem", topics: 48, progress: 18 },
  { id: "bio", name: "Biologiya", icon: Dna, color: "subject-bio", topics: 56, progress: 60 },
  { id: "geo", name: "Geografiya", icon: Globe2, color: "subject-cs", topics: 38, progress: 22 },
  { id: "lang", name: "Ingliz tili", icon: Languages, color: "subject-lang", topics: 72, progress: 50 },
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
            className="group relative p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all hover:-translate-y-1 cursor-pointer overflow-hidden animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-${s.color}/15 blur-3xl group-hover:bg-${s.color}/25 transition-colors`} />
            <div className="relative">
              <div className={`h-14 w-14 rounded-2xl bg-${s.color}/15 flex items-center justify-center mb-4`}>
                <s.icon className={`h-7 w-7 text-${s.color}`} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-1">{s.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{s.topics} mavzu</p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Progress</span>
                  <span className={`font-mono text-${s.color}`}>{s.progress}%</span>
                </div>
                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div className={`h-full bg-${s.color} rounded-full transition-all`} style={{ width: `${s.progress}%` }} />
                </div>
              </div>

              <Button variant="ghost" size="sm" className="text-primary p-0 h-auto hover:bg-transparent">
                {t("cta.continue")} <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-8 animate-fade-in">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
