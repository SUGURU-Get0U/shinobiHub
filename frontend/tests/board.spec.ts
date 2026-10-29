import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/health/", (route) =>
    route.fulfill({
      json: { status: "ok" },
      headers: { "access-control-allow-origin": "http://127.0.0.1:8081" },
    }),
  );
  await page.goto("/");
});

test("Cancel preserves saved data; Save changes progress and feelings independently", async ({
  page,
}) => {
  await expect(
    page.getByRole("button", { name: "● API connected" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /DEMO-013/ }).click();
  await page.getByLabel("Title *").fill("Discard this title");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Check the training servers" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /DEMO-013/ }).click();
  await page.getByLabel("Title *").fill("Updated training task");
  await page
    .getByLabel("Feeling", { exact: true })
    .selectOption("I'm procrastinating");
  await page.getByRole("button", { name: "Save card" }).click();
  const column = page.getByRole("region", { name: "In progress", exact: true });
  await expect(
    column.getByRole("heading", { name: "Updated training task" }),
  ).toBeVisible();
  await expect(column.getByText("☾ I'm procrastinating")).toBeVisible();
});

test("creation requires a deadline and completed cards stop asking for review", async ({
  page,
}) => {
  await page.getByRole("button", { name: "＋ Create card" }).click();
  await page.getByLabel("Title *").fill("Fictional new task");
  await page.getByRole("button", { name: "Save card" }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "Choose a valid review date and time.",
  );
  await page.getByLabel(/Review deadline/).fill("2020-01-01T10:00");
  await page.getByRole("button", { name: "Save card" }).click();
  const card = page.getByRole("button", { name: /Fictional new task/ });
  await expect(card).toContainText("Review needed");
  await card.click();
  await page.getByLabel("Progress", { exact: true }).selectOption("Done");
  await page.getByRole("button", { name: "Save card" }).click();
  await expect(card).not.toContainText("Review needed");
});

test("customization saves and Escape protects dirty drafts", async ({
  page,
}) => {
  await page.getByRole("button", { name: /DEMO-013/ }).click();
  await page.getByLabel("Priority", { exact: true }).fill("Critical");
  await page.getByLabel("Card size").selectOption("Compact");
  await page.getByLabel("Waiting on", { exact: true }).fill("Fictional team");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Save card" }).click();
  const card = page.getByRole("button", { name: /DEMO-013/ });
  await expect(card).toHaveClass(/compact/);
  await expect(card).toContainText("Critical");
  await expect(card).toContainText("Fictional team");
});

test("API failures are visible and the panel fits a small screen", async ({
  page,
}) => {
  await page.route("**/api/health/", (route) => route.abort());
  await page.getByRole("button", { name: /API connected/ }).click();
  await expect(
    page.getByRole("button", { name: "● API unavailable" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "＋ Create card" }).click();
  const box = await page.getByRole("dialog").boundingBox();
  expect(box!.width).toBeLessThanOrEqual(390);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
});
