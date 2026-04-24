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
import { Loader2 } from "lucide-react";

export default function ResetPassword() {
  const { t } = useI18n();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.sendCode(email);
      setStep("code");
      toast({ title: t("auth.code.sent") });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.resetPassword(email, code, newPassword);
      toast({ title: "✓" });
      navigate("/auth/signin");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
          ← {t("cta.login")}
        </Link>
      }
    >
      {step === "email" ? (
        <form onSubmit={sendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary h-11">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.next")}
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
            <Label htmlFor="np">{t("auth.password")}</Label>
            <Input id="np" type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading || code.length !== 6} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary h-11">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.code.verify")}
          </Button>
          <p className="text-center text-xs text-muted-foreground">(mock: 123456)</p>
        </form>
      )}
    </AuthShell>
  );
}
