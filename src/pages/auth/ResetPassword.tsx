import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { t } = useI18n();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(() => new URLSearchParams(window.location.search).get("email") || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.sendCode(email, 'reset');
      setStep("code");
      toast({ title: t("toast.success"), description: t("auth.code.sent") });
    } catch (err: any) {
      toast({ title: t("toast.error"), description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.resetPassword(email, code, newPassword);
      toast({ title: t("toast.success"), description: t("auth.reset.success") });
      navigate("/auth/signin");
    } catch (err: any) {
      toast({ title: t("toast.error"), description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={t("auth.reset.title")}
      subtitle={step === "email" ? t("auth.reset.desc") : `${t("auth.code.sent")} (${email})`}
      footer={
        <Link to="/auth/signin" className="text-primary hover:underline">
          {t("common.back")}
        </Link>
      }
    >
      {step === "email" ? (
        <form onSubmit={sendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary-soft rounded-full h-11">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("cta.sendCode")}
          </Button>
        </form>
      ) : (
        <form onSubmit={reset} className="space-y-5">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} className="h-12 w-12 text-lg border-border bg-surface-2" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="space-y-2">
            <Label htmlFor="np">{t("auth.reset.newPassword")}</Label>
            <div className="relative">
              <Input id="np" type={showPassword ? "text" : "password"} required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading || code.length !== 6} className="w-full bg-primary text-primary-foreground hover:bg-primary-soft rounded-full h-11">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.code.verify")}
          </Button>
          <p className="text-center text-xs text-muted-foreground">{t("auth.check.email")}</p>
        </form>
      )}
    </AuthShell>
  );
}
