import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/health/", (route) =>
    route.fulfill({
      json: { status: "ok" },
      headers: { "access-control-allow-origin": "http://127.0.0.1:8081" },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: /Skip intro/ }).click();
  await page.getByRole("button", { name: "Meu foco", exact: true }).click();
});

test("Akari intro reveals the board and can be replayed", async ({ page }) => {
  await expect(page.getByRole("dialog", { name: "Akari welcome animation" })).not.toBeVisible();
  await page.getByRole("button", { name: /Replay Akari intro/ }).click();
  await expect(page.getByRole("dialog", { name: "Akari welcome animation" })).toBeVisible();
  // inert prevents interaction; it does not change the board's CSS visibility.
  await expect(page.locator(".app-shell")).toHaveAttribute("inert", "");
  await expect(page.getByRole("dialog", { name: "Akari welcome animation" })).not.toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("button", { name: /DEMO-013/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Replay Akari intro/ })).toBeFocused();
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
    .getByRole("combobox", { name: "Feeling", exact: true })
    .selectOption("I'm procrastinating");
  await page.getByRole("button", { name: "Save card" }).click();
  const column = page.getByRole("region", { name: "In progress", exact: true });
  await expect(
    column.getByRole("heading", { name: "Updated training task" }),
  ).toBeVisible();
  await expect(column.getByText("☾ I'm procrastinating")).toBeVisible();
  await page.getByRole("button", { name: /DEMO-013/ }).click();
  await page.getByRole("combobox", { name: "Progress", exact: true }).selectOption("Blocked");
  await page.getByRole("button", { name: "Save card" }).click();
  const blocked = page.getByRole("region", { name: "Blocked", exact: true });
  await expect(blocked.getByRole("heading", { name: "Updated training task" })).toBeVisible();
  await expect(blocked.getByText("☾ I'm procrastinating")).toBeVisible();
});

test("creation requires a deadline and completed cards stop asking for review", async ({
  page,
}) => {
  await page.getByRole("button", { name: "＋ Create card" }).click();
  await page.getByRole("button", { name: "Save card" }).click();
  await expect(page.getByRole("alert")).toHaveText("Give your card a title.");
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
  await page.getByRole("combobox", { name: "Progress", exact: true }).selectOption("Done");
  await page.getByRole("button", { name: "Save card" }).click();
  await expect(card).not.toContainText("Review needed");
});

test("customization saves and Escape protects dirty drafts", async ({
  page,
}) => {
  await page.getByRole("button", { name: /DEMO-013/ }).click();
  await page.getByRole("combobox", { name: "Priority", exact: true }).fill("Critical");
  await page.getByLabel("Card size").selectOption("Compact");
  await page.getByLabel("Waiting on", { exact: true }).fill("Fictional team");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("textbox", { name: "Description", exact: true }).fill("Updated fictional description");
  await page.getByLabel("Ticket / task reference").fill("DEMO-UPDATED");
  await page.getByLabel("Planned for").selectOption("This week");
  await page.getByLabel("What do you need from them?").fill("A fictional confirmation");
  await page.getByLabel("Card accent / background").fill("#123456");
  await page.getByLabel(/Review deadline/).fill("2030-01-02T10:30");
  await page.getByRole("button", { name: "Save card" }).click();
  const card = page.getByRole("button", { name: /DEMO-UPDATED/ });
  await expect(card).toHaveClass(/compact/);
  await expect(card).toContainText("Critical");
  await expect(card).toContainText("Fictional team");
  await expect(card).toContainText("This week");
  await expect(card).not.toContainText("Review needed");
  await card.click();
  await expect(page.getByRole("textbox", { name: "Description", exact: true })).toHaveValue("Updated fictional description");
  await expect(page.getByLabel("What do you need from them?")).toHaveValue("A fictional confirmation");
  await expect(page.getByLabel("Card accent / background")).toHaveValue("#123456");
  await expect(page.getByLabel(/Review deadline/)).toHaveValue("2030-01-02T10:30");
});

test("API failures are visible and the panel fits a small screen", async ({
  page,
}) => {
  await expect(page.getByRole("button", { name: "● API connected" })).toBeVisible();
  await page.route("**/api/health/", (route) => route.abort());
  await page.getByRole("button", { name: /API connected/ }).click();
  await expect(
    page.getByRole("button", { name: "● API unavailable" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".akari-aura")).toHaveCSS("animation-name", "none");
  const card = page.getByRole("button", { name: /DEMO-013/ });
  await card.hover();
  await expect(card).toHaveCSS("transform", "none");
  await expect(card).toHaveCSS("transition-duration", "0s");
  await page.getByRole("button", { name: "＋ Create card" }).click();
  const box = await page.getByRole("dialog").boundingBox();
  expect(box!.width).toBeLessThanOrEqual(390);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
});

test("keyboard opens cards, traps panel focus, and restores focus after closing", async ({ page }) => {
  const card = page.getByRole("button", { name: /DEMO-013/ });
  await card.focus();
  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "Close details" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Title *")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  // Native dialog focus may wrap to the dialog itself, rather than its last button.
  await expect.poll(() => page.getByRole("dialog").evaluate((panel) =>
    panel === document.activeElement || panel.contains(document.activeElement),
  )).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(card).toBeFocused();

  await page.keyboard.press("Enter");
  await page.getByLabel("Title *").fill("Unsaved title");
  page.once("dialog", (dialog) => dialog.accept());
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(card).toBeFocused();
  await expect(card).toContainText("Check the training servers");
});
