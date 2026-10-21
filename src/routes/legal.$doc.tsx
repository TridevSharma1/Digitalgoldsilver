import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero } from "@/components/site/ui";

const docs: Record<string, string> = { privacy: "Privacy Policy", terms: "Terms & Conditions", refund: "Refund Policy", disclaimer: "Disclaimer" };
export const Route = createFileRoute("/legal/$doc")({
  head: ({ params }) => seo(docs[params.doc] ?? "Legal", "Legal information for Digital Gold And Sale."),
  component: Page,
});
function Page() {
  const { doc } = Route.useParams();
  return (<><PageHero title={docs[doc] ?? "Legal"} /><div className="mx-auto max-w-3xl space-y-4 px-4 py-16 text-muted-foreground"><p>This {docs[doc] ?? "document"} explains how Digital Gold And Sale operates its digital gold and silver services. Investments in precious metals are subject to market risk.</p><p>For questions, contact kranjalfoundation@gmail.com.</p></div></>);
}
