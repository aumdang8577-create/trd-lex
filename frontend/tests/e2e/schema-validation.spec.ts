import { test, expect } from "@playwright/test";
import { safeParseListing, safeParseListings } from "../../src/lib/schemas";

test.describe("Data Schema Validation (Zod) Tests", () => {
  test("should parse valid listing payload correctly", () => {
    const rawListing = {
      id: "list-test-1",
      sellerId: "seller-1",
      seller: { id: "seller-1", thaid_id: "1234567890123", first_name: "ทดสอบ", last_name: "ระบบ", role: "USER" },
      contractId: "contract-1",
      contract: {
        id: "contract-1",
        contract_number: "TRD-99-999",
        parcel_number: "ทส.001",
        location_lat: 13.75,
        location_lng: 100.50,
        province: "กรุงเทพมหานคร",
        district: "พระนคร",
        sub_district: "พระบรมมหาราชวัง",
        land_area_sqw: 100,
        is_active: true,
      },
      asking_price: 1000000,
      estimated_fee: 30000,
      description: "ทดสอบ Schema",
      image_urls: [],
      status: "ACTIVE",
      createdAt: "2026-07-25T00:00:00Z",
      updatedAt: "2026-07-25T00:00:00Z",
    };

    const parsed = safeParseListing(rawListing);
    expect(parsed).not.toBeNull();
    expect(parsed?.id).toBe("list-test-1");
    expect(parsed?.contract.province).toBe("กรุงเทพมหานคร");
  });

  test("should handle missing or corrupt API fields gracefully without crashing", () => {
    const corruptListing = {
      id: "list-corrupt-1",
      // missing seller, missing contract fields, bad price string
      asking_price: "INVALID_PRICE_NUM",
    };

    const parsed = safeParseListing(corruptListing);
    expect(parsed).not.toBeNull();
    expect(parsed?.id).toBe("list-corrupt-1");
    expect(parsed?.contract.province).toBe("ไม่ระบุ"); // Fallback applied
    expect(parsed?.seller.first_name).toBe("ไม่ระบุ"); // Fallback applied
    expect(parsed?.asking_price).toBe(0); // Coerced safely
  });

  test("should handle corrupted array payloads in safeParseListings", () => {
    const corruptPayload = {
      data: [
        { id: "list-1", asking_price: 500000 },
        { id: null }, // totally invalid
      ],
    };

    const parsedList = safeParseListings(corruptPayload);
    expect(Array.isArray(parsedList)).toBe(true);
    expect(parsedList.length).toBeGreaterThan(0);
    expect(parsedList[0].id).toBe("list-1");
  });
});
