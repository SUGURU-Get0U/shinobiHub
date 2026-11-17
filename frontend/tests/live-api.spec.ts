import { expect, test } from "@playwright/test";

test("exported board connects to the running Django API", async ({ page }) => {
  test.skip(!process.env.SHINOBI_LIVE_API, "Set SHINOBI_LIVE_API=1 with Django running on localhost:8000.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  // No request interception: this verifies the real response and browser CORS.
  const response = page.waitForResponse("http://localhost:8000/api/health/");
  await page.goto("/");
  const health = await response;
  expect(health.status()).toBe(200);
  expect(await health.json()).toEqual({ status: "ok" });
  expect(health.headers()["access-control-allow-origin"]).toBe("http://127.0.0.1:8081");
  await page.getByRole("button", { name: "Meu foco", exact: true }).click();
  await expect(page.getByRole("button", { name: "● API connected" })).toBeVisible();
});
