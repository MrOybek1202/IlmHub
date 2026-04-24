import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const BOOKS = [
  { id: 1, title: "Fizika 9", subject: "Physics", chapters: 14, color: "subject-physics" },
  { id: 2, title: "Algebra 8", subject: "Math", chapters: 18, color: "subject-math" },
  { id: 3, title: "Kimyo 10", subject: "Chemistry", chapters: 12, color: "subject-chem" },
  { id: 4, title: "Biologiya 7", subject: "Biology", chapters: 16, color: "subject-bio" },
  { id: 5, title: "Geografiya 9", subject: "Geography", chapters: 11, color: "subject-cs" },
  { id: 6, title: "English Grammar", subject: "Language", chapters: 22, color: "subject-lang" },
];

export default function Books() {
  const { t } = useI18n();
  return (
    <div className="container py-8">
      <PageHeader title={t("books.title")} desc={t("books.desc")} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {BOOKS.map((b, i) => (
          <div
            key={b.id}
            className="group relative rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all hover:-translate-y-1 overflow-hidden animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`relative aspect-[3/4] bg-gradient-to-br from-${b.color}/30 to-surface-2 flex items-center justify-center`}>
              <div className="absolute inset-0 grid-bg opacity-40" />
              <BookOpen className={`relative h-16 w-16 text-${b.color}`} />
            </div>
            <div className="p-4">
              <span className={`text-xs font-mono text-${b.color}`}>{b.subject}</span>
              <h3 className="font-display text-base font-semibold mb-1 mt-1">{b.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{b.chapters} chapters</p>
              <Button size="sm" variant="outline" className="w-full border-border hover:border-primary/40 hover:text-primary">
                {t("books.read")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
