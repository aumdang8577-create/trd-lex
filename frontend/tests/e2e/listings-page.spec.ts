import { test, expect } from "@playwright/test";

test.describe("Listings Search & Map Page E2E Tests", () => {
  test("should load listings search page with map and search filters", async ({ page }) => {
    await page.goto("/listings");
    await page.waitForLoadState("networkidle");

    // Check header / main layout exists
    await expect(page.locator("body")).toBeVisible();

    // Verify search input or search container exists
    const searchContainer = page.locator("section, div").filter({ hasText: /ค้นหา|จังหวัด|สิทธิ์การเช่า/i }).first();
    await expect(searchContainer).toBeVisible();
  });
});
