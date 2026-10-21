import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero, Section } from "@/components/site/ui";
import { NewsGrid } from "@/components/site/sections";

export const Route = createFileRoute("/news")({
  head: () => seo("Gold & Silver News", "Latest gold market updates, silver news and investment articles."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero title="Market News" desc="Gold market updates, silver news and investment insights." />
      <Section title="Latest articles"><NewsGrid /></Section>
    </>
  );
}
