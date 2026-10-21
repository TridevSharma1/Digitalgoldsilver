import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero, Section } from "@/components/site/ui";
import { ContactBlock } from "@/components/site/sections";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact Us", "Contact Digital Gold And Sale in Pune by phone, email or message."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero title="Contact Us" desc="We are here to help, 24/7." />
      <Section title="Get in touch"><ContactBlock /></Section>
    </>
  );
}
