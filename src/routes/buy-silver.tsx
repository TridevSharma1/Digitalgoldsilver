import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { BuyMetal } from "@/components/site/BuyMetal";

export const Route = createFileRoute("/buy-silver")({
  head: () => seo("Buy 999 Silver", "Buy 999 fine digital silver online by amount or grams."),
  component: Page,
});

function Page() {
  return (
    <BuyMetal metal="Silver" />
  );
}
