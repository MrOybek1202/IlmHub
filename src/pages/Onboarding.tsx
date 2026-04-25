import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen, FlaskConical, Gamepad2, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Goal = "school" | "experiments" | "exam" | "games";

export default function Onboarding() {
  const { t } = useI18n();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [grade, setGrade] = useState<number | null>(user?.grade ?? null);
  const [goal, setGoal] = useState<Goal | null>((user?.goal as Goal) ?? null);
  const [saving, setSaving] = useState(false);

  async function finish() {
    if (!grade || !goal) return;
    setSaving(true);
    try {
      await updateUser({ grade, goal });
      navigate("/app");
    } catch (err: any) {
      toast({ title: t("toast.error"), description: err.message, variant: "destructive" });
      setSaving(false);
    }
  }

  const goals: { id: Goal; icon: any }[] = [
    { id: "school", icon: BookOpen },
    { id: "experiments", icon: FlaskConical },
    { id: "exam", icon: Trophy },
    { id: "games", icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="container flex h-16 items-center justify-between">
        <Logo />
        <LangSwitcher />
      </header>

      <main className="container max-w-3xl py-8 md:py-16">
        <div className="mb-10 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-mono text-xs">{t("onb.step")} {step} / 2</span>
          <div className="flex-1 h-1 bg-surface-2 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${step * 50}%` }} />
          </div>
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="font-serif text-3xl md:text-5xl font-semibold mb-3 tracking-tight">{t("onb.class.title")}</h1>
              <p className="text-muted-foreground text-lg">{t("onb.class.desc")}</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {Array.from({ length: 11 }).map((_, i) => {
                const g = i + 1;
                const selected = grade === g;
                return (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`aspect-square rounded-2xl font-serif text-2xl font-semibold transition-all ${
                      selected
                        ? "bg-primary text-primary-foreground shadow-md scale-[1.03]"
                        : "paper-card paper-card-hover text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                disabled={!grade}
                onClick={() => setStep(2)}
                size="lg"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary-soft h-12 px-8"
              >
                {t("common.next")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="font-serif text-3xl md:text-5xl font-semibold mb-3 tracking-tight">{t("onb.goal.title")}</h1>
              <p className="text-muted-foreground text-lg">{t("onb.goal.desc")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map((g) => {
                const selected = goal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`group p-6 rounded-2xl text-left transition-all ${
                      selected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "paper-card paper-card-hover"
                    }`}
                  >
                    <g.icon className={`h-8 w-8 mb-4 ${selected ? "text-accent" : "text-primary"}`} />
                    <h3 className="font-serif text-xl font-semibold mb-1">
                      {t(`onb.goal.${g.id === "experiments" ? "exp" : g.id}`)}
                    </h3>
                    <p className={`text-sm ${selected ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                      {t(`onb.goal.${g.id === "experiments" ? "exp" : g.id}.d`)}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} size="lg" className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.back")}
              </Button>
              <Button
                disabled={!goal || saving}
                onClick={finish}
                size="lg"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary-soft h-12 px-8"
              >
                {t("onb.finish")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
