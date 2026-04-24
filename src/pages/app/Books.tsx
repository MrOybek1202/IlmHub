import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const BOOKS = [
  { id: 1, title: "Fizika 9", subject: "Physics", chapters: 14, color: "physics" },
  { id: 2, title: "Algebra 8", subject: "Math", chapters: 18, color: "math" },
  { id: 3, title: "Kimyo 10", subject: "Chemistry", chapters: 12, color: "chem" },
  { id: 4, title: "Biologiya 7", subject: "Biology", chapters: 16, color: "bio" },
  { id: 5, title: "Geografiya 9", subject: "Geography", chapters: 11, color: "cs" },
  { id: 6, title: "English Grammar", subject: "Language", chapters: 22, color: "lang" },
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
            className="group paper-card paper-card-hover rounded-2xl overflow-hidden animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`relative aspect-[3/4] bg-subject-${b.color}-tint flex items-center justify-center`}>
              <BookOpen className={`h-14 w-14 text-subject-${b.color}`} />
            </div>
            <div className="p-4">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{b.subject}</span>
              <h3 className="font-serif text-base font-semibold mt-1 mb-1">{b.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{b.chapters} chapters</p>
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
