import { createFileRoute } from "@tanstack/react-router";

// Sitemap route — empty component since sitemap.xml is not used in desktop app
export const Route = createFileRoute("/sitemap.xml")({
  component: () => null,
});
