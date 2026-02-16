import { describe, it, expect } from "vitest";
import { DEFAULTS, filterConfigs, columns, buildQueryParams } from "./helper";

describe("ProductOwner list helper", () => {
  describe("DEFAULTS", () => {
    it("has expected default values", () => {
      expect(DEFAULTS.page).toBe(1);
      expect(DEFAULTS.limit).toBe(10);
      expect(DEFAULTS.sortBy).toBe("name");
      expect(DEFAULTS.sortOrder).toBe("asc");
      expect(DEFAULTS.name).toBe("");
      expect(DEFAULTS.email).toBe("");
    });
  });

  describe("filterConfigs", () => {
    it("includes email filter", () => {
      const keys = filterConfigs.map((f) => f.key);
      expect(keys).toContain("email");
    });

    it("email filter is a text filter", () => {
      const emailFilter = filterConfigs.find((f) => f.key === "email");
      expect(emailFilter?.type).toBe("text");
    });
  });

  describe("columns", () => {
    it("defines name, email, phone columns", () => {
      const ids = columns.map((c) => c.id);
      expect(ids).toEqual(["name", "email", "phone"]);
    });

    it("phone column renders dash when empty", () => {
      const phoneCol = columns.find((c) => c.id === "phone");
      const row = {
        id: "o1",
        name: "Jane",
        email: "j@test.com",
        phone: "",
      };
      expect(phoneCol?.render?.(row)).toBe("-");
    });

    it("phone column renders phone when present", () => {
      const phoneCol = columns.find((c) => c.id === "phone");
      const row = {
        id: "o1",
        name: "Jane",
        email: "j@test.com",
        phone: "555-1234",
      };
      expect(phoneCol?.render?.(row)).toBe("555-1234");
    });
  });

  describe("buildQueryParams", () => {
    it("includes only non-empty filter values", () => {
      const result = buildQueryParams({ ...DEFAULTS });
      expect(result).not.toHaveProperty("name");
      expect(result).not.toHaveProperty("email");
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });
});
  