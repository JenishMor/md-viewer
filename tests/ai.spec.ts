import { test, expect, type Page, type Route } from "@playwright/test";
import { setMarkdown, switchToVisual, waitForPageReady } from "./helpers";

// The model is always mocked: tests never spend Gemini quota.
async function mockAi(page: Page, reply: (body: { action: string; text: string }) => Parameters<Route["fulfill"]>[0]) {
  const requests: { action: string; text: string }[] = [];
  await page.route("**/api/ai", async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);
    await route.fulfill(reply(body));
  });
  return requests;
}

const ok = (text: string) => ({ status: 200, contentType: "text/plain; charset=utf-8", headers: { "X-AI-Remaining": "9" }, body: text });

async function selectInSource(page: Page, phrase: string) {
  await page.locator("textarea").first().evaluate((el: HTMLTextAreaElement, p) => {
    const start = el.value.indexOf(p);
    el.focus();
    el.setSelectionRange(start, start + p.length);
  }, phrase);
}

async function openAi(page: Page, { consent = true } = {}) {
  await page.getByRole("button", { name: "AI assist" }).click();
  if (consent) await page.getByRole("button", { name: "I understand, continue" }).click();
  return page.getByRole("dialog", { name: "AI assist" });
}

test.describe("AI assist", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
  });

  test("asks for consent once and sends nothing until an action is chosen", async ({ page }) => {
    const requests = await mockAi(page, () => ok("unused"));
    await page.getByRole("button", { name: "AI assist" }).click();
    const consent = page.getByRole("dialog", { name: "Before you use AI" });
    await expect(consent).toContainText("Nothing is sent until you click an action");
    await expect(consent).toContainText("free tier");
    await page.getByRole("button", { name: "Not now" }).click();
    await expect(consent).toBeHidden();

    const dialog = await openAi(page);
    await expect(dialog).toContainText("the whole document");
    await dialog.getByRole("button", { name: "Close", exact: true }).first().click();

    // Consent is remembered.
    await page.getByRole("button", { name: "AI assist" }).click();
    await expect(page.getByRole("dialog", { name: "AI assist" })).toBeVisible();
    expect(requests).toHaveLength(0);
  });

  test("improves a selection and replaces only that text, undoably", async ({ page }) => {
    await setMarkdown(page, "# Notes\n\nthis sentense has erors.\n\nKeep this line.");
    const requests = await mockAi(page, () => ok("This sentence has errors."));
    await selectInSource(page, "this sentense has erors.");

    const dialog = await openAi(page);
    await expect(dialog).toContainText("the selected text (4 words)");
    await dialog.getByRole("button", { name: /Fix spelling & grammar/ }).click();
    await expect(dialog.getByTestId("ai-result")).toHaveText("This sentence has errors.");
    expect(requests).toEqual([{ action: "grammar", text: "this sentense has erors." }]);

    await dialog.getByRole("button", { name: "Replace selection" }).click();
    const editor = page.locator("textarea").first();
    await expect(editor).toHaveValue("# Notes\n\nThis sentence has errors.\n\nKeep this line.");

    await editor.focus();
    await page.keyboard.press("ControlOrMeta+z");
    await expect(editor).toHaveValue("# Notes\n\nthis sentense has erors.\n\nKeep this line.");
  });

  test("explains without editing, inserts below and reuses a saved result", async ({ page }) => {
    await setMarkdown(page, "Idempotent requests can be retried safely.");
    const requests = await mockAi(page, () => ok("**Idempotent** means repeating it has the same effect."));

    const dialog = await openAi(page);
    await dialog.getByRole("button", { name: /^Explain/ }).click();
    await expect(dialog.getByTestId("ai-result").locator("strong")).toHaveText("Idempotent");
    await expect(dialog.getByRole("button", { name: /Replace/ })).toHaveCount(0);

    // Running the same action again uses the saved answer.
    await dialog.getByRole("button", { name: "Back" }).click();
    await dialog.getByRole("button", { name: /^Explain/ }).click();
    await expect(dialog).toContainText("saved result, no new request");
    expect(requests).toHaveLength(1);

    await dialog.getByRole("button", { name: "Insert below" }).click();
    await expect(page.locator("textarea").first()).toHaveValue(
      "Idempotent requests can be retried safely.\n\n**Idempotent** means repeating it has the same effect.\n",
    );
  });

  test("Retry sends a fresh request", async ({ page }) => {
    await setMarkdown(page, "rough notes");
    let n = 0;
    const requests = await mockAi(page, () => ok(`# Version ${++n}`));
    const dialog = await openAi(page);
    await dialog.getByRole("button", { name: /Format as Markdown/ }).click();
    await expect(dialog.getByTestId("ai-result")).toHaveText("# Version 1");
    await dialog.getByRole("button", { name: "Retry" }).click();
    await expect(dialog.getByTestId("ai-result")).toHaveText("# Version 2");
    expect(requests).toHaveLength(2);
  });

  test("strips a code fence wrapped around the whole answer", async ({ page }) => {
    await setMarkdown(page, "a list: milk, eggs");
    await mockAi(page, () => ok("```markdown\n- milk\n- eggs\n```"));
    const dialog = await openAi(page);
    await dialog.getByRole("button", { name: /Format as Markdown/ }).click();
    await expect(dialog.getByTestId("ai-result")).toHaveText("- milk\n- eggs");
  });

  test("explains when the daily allowance is used up", async ({ page }) => {
    await setMarkdown(page, "Some text");
    await mockAi(page, () => ({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({
        error: { code: "quota_exhausted", message: "MDViewer's free AI allowance for today has been used up.", resetsAt: new Date(Date.now() + 3600_000).toISOString() },
      }),
    }));
    const dialog = await openAi(page);
    await dialog.getByRole("button", { name: /Make shorter/ }).click();
    await expect(dialog.getByRole("alert")).toContainText("allowance for today has been used up");
    await expect(dialog.getByRole("alert")).toContainText("Everything else keeps working");
    await expect(page.locator("textarea").first()).toHaveValue("Some text");
  });

  test("does not apply a result if the document changed meanwhile", async ({ page }) => {
    await setMarkdown(page, "Original text");
    await mockAi(page, () => ok("Better text"));
    const dialog = await openAi(page);
    await dialog.getByRole("button", { name: /Improve writing/ }).click();
    await expect(dialog.getByTestId("ai-result")).toHaveText("Better text");
    // Simulate an edit made elsewhere (for example another tab or an undo).
    await page.evaluate(() => {
      const ta = document.querySelector("textarea")!;
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!;
      setter.call(ta, "Changed text");
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await dialog.getByRole("button", { name: "Replace document" }).click();
    await expect(dialog.getByRole("status")).toContainText("The document changed");
    await expect(page.locator("textarea").first()).toHaveValue("Changed text");
  });

  test("runs from the command palette", async ({ page }) => {
    await setMarkdown(page, "Make me shorter please, thank you very much.");
    const requests = await mockAi(page, () => ok("Shorter, please."));
    await page.getByRole("button", { name: "AI assist" }).click();
    await page.getByRole("button", { name: "I understand, continue" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Close", exact: true }).first().click();

    await page.keyboard.press("ControlOrMeta+p");
    await page.getByPlaceholder(/command/i).fill("AI: Make shorter");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("ai-result")).toHaveText("Shorter, please.");
    expect(requests[0].action).toBe("shorten");
  });

  test("replaces a selection in visual mode", async ({ page }) => {
    await setMarkdown(page, "# Title\n\nfirst paragrph here\n\nSecond paragraph.");
    await mockAi(page, () => ok("First paragraph here."));
    await switchToVisual(page);
    await page.locator(".ProseMirror p", { hasText: "first paragrph here" }).click({ clickCount: 3 });

    const dialog = await openAi(page);
    await expect(dialog).toContainText("the selected text");
    await dialog.getByRole("button", { name: /Fix spelling & grammar/ }).click();
    await dialog.getByRole("button", { name: "Replace selection" }).click();
    await expect(page.locator(".ProseMirror")).toContainText("First paragraph here.");
    await expect(page.locator(".ProseMirror")).toContainText("Second paragraph.");
    await expect(page.locator(".ProseMirror")).not.toContainText("paragrph");
  });
});

test.describe("AI tip", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("introduces AI once and stays dismissed after Got it", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
    const tip = page.getByRole("dialog", { name: "New: AI assist" });
    await expect(tip).toBeVisible();
    await expect(tip).toContainText("Nothing is sent until you choose an action");
    await expect(page.getByRole("button", { name: "AI assist", exact: true })).toHaveAttribute("aria-describedby", "ai-tip-body");

    // The tip stays on screen, even on narrow viewports.
    const box = (await tip.boundingBox())!;
    const width = page.viewportSize()!.width;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);

    await tip.getByRole("button", { name: "Got it" }).click();
    await expect(tip).toBeHidden();
    await page.reload();
    await waitForPageReady(page);
    await page.waitForTimeout(1500);
    await expect(tip).toBeHidden();
  });

  test("opening AI also dismisses the tip", async ({ page }) => {
    await page.goto("/");
    await waitForPageReady(page);
    const tip = page.getByRole("dialog", { name: "New: AI assist" });
    await expect(tip).toBeVisible();
    await page.getByRole("button", { name: "AI assist", exact: true }).click();
    await expect(tip).toBeHidden();
    await expect(page.getByRole("dialog", { name: "Before you use AI" })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("md-viewer-ai-tip-dismissed"))).toBe("1");
  });
});

