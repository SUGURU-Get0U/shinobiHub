import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/health/", (route) => route.fulfill({
    json: { status: "ok" },
    headers: { "access-control-allow-origin": "http://127.0.0.1:8081" },
  }));
});

test("Figma welcome assets and layout match the desktop frame", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { name: "ようこそ" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Início", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("button", { name: /DEMO-013/ })).toHaveCount(0);
  for (const name of ["Projetos", "Estudos", "Caderno"]) {
    await expect(page.getByRole("button", { name, exact: true })).toBeDisabled();
  }

  for (const selector of [".welcome-moon", ".welcome-akari"]) {
    const image = page.locator(selector);
    await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const source = await image.getAttribute("src");
    expect(source).not.toContain("figma.com");
    expect(source).toContain("figma-welcome-");
  }

  const sidebar = await page.locator(".workshop-sidebar").boundingBox();
  expect(sidebar?.width).toBe(248);
  const moon = await page.locator(".welcome-moon").boundingBox();
  expect(moon).toMatchObject({ x: 798, y: 95, width: 630, height: 630 });
  const figure = await page.locator(".welcome-akari-frame").boundingBox();
  expect(figure?.x).toBeCloseTo(431, 0);
  expect(figure?.y).toBe(135);
  expect(figure?.width).toBeCloseTo(1070.977, 0);
  expect(figure?.height).toBe(717);
  await expect(page.locator(".welcome-akari")).toHaveCSS("object-fit", "contain");
});

test("mobile navigation opens the working board and preserves edits when returning home", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ようこそ" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole("button", { name: "Meu foco", exact: true }).click();
  await page.getByRole("button", { name: /DEMO-013/ }).click();
  await page.getByLabel("Title *").fill("Saved focus task");
  await page.getByRole("button", { name: "Save card" }).click();
  await page.getByRole("button", { name: "Início", exact: true }).click();
  await expect(page.getByRole("heading", { name: "ようこそ" })).toBeVisible();
  await page.getByRole("button", { name: "Meu foco", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Saved focus task" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
