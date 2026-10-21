import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for every public and admin route instead of not found", () => {
    for (const path of [
      "/", "/about", "/buy-gold", "/buy-silver", "/calculator", "/plans", "/pricing", "/news",
      "/faq", "/contact", "/login", "/register", "/dashboard", "/wallet", "/transactions",
      "/profile", "/legal/terms",
      "/admin/login", "/admin/dashboard", "/admin/users", "/admin/kyc", "/admin/transactions",
      "/admin/orders", "/admin/wallet", "/admin/messages", "/admin/content", "/admin/settings",
    ]) {
      const matches = router.matchRoutes(path);
      expect(matches.at(-1)?.routeId, path).not.toBe(rootRouteId);
    }
  });
});
