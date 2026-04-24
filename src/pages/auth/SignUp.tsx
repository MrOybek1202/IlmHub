import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { api } from "@/lib/api";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SignUp() {
  const { t } = useI18n();
  const { signup, signinGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.sendCode(email);
      setStep("verify");
      toast({ title: t("auth.code.sent") });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const r = await api.verifyCode(email, code);
      if (!r.ok) throw new Error("Invalid code");
      await signup(email, password, name);
      navigate("/onboarding");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setLoading(true);
    try {
      await signinGoogle("mock-google-id-token");
      navigate("/onboarding");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={step === "form" ? t("auth.signup.title") : t("auth.code.verify")}
      subtitle={step === "verify" ? `${t("auth.code.sent")} (${email})` : undefined}
      footer={
        step === "form" ? (
          <>
            {t("auth.have")}{" "}
            <Link to="/auth/signin" className="text-primary hover:underline font-medium">
              {t("cta.login")}
            </Link>
          </>
        ) : (
          <button onClick={() => setStep("form")} className="text-primary hover:underline">
            {t("common.back")}
          </button>
        )
      }
    >
      {step === "form" ? (
        <>
          <form onSubmit={onSubmitForm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("auth.name")}</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Oybek Karimjonov" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ilm.uz" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary-soft rounded-full h-11">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("cta.signup")}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-surface px-2 text-muted-foreground">{t("auth.or")}</span></div>
          </div>

          <Button type="button" onClick={onGoogle} variant="outline" disabled={loading} className="w-full h-11">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {t("auth.google")}
          </Button>
        </>
      ) : (
        <form onSubmit={onVerify} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} className="h-12 w-12 text-lg border-border bg-surface-2" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button type="submit" disabled={loading || code.length !== 6} className="w-full bg-primary text-primary-foreground hover:bg-primary-soft rounded-full h-11">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.code.verify")}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            (mock: 123456)
          </p>
        </form>
      )}
    </AuthShell>
  );
}
