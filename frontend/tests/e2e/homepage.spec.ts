import { test, expect } from "@playwright/test";

test.describe("Homepage E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load homepage and display header & hero section", async ({ page }) => {
    await expect(page).toHaveTitle(/TRD-LEX|ธนารักษ์/i);
    const heading = page.getByText("รายการแนะนำสิทธิการเช่า");
    await expect(heading).toBeVisible();
  });

  test("should display recommended listing cards with province and district info", async ({ page }) => {
    const propertyCards = page.locator("[data-testid='property-card'], a[href*='/listings/']");
    const count = await propertyCards.count();
    expect(count).toBeGreaterThan(0);

    // Verify first property card displays province text
    const firstCard = propertyCards.first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard).toContainText(/อุดรธานี|กรุงเทพ|ขอนแก่น|เชียงใหม่|หนองคาย/);
  });
});
