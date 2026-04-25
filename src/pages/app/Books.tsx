import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { interactiveBooks, localize, subjects } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Books() {
  const { lang, t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectParam = searchParams.get("subject") ?? "all";

  const filteredBooks = useMemo(
    () => interactiveBooks.filter((book) => subjectParam === "all" || book.subjectId === subjectParam),
    [subjectParam]
  );

  return (
    <div className="container py-8">
      <PageHeader title={t("books.title")} desc={t("books.desc")} />

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSearchParams({})} className={`pill ${subjectParam === "all" ? "pill-accent" : ""}`}>{t("common.filter.all")}</button>
        {subjects.map((subject) => (
          <button key={subject.id} onClick={() => setSearchParams({ subject: subject.id })} className={`pill ${subjectParam === subject.id ? "pill-accent" : ""}`}>
            {localize(subject.name, lang)}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="paper-card rounded-[28px] p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-5">
              <div>
                <span className="pill pill-accent mb-3">{t("books.interactive")}</span>
                <h2 className="font-serif text-2xl mb-2">{localize(book.title, lang)}</h2>
                <p className="text-muted-foreground">{localize(book.coverNote, lang)}</p>
              </div>
              <div className="text-sm text-muted-foreground">{book.chapters.length} {t("books.chapters")}</div>
            </div>

            <Accordion type="multiple" className="w-full">
              {book.chapters.map((chapter, index) => (
                <AccordionItem key={index} value={`${book.id}-${index}`} className="border-b border-border">
                  <AccordionTrigger className="text-left font-medium">{localize(chapter.title, lang)}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid xl:grid-cols-[1fr_320px] gap-5 pt-2">
                      <div>
                        <p className="text-sm text-muted-foreground mb-4">{localize(chapter.summary, lang)}</p>
                        <div className="flex flex-wrap gap-3">
                          <Button asChild variant="outline" className="rounded-full">
                            <a href={chapter.practiceUrl} target="_blank" rel="noreferrer">{t("books.openPractice")}</a>
                          </Button>
                          <Button asChild className="rounded-full">
                            <a href={chapter.videoUrl.replace("/embed/", "/watch?v=")} target="_blank" rel="noreferrer">{t("books.chapterVideo")}</a>
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-border bg-black/5 aspect-video">
                        <iframe
                          className="w-full h-full"
                          src={chapter.videoUrl}
                          title={localize(chapter.title, lang)}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 ? <div className="text-center text-muted-foreground py-16">{t("common.empty")}</div> : null}
    </div>
  );
}
