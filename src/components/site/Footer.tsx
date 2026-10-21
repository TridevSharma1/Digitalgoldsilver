import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { Logo } from "./Header";

export function Footer() {
  const [s] = useStore("settings");
  const [email, setEmail] = useState("");
  return (
    <footer className="relative mt-24 border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground">{s.footer}</p>
          <div className="flex gap-3">
            {[
              [Facebook, s.social.facebook, "Facebook"],
              [Instagram, s.social.instagram, "Instagram"],
              [Twitter, s.social.twitter, "Twitter"],
              [Youtube, s.social.youtube, "YouTube"],
            ].map(([Icon, href, label]) => {
              const I = Icon as typeof Facebook;
              return (
                <a key={label as string} href={href as string} aria-label={label as string} className="grid h-9 w-9 place-items-center rounded-full border transition hover:border-primary hover:text-primary">
                  <I className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-semibold">Quick Links</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {([["/about","About"],["/pricing","Pricing"],["/buy-gold","Buy Gold"],["/buy-silver","Buy Silver"],["/plans","Plans"],["/calculator","Calculator"],["/news","News"],["/faq","FAQ"]] as const).map(([to, l]) => (
              <li key={to}><Link to={to} className="hover:text-primary">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold">Contact</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" />{s.address}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 text-primary" /><a href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 text-primary" /><a href={`mailto:${s.email}`} className="break-all">{s.email}</a></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold">Newsletter</h3>
          <p className="mb-3 text-sm text-muted-foreground">Daily gold & silver rates in your inbox.</p>
          <form
            className="flex gap-2"
            onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed!"); setEmail(""); }}
          >
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" aria-label="Email" className="input-lux" />
            <button className="btn-gold px-4">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} {s.businessName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {(["privacy", "terms", "refund", "disclaimer"] as const).map((d) => (
              <Link key={d} to="/legal/$doc" params={{ doc: d }} className="capitalize hover:text-primary">
                {d === "privacy" ? "Privacy Policy" : d === "refund" ? "Refund Policy" : d}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Link to="/admin/login" className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs font-semibold text-primary shadow-gold transition hover:scale-105">
        <ShieldCheck className="h-4 w-4" /> Admin Panel
      </Link>
    </footer>
  );
}
