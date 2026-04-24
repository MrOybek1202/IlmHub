import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen, FlaskConical, Gamepad2, GraduationCap, Sparkles, Trophy } from "lucide-react";
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
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setSaving(false);
    }
  }

  const goals: { id: Goal; icon: any; color: string }[] = [
    { id: "school", icon: BookOpen, color: "text-primary" },
    { id: "experiments", icon: FlaskConical, color: "text-secondary" },
    { id: "exam", icon: Trophy, color: "text-warning" },
    { id: "games", icon: Gamepad2, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">ILM<span className="gradient-text">Hub</span></span>
        </div>
        <LangSwitcher />
      </header>

      <main className="container max-w-3xl py-8 md:py-16">
        {/* Progress */}
        <div className="mb-10 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-mono">{t("onb.step")} {step} {t("onb.of")} 2</span>
          <div className="flex-1 h-1 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${step * 50}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4 animate-glow" />
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">{t("onb.class.title")}</h1>
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
                    className={`aspect-square rounded-2xl font-display text-2xl font-bold transition-all hover:scale-105 ${
                      selected
                        ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                        : "bg-gradient-card border border-border text-foreground hover:border-primary/40"
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
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary h-12 px-8"
              >
                {t("common.next")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <Trophy className="h-12 w-12 text-accent mx-auto mb-4 animate-glow" />
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">{t("onb.goal.title")}</h1>
              <p className="text-muted-foreground text-lg">{t("onb.goal.desc")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map((g) => {
                const selected = goal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`group relative p-6 rounded-2xl text-left transition-all hover:-translate-y-1 ${
                      selected
                        ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                        : "bg-gradient-card border border-border hover:border-primary/40"
                    }`}
                  >
                    <g.icon className={`h-10 w-10 mb-4 ${selected ? "text-primary-foreground" : g.color}`} />
                    <h3 className="font-display text-xl font-semibold mb-1">{t(`onb.goal.${g.id === "experiments" ? "exp" : g.id}`)}</h3>
                    <p className={`text-sm ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {t(`onb.goal.${g.id === "experiments" ? "exp" : g.id}.d`)}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} size="lg">
                <ArrowLeft className="mr-2 h-5 w-5" /> {t("common.back")}
              </Button>
              <Button
                disabled={!goal || saving}
                onClick={finish}
                size="lg"
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary h-12 px-8"
              >
                {t("onb.finish")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
