import { describe, it, expect } from "vitest";
import {
  DEFAULTS,
  SORT_OPTIONS,
  filterConfigs,
  columns,
  buildQueryParams,
} from "./helper";

describe("Product list helper", () => {
  describe("DEFAULTS", () => {
    it("has expected default values", () => {
      expect(DEFAULTS.page).toBe(1);
      expect(DEFAULTS.limit).toBe(10);
      expect(DEFAULTS.sortBy).toBe("name");
      expect(DEFAULTS.sortOrder).toBe("asc");
      expect(DEFAULTS.name).toBe("");
      expect(DEFAULTS.sku).toBe("");
      expect(DEFAULTS.status).toBe("");
    });
  });

  describe("SORT_OPTIONS", () => {
    it("contains name, sku, price, inventory, status", () => {
      const values = SORT_OPTIONS.map((o) => o.value);
      expect(values).toContain("name");
      expect(values).toContain("sku");
      expect(values).toContain("price");
      expect(values).toContain("inventory");
      expect(values).toContain("status");
    });
  });

  describe("filterConfigs", () => {
    it("includes sku, ownerName, and status filters", () => {
      const keys = filterConfigs.map((f) => f.key);
      expect(keys).toContain("sku");
      expect(keys).toContain("ownerName");
      expect(keys).toContain("status");
    });

    it("status filter has ACTIVE and INACTIVE options", () => {
      const statusFilter = filterConfigs.find((f) => f.key === "status");
      expect(statusFilter?.type).toBe("select");
      if (statusFilter?.type === "select") {
        const values = statusFilter.options.map((o) => o.value);
        expect(values).toContain("ACTIVE");
        expect(values).toContain("INACTIVE");
      }
    });
  });

  describe("columns", () => {
    it("defines name, sku, price, inventory, status, owner columns", () => {
      const ids = columns.map((c) => c.id);
      expect(ids).toEqual([
        "name",
        "sku",
        "price",
        "inventory",
        "status",
        "owner",
      ]);
    });

    it("owner column is not sortable", () => {
      const ownerCol = columns.find((c) => c.id === "owner");
      expect(ownerCol?.sortable).toBe(false);
    });

    it("price column renders formatted value", () => {
      const priceCol = columns.find((c) => c.id === "price");
      const row = {
        id: "1",
        name: "X",
        sku: "X",
        price: 9.5,
        inventory: 0,
        status: "ACTIVE" as const,
      };
      expect(priceCol?.render?.(row)).toBe("$9.50");
    });
  });

  describe("buildQueryParams", () => {
    it("includes only non-empty filter values", () => {
      const result = buildQueryParams({ ...DEFAULTS });
      expect(result).not.toHaveProperty("name");
      expect(result).not.toHaveProperty("sku");
      expect(result).not.toHaveProperty("status");
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });
});
