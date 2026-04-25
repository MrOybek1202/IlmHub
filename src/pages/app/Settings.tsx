import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { LangSwitcher } from "@/components/LangSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Settings() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<"idle" | "code">("idle");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    if (!user?.email) return;
    setLoading(true);
    try {
      await api.sendCode(user.email);
      setStep("code");
      toast({ title: t("toast.success"), description: t("auth.code.sent") });
    } catch (err: any) {
      toast({ title: t("toast.error"), description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.email) return;
    setLoading(true);
    try {
      await api.resetPassword(user.email, code, newPassword);
      toast({ title: t("toast.success"), description: t("auth.reset.success") });
      setStep("idle");
      setCode("");
      setNewPassword("");
    } catch (err: any) {
      toast({ title: t("toast.error"), description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-8 max-w-2xl">
      <PageHeader title={t("common.settings")} desc="" />
      <div className="paper-card rounded-2xl p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{t("common.language")}</p>
            <p className="text-sm text-muted-foreground">{t("common.language.desc")}</p>
          </div>
          <LangSwitcher />
        </div>

        <div className="border-t border-border" />

        <div>
          <div className="mb-4">
            <p className="font-medium">{t("auth.reset.changePassword")}</p>
            <p className="text-sm text-muted-foreground">{t("auth.reset.changePasswordDesc")}</p>
          </div>

          {step === "idle" ? (
            <Button onClick={handleSendCode} disabled={loading} variant="outline" className="rounded-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t("cta.sendCode")}
            </Button>
          ) : (
            <form onSubmit={handleReset} className="space-y-4 max-w-sm">
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("auth.reset.codeLabel")}</p>
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="h-10 w-10 border-border bg-surface-2" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("auth.reset.newPassword")}</p>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading || code.length !== 6} className="bg-primary text-primary-foreground hover:bg-primary-soft rounded-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {t("common.save")}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setStep("idle")} disabled={loading} className="rounded-full">
                  {t("common.cancel")}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
