import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Gem, Sparkles, ShieldCheck, Zap, Activity, Wallet, PackageOpen, BadgeCheck, UserPlus, FileCheck, PlusCircle, ShoppingCart, LineChart, Gift, Lock, Headphones, BadgePercent, ArrowDownUp } from "lucide-react";
import { seo } from "@/lib/seo";
import { Section } from "@/components/site/ui";
import { HeroSlider, LivePrices, Calculator, PlansGrid, Testimonials, NewsGrid, FaqList, ContactBlock } from "@/components/site/sections";

export const Route = createFileRoute("/")({
  head: () => seo("Buy 24K Digital Gold & 999 Silver Online", "Invest in 24K digital gold and pure silver securely from anywhere in India. Live prices, insured vaults and instant redemption."),
  component: Home,
});

const features = [
  [Gem, "24K Pure Gold", "999.9 certified purity"],
  [Sparkles, "999 Fine Silver", "Investment-grade silver"],
  [ShieldCheck, "100% Secure", "Bank-grade encryption"],
  [Zap, "Instant Purchase", "Buy in seconds"],
  [Activity, "Live Pricing", "Real-time market rates"],
  [Wallet, "Digital Wallet", "Add & withdraw anytime"],
  [PackageOpen, "Easy Redemption", "Coins at your door"],
  [BadgeCheck, "Trusted Platform", "50,000+ investors"],
] as const;

const steps = [[UserPlus, "Register"], [FileCheck, "Complete KYC"], [PlusCircle, "Add Wallet Balance"], [ShoppingCart, "Buy Gold/Silver"], [LineChart, "Track Portfolio"], [Gift, "Redeem Anytime"]] as const;

const why = [[Lock, "Secure Storage"], [BadgeCheck, "Trusted Platform"], [Headphones, "24/7 Support"], [BadgePercent, "Lowest Charges"], [Zap, "Instant Buy"], [ArrowDownUp, "Instant Sell"], [Gift, "Redeem Anytime"]] as const;

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1500, 1);
        setN(Math.round(to * p));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n.toLocaleString("en-IN")}{suffix}</span>;
}

function Home() {
  return (
    <>
      <HeroSlider />

      <div className="mx-auto -mt-14 max-w-6xl px-4 relative z-10">
        <div className="glass grid grid-cols-2 gap-6 rounded-2xl p-6 text-center md:grid-cols-4">
          {[[50000, "+", "Happy investors"], [1200, " kg", "Metal in vaults"], [99, ".9%", "Purity"], [24, "/7", "Support"]].map(([v, s, l]) => (
            <div key={l as string}>
              <p className="font-display text-2xl font-bold text-gold-gradient md:text-3xl"><Counter to={v as number} suffix={s as string} /></p>
              <p className="text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <Section eyebrow="Features" title="Precious metals, reimagined">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {features.map(([I, t, d]) => (
            <div key={t} className="card-lux card-hover p-6">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary"><I className="h-6 w-6" /></span>
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Live Rates" title="Today's gold & silver prices" desc="Prices per gram, inclusive of making. GST extra.">
        <LivePrices />
      </Section>

      <Section eyebrow="How it works" title="Start investing in 6 simple steps">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {steps.map(([I, t], k) => (
            <li key={t} className="card-lux card-hover relative p-6 text-center">
              <span className="absolute right-4 top-3 font-display text-3xl font-bold text-muted">{k + 1}</span>
              <I className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-4 font-semibold">{t}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Calculator" title="See how much you get">
        <Calculator />
      </Section>

      <Section eyebrow="Plans" title="Popular investment plans">
        <PlansGrid />
      </Section>

      <Section eyebrow="Why us" title="Why choose Digital Gold And Sale">
        <div className="flex flex-wrap justify-center gap-4">
          {why.map(([I, t]) => (
            <div key={t} className="card-lux card-hover flex items-center gap-3 px-6 py-4">
              <I className="h-5 w-5 text-primary" /><span className="font-semibold">{t}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Testimonials" title="Loved by investors across India">
        <Testimonials />
      </Section>

      <Section eyebrow="Insights" title="Latest news">
        <NewsGrid limit={3} />
        <div className="mt-8 text-center"><Link to="/news" className="btn-outline">All News</Link></div>
      </Section>

      <Section eyebrow="FAQ" title="Frequently asked questions">
        <FaqList limit={5} />
      </Section>

      <Section eyebrow="Contact" title="Talk to our team">
        <ContactBlock />
      </Section>
    </>
  );
}
