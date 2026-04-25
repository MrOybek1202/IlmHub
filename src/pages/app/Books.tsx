import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const BOOKS = [
  { id: 1, titleKey: "books.book.physics9", subjectKey: "dash.subject.physics", chapters: 14, color: "physics" },
  { id: 2, titleKey: "books.book.algebra8", subjectKey: "dash.subject.math", chapters: 18, color: "math" },
  { id: 3, titleKey: "books.book.chem10", subjectKey: "dash.subject.chemistry", chapters: 12, color: "chem" },
  { id: 4, titleKey: "books.book.bio7", subjectKey: "dash.subject.biology", chapters: 16, color: "bio" },
  { id: 5, titleKey: "books.book.geo9", subjectKey: "books.book.geo9", chapters: 11, color: "cs" },
  { id: 6, titleKey: "books.book.grammar", subjectKey: "books.book.grammar", chapters: 22, color: "lang" },
];

export default function Books() {
  const { t } = useI18n();

  return (
    <div className="container py-8">
      <PageHeader title={t("books.title")} desc={t("books.desc")} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {BOOKS.map((b, i) => (
          <div key={b.id} className="group paper-card paper-card-hover rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`relative aspect-[3/4] bg-subject-${b.color}-tint flex items-center justify-center`}>
              <BookOpen className={`h-14 w-14 text-subject-${b.color}`} />
            </div>
            <div className="p-4">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{t(b.subjectKey)}</span>
              <h3 className="font-serif text-base font-semibold mt-1 mb-1">{t(b.titleKey)}</h3>
              <p className="text-xs text-muted-foreground mb-3">{b.chapters} {t("books.chapters")}</p>
              <Button size="sm" variant="outline" className="w-full rounded-full bg-card hover:bg-surface-2">
                {t("books.read")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
