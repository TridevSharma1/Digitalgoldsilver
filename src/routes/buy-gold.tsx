import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { BuyMetal } from "@/components/site/BuyMetal";

export const Route = createFileRoute("/buy-gold")({
  head: () => seo("Buy 24K Digital Gold", "Buy 24K 999.9 pure digital gold online by amount or grams."),
  component: Page,
});

function Page() {
  return (
    <BuyMetal metal="Gold" />
  );
}
