import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForPageReady } from "./helpers";

/**
 * Accessibility tests use axe-core to surface WCAG violations. We enforce
 * a hard pass on critical/serious violations in both light and dark mode.
 *
 * If a new genuine a11y issue is introduced, fix it. Don't downgrade these
 * assertions to warn-only just to make CI green.
 */

type ViolationLike = {
  id: string;
  impact?: string | null;
  nodes?: { target?: unknown; html?: string }[];
};

function critical<T extends ViolationLike>(violations: T[]) {
  return violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
}

function describe(violations: ViolationLike[]) {
  return violations.map((v) => ({
    id: v.id,
    nodes: (v.nodes ?? []).map((n) => ({
      target: n.target,
      html: n.html?.slice(0, 120),
    })),
  }));
}

test.describe("Accessibility", () => {
  test("home page should have no critical/serious axe violations", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForPageReady(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const violations = critical(results.violations);
    if (violations.length > 0) {
      console.warn(
        "home – critical a11y violations:",
        JSON.stringify(describe(violations), null, 2),
      );
    }
    expect(violations).toEqual([]);

    // Sanity check: page exposes a top-level heading.
    expect(await page.locator("h1").count()).toBeGreaterThan(0);
  });

  test("editor should be reachable and usable via keyboard", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForPageReady(page);

    const editor = page.locator("textarea");
    await editor.focus();
    await editor.clear();
    await page.keyboard.type("# Keyboard Test");

    await expect(editor).toHaveValue("# Keyboard Test");
  });

  test("dark mode should have no critical/serious axe violations", async ({
    page,
  }) => {
    // Apply dark color scheme before navigation so next-themes picks it up
    // on the very first render.
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await waitForPageReady(page);
    await page.waitForSelector("html.dark", { timeout: 5000 });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const violations = critical(results.violations);
    if (violations.length > 0) {
      console.warn(
        "dark mode – critical a11y violations:",
        JSON.stringify(describe(violations), null, 2),
      );
    }
    expect(violations).toEqual([]);
  });
});
