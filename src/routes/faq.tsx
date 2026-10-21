import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero, Section } from "@/components/site/ui";
import { FaqList } from "@/components/site/sections";

export const Route = createFileRoute("/faq")({
  head: () => seo("FAQ", "Answers to common questions about buying digital gold and silver."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero title="Frequently Asked Questions" desc="Everything you need to know about digital gold and silver." />
      <Section title="Got questions?"><FaqList /></Section>
    </>
  );
}
