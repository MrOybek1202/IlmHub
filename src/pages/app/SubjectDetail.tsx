import { Link, Navigate, useParams } from "react-router-dom";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getSubjectById, localize } from "@/lib/content";
import { PageHeader } from "./Subjects";
import { ArrowRight, BookOpen, FlaskConical, PlayCircle } from "lucide-react";

export default function SubjectDetail() {
  const { subjectId } = useParams();
  const { lang, t } = useI18n();
  const subject = getSubjectById(subjectId);
  const resourceTypeLabel = {
    video: { uz: "Video", ru: "Видео", en: "Video" },
    lesson: { uz: "Dars", ru: "Урок", en: "Lesson" },
    worksheet: { uz: "Mashq", ru: "Практика", en: "Practice" },
    quiz: { uz: "Quiz", ru: "Квиз", en: "Quiz" },
  };

  if (!subject) return <Navigate to="/app/subjects" replace />;

  return (
    <div className="container py-8 space-y-8">
      <PageHeader title={localize(subject.name, lang)} desc={localize(subject.longDescription, lang)} />

      <section className="paper-card rounded-[28px] p-7">
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="pill">{t("subj.gradeRange")}: {subject.gradeRange}</span>
              <span className="pill">{t("common.progress")}: {subject.progress}%</span>
              <span className="pill">{subject.heroStat} {t("subj.lessons")}</span>
            </div>
            <h2 className="font-serif text-2xl mb-3">{t("subj.skillFocus")}</h2>
            <div className="flex flex-wrap gap-2">
              {subject.skills.map((skill) => (
                <span key={localize(skill, lang)} className="pill">{localize(skill, lang)}</span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 w-full lg:max-w-sm">
            <Link to={`/app/lab?subject=${subject.id}`} className="rounded-2xl bg-primary text-primary-foreground px-5 py-4 flex items-center justify-between">
              <span>{t("lab.title")}</span>
              <FlaskConical className="h-5 w-5" />
            </Link>
            <Link to={`/app/books?subject=${subject.id}`} className="rounded-2xl bg-surface-2 px-5 py-4 flex items-center justify-between">
              <span>{t("books.title")}</span>
              <BookOpen className="h-5 w-5" />
            </Link>
            <Link to={`/app/games?subject=${subject.id}`} className="rounded-2xl bg-surface-2 px-5 py-4 flex items-center justify-between">
              <span>{t("games.title")}</span>
              <PlayCircle className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6">
        <div className="paper-card rounded-[28px] p-6">
          <h2 className="font-serif text-2xl mb-5">{t("subj.resources")}</h2>
          <div className="space-y-4">
            {subject.topics.map((topic) => (
              <div key={localize(topic.title, lang)} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <h3 className="font-serif text-xl">{localize(topic.title, lang)}</h3>
                  <span className="pill">{t("subj.topicDuration")}: {topic.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{localize(topic.summary, lang)}</p>
                <div className="grid gap-3">
                  {topic.resources.map((resource) => (
                    <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="rounded-2xl bg-surface-2 p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{localize(resource.title, lang)}</div>
                        <div className="text-sm text-muted-foreground">{localize(resource.description, lang)}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="paper-card rounded-[28px] p-6">
          <h2 className="font-serif text-2xl mb-5">{t("dash.recentResources")}</h2>
          <div className="space-y-4">
            {subject.topics.flatMap((topic) => topic.resources).slice(0, 3).map((resource) => (
              <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="block rounded-2xl bg-surface-2 p-4">
                <div className="text-sm text-muted-foreground mb-2">{resourceTypeLabel[resource.type][lang]}</div>
                <div className="font-medium mb-1">{localize(resource.title, lang)}</div>
                <div className="text-sm text-muted-foreground">{localize(resource.description, lang)}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
