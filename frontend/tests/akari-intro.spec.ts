import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/health/", (route) => route.fulfill({
    json: { status: "ok" },
    headers: { "access-control-allow-origin": "http://127.0.0.1:8081" },
  }));
});

test("intro plays on every reload and replay restores keyboard focus", async ({ page }) => {
  // A marker left by the previous version must not suppress the intro.
  await page.addInitScript(() => sessionStorage.setItem("shinobihub-akari-intro-seen", "1"));
  await page.goto("/");
  const intro = page.getByRole("dialog", { name: "Akari welcome animation" });
  const skip = page.getByRole("button", { name: /Skip intro/ });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(intro).not.toBeVisible();
  await expect(page.locator(".brand")).toBeFocused();
  await page.reload();
  await expect(intro).toBeVisible();
  await page.getByRole("button", { name: /Skip intro/ }).click();
  await page.getByRole("button", { name: "Meu foco", exact: true }).click();
  const replay = page.getByRole("button", { name: /Replay Akari intro/ });
  await replay.click();
  await expect(intro).toBeVisible();
  await page.getByRole("button", { name: /Skip intro/ }).click();
  await expect(replay).toBeFocused();
  await expect(page.locator(".app-shell")).not.toHaveAttribute("inert");
  // Expo's stylesheet already hides body overflow; the intro must restore the
  // previous inline value, rather than override the application's own layout.
  await expect.poll(() => page.locator("body").evaluate((body) => body.style.overflow)).toBe("");
});

test("blocked session storage cannot crash the board or trap the intro", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem"]) {
      Object.defineProperty(Storage.prototype, method, {
        value() { throw new DOMException("Storage blocked", "SecurityError"); },
      });
    }
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Skip intro/ }).click();
  await page.getByRole("button", { name: "Meu foco", exact: true }).click();
  await page.getByRole("button", { name: /Create card/ }).click();
  await expect(page.getByRole("dialog", { name: "Card details" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("reduced motion bypasses the intro and replay animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Início", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Meu foco", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Akari welcome animation" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: /Replay Akari intro/ })).toBeDisabled();
  await expect(page.getByRole("dialog", { name: "Akari welcome animation" })).not.toBeVisible();
  await expect(page.locator(".app-shell")).not.toHaveAttribute("inert");
});

test("motion preference changes dismiss the intro and mobile replay works", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Akari welcome animation" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("dialog", { name: "Akari welcome animation" })).not.toBeVisible();
  await expect(page.locator(".brand")).toBeFocused();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Meu foco", exact: true }).click();
  const replay = page.getByRole("button", { name: "Replay Akari intro", exact: true });
  await replay.click();
  await page.keyboard.press("Escape");
  await expect(replay).toBeFocused();
  await replay.click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("dialog", { name: "Akari welcome animation" })).not.toBeVisible();
  await expect(replay).toBeDisabled();
  await expect(page.locator(".brand")).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
