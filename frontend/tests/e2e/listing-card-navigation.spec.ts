import { test, expect } from "@playwright/test";

test.describe("Listing Card to Detail Page E2E Flow", () => {
  test("click on Card #1 -> navigate to Detail page -> verify Title & Province match Card data", async ({ page }) => {
    // 1. Open homepage
    await page.goto("/");

    // 2. Locate the first recommended property card link
    const firstCardLink = page.locator("a[href*='/listings/list-1']").first();
    await expect(firstCardLink).toBeVisible();

    // 3. Extract expected text (e.g. Province / District) from card before clicking
    const cardText = await firstCardLink.textContent();
    expect(cardText).toBeTruthy();
    const expectedProvince = "อุดรธานี";
    const expectedDistrict = "เมืองอุดรธานี";

    // 4. Click Card #1 and wait for navigation
    await Promise.all([
      page.waitForURL(/\/listings\/list-1/),
      firstCardLink.click(),
    ]);

    // 5. Verify Detail Page loaded successfully without crash
    await page.waitForLoadState("networkidle");
    await expect(page.url()).toContain("/listings/list-1");

    // 6. Assert that Title, Province, and District on Detail Page match Card #1
    const pageContent = page.locator("main, body");
    await expect(pageContent).toContainText(expectedProvince);
    await expect(pageContent).toContainText(expectedDistrict);
    await expect(pageContent).toContainText("TRD-66-001");
  });
});
