import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { gameItems, localize, subjects } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, FlaskConical, Gamepad2, Globe2, Languages, Play, Sigma } from "lucide-react";

const icons = {
  physics: Brain,
  math: Sigma,
  chem: FlaskConical,
  bio: Gamepad2,
  geo: Globe2,
  lang: Languages,
};

export default function Games() {
  const { lang, t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectParam = searchParams.get("subject") ?? "all";
  const difficultyParam = searchParams.get("difficulty") ?? "all";
  const query = searchParams.get("q") ?? "";

  const filtered = useMemo(() => {
    return gameItems.filter((item) => {
      const subjectMatch = subjectParam === "all" || item.subjectId === subjectParam;
      const difficultyMatch = difficultyParam === "all" || item.difficulty === difficultyParam;
      const queryMatch =
        !query ||
        localize(item.title, lang).toLowerCase().includes(query.toLowerCase()) ||
        localize(item.description, lang).toLowerCase().includes(query.toLowerCase());
      return subjectMatch && difficultyMatch && queryMatch;
    });
  }, [difficultyParam, lang, query, subjectParam]);

  return (
    <div className="container py-8">
      <PageHeader title={t("games.title")} desc={t("games.desc")} />

      <div className="paper-card rounded-[28px] p-5 mb-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
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
          value={difficultyParam}
          onChange={(event) => setSearchParams((current) => {
            const next = new URLSearchParams(current);
            if (event.target.value === "all") next.delete("difficulty");
            else next.set("difficulty", event.target.value);
            return next;
          })}
          className="h-11 rounded-2xl border border-border bg-background px-4"
        >
          <option value="all">{t("common.filter.difficulty")}: {t("common.filter.all")}</option>
          <option value="easy">{t("common.filter.easy")}</option>
          <option value="medium">{t("common.filter.medium")}</option>
          <option value="hard">{t("common.filter.hard")}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((game) => {
          const Icon = icons[game.subjectId];
          return (
            <div key={game.id} className="paper-card rounded-[28px] p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className={`h-12 w-12 rounded-2xl bg-subject-${game.color}-tint flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 text-subject-${game.color}`} />
                </div>
                <span className="pill">{t(`common.filter.${game.difficulty}`)}</span>
              </div>
              <h3 className="font-serif text-xl mb-2">{localize(game.title, lang)}</h3>
              <p className="text-sm text-muted-foreground mb-4">{localize(game.description, lang)}</p>
              <div className="text-xs text-muted-foreground mb-5">{t("games.providerLabel")}: {game.provider}</div>
              <Button asChild className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary-soft">
                <a href={game.url} target="_blank" rel="noreferrer">
                  <Play className="h-4 w-4 mr-2" /> {t("games.play")}
                </a>
              </Button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 ? <div className="text-center text-muted-foreground py-16">{t("common.empty")}</div> : null}
    </div>
  );
}
