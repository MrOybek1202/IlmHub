import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { localize, subjects } from "@/lib/content";
import { ArrowRight, Atom, Calculator, Dna, FlaskConical, Globe2, Languages } from "lucide-react";

const subjectIcons = {
  math: Calculator,
  physics: Atom,
  chem: FlaskConical,
  bio: Dna,
  geo: Globe2,
  lang: Languages,
};

export default function Subjects() {
  const { t, lang } = useI18n();

  return (
    <div className="container py-8">
      <PageHeader title={t("subj.title")} desc={t("subj.desc")} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.map((subject, index) => {
          const Icon = subjectIcons[subject.id];
          return (
            <Link
              key={subject.id}
              to={`/app/subjects/${subject.id}`}
              className="paper-card paper-card-hover rounded-[28px] p-6 animate-slide-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={`h-14 w-14 rounded-2xl bg-subject-${subject.color}-tint flex items-center justify-center mb-5`}>
                    <Icon className={`h-7 w-7 text-subject-${subject.color}`} />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold mb-2">{localize(subject.name, lang)}</h3>
                  <p className="text-sm text-muted-foreground max-w-xl">{localize(subject.shortDescription, lang)}</p>
                </div>
                <span className="pill">{subject.gradeRange}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <Metric label={t("subj.lessons")} value={subject.heroStat} />
                <Metric label={t("common.progress")} value={`${subject.progress}%`} />
                <Metric label={t("subj.gradeRange")} value={subject.gradeRange} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {subject.skills.map((skill) => (
                  <span key={localize(skill, lang)} className="pill">{localize(skill, lang)}</span>
                ))}
              </div>

              <div className="mt-6 inline-flex items-center text-primary font-medium">
                {t("subj.openTrack")} <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="font-serif text-2xl font-semibold">{value}</div>
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
