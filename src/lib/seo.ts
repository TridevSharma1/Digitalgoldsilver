export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} | Digital Gold And Sale` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | Digital Gold And Sale` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
