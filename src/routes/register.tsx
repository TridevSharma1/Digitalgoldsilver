import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { register } from "@/lib/auth";
import { Field } from "@/components/site/ui";

export const Route = createFileRoute("/register")({
  head: () => seo("Register", "Create your free digital gold and silver account."),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirm: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <form className="card-lux space-y-4 p-8" onSubmit={(e) => {
        e.preventDefault();
        if (f.password !== f.confirm) { toast.error("Passwords do not match"); return; }
        if (!otpSent) { setOtpSent(true); toast.info("OTP sent: 123456 (demo)"); return; }
        if (f.otp !== "123456") { toast.error("Invalid OTP"); return; }
        const err = register(f); if (err) toast.error(err); else nav({ to: "/dashboard" });
      }}>
        <h1 className="text-2xl font-bold">Create <span className="text-gold-gradient">account</span></h1>
        <Field label="Full Name"><input required className="input-lux" value={f.name} onChange={set("name")} /></Field>
        <Field label="Email"><input type="email" required className="input-lux" value={f.email} onChange={set("email")} /></Field>
        <Field label="Phone"><input required className="input-lux" value={f.phone} onChange={set("phone")} /></Field>
        <Field label="Password"><input type="password" required minLength={6} className="input-lux" value={f.password} onChange={set("password")} /></Field>
        <Field label="Confirm Password"><input type="password" required className="input-lux" value={f.confirm} onChange={set("confirm")} /></Field>
        {otpSent && <Field label="OTP"><input required className="input-lux" value={f.otp} onChange={set("otp")} /></Field>}
        <button className="btn-gold w-full">{otpSent ? "Verify & Register" : "Send OTP"}</button>
      </form>
    </div>
  );
}