test.describe("AI API", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "browser-independent checks run once");
  });

  let origin: { Origin: string };
  test.beforeEach(({ baseURL }) => {
    origin = { Origin: new URL(baseURL!).origin };
  });

  test("rejects cross-site and malformed requests before calling Gemini", async ({ request }) => {
    expect((await request.post("/api/ai", { data: { action: "improve", text: "hi" } })).status()).toBe(403);
    expect(
      (await request.post("/api/ai", { headers: { Origin: "https://evil.example" }, data: { action: "improve", text: "hi" } })).status(),
    ).toBe(403);

    const bad = await request.post("/api/ai", { headers: origin, data: { action: "write-my-essay", text: "hi" } });
    expect(bad.status()).toBe(400);
    expect((await bad.json()).error.code).toBe("bad_request");

    const empty = await request.post("/api/ai", { headers: origin, data: { action: "improve", text: "   " } });
    expect(empty.status()).toBe(400);

    const large = await request.post("/api/ai", { headers: origin, data: { action: "improve", text: "x".repeat(60_001) } });
    expect(large.status()).toBe(413);
  });

  test("free tier is not offered in the EEA, UK or Switzerland", async ({ request }) => {
    const res = await request.post("/api/ai", {
      headers: { ...origin, "x-vercel-ip-country": "DE" },
      data: { action: "improve", text: "hi" },
    });
    expect(res.status()).toBe(451);
    expect((await res.json()).error.code).toBe("region_unavailable");
  });
});
