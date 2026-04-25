import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { getSubjectById, labItems, localize, subjects } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Lab() {
  const { lang, t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectParam = searchParams.get("subject") ?? "all";
  const levelParam = searchParams.get("level") ?? "all";
  const query = searchParams.get("q") ?? "";

  const filtered = useMemo(() => {
    return labItems.filter((item) => {
      const subjectMatch = subjectParam === "all" || item.subjectId === subjectParam;
      const levelMatch = levelParam === "all" || item.level === levelParam;
      const queryMatch =
        !query ||
        localize(item.title, lang).toLowerCase().includes(query.toLowerCase()) ||
        localize(item.description, lang).toLowerCase().includes(query.toLowerCase());
      return subjectMatch && levelMatch && queryMatch;
    });
  }, [lang, levelParam, query, subjectParam]);

  const selectedSubject = getSubjectById(subjectParam);

  return (
    <div className="container py-8">
      <PageHeader
        title={t("lab.title")}
        desc={selectedSubject ? `${localize(selectedSubject.name, lang)}: ${localize(selectedSubject.shortDescription, lang)}` : t("lab.desc")}
      />

      <div className="paper-card rounded-[28px] p-5 mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <Input
          value={query}
          onChange={(event) => setSearchParams((current) => {
            const next = new URLSearchParams(current);
            if (event.target.value) next.set("q", event.target.value);
            else next.delete("q");
            return next;
          })}
          placeholder={t("common.search.placeholder")}
          className="rounded-2xl"
        />

        <select
          value={subjectParam}
          onChange={(event) => setSearchParams((current) => {
            const next = new URLSearchParams(current);
            if (event.target.value === "all") next.delete("subject");
            else next.set("subject", event.target.value);
            return next;
          })}
          className="h-11 rounded-2xl border border-border bg-background px-4"
        >
          <option value="all">{t("common.filter.subject")}: {t("common.filter.all")}</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>{localize(subject.name, lang)}</option>
          ))}
        </select>

        <select
          value={levelParam}
          onChange={(event) => setSearchParams((current) => {
            const next = new URLSearchParams(current);
            if (event.target.value === "all") next.delete("level");
            else next.set("level", event.target.value);
            return next;
          })}
          className="h-11 rounded-2xl border border-border bg-background px-4"
        >
          <option value="all">{t("common.filter.level")}: {t("common.filter.all")}</option>
          <option value="starter">{t("common.filter.starter")}</option>
          <option value="intermediate">{t("common.filter.intermediate")}</option>
          <option value="advanced">{t("common.filter.advanced")}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div key={item.id} className="paper-card rounded-[28px] overflow-hidden">
            <div className={`h-32 bg-subject-${item.color}-tint`} />
            <div className="p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="pill">{localize(getSubjectById(item.subjectId)!.name, lang)}</span>
                <span className="text-xs text-muted-foreground">{t(`common.filter.${item.level}`)}</span>
              </div>
              <h3 className="font-serif text-xl mb-2">{localize(item.title, lang)}</h3>
              <p className="text-sm text-muted-foreground mb-4">{localize(item.description, lang)}</p>
              <div className="text-xs text-muted-foreground mb-4">{t("lab.providerLabel")}: {item.provider}</div>
              <div className="flex gap-3">
                <Button asChild className="rounded-full flex-1">
                  <a href={item.url} target="_blank" rel="noreferrer">{t("lab.run")}</a>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to={`/app/subjects/${item.subjectId}`}>{t("subj.openTrack")}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? <div className="text-center text-muted-foreground py-16">{t("common.empty")}</div> : null}
    </div>
  );
}
