import { describe, it, expect } from "vitest";
import {
  INITIAL_FORM,
  buildBaseForm,
  validateForm,
  buildPayload,
  type FormState,
} from "./helper";
import type { Product } from "../../../types/product";

describe("Product form helper", () => {
  describe("buildBaseForm", () => {
    it("returns INITIAL_FORM when no existing product", () => {
      expect(buildBaseForm()).toEqual(INITIAL_FORM);
    });

    it("maps existing product fields to form state", () => {
      const product: Product = {
        id: "1",
        name: "Widget",
        sku: "WID-001",
        price: 19.99,
        inventory: 50,
        status: "ACTIVE",
        owner: { id: "o1", name: "John", email: "j@test.com" },
        image: "YmFzZTY0",
        imageMimeType: "image/png",
      };

      const form = buildBaseForm(product);
      expect(form).toEqual({
        name: "Widget",
        sku: "WID-001",
        price: "19.99",
        inventory: "50",
        status: "ACTIVE",
        ownerId: "o1",
        image: "YmFzZTY0",
        imageMimeType: "image/png",
      });
    });

    it("handles missing owner gracefully", () => {
      const product: Product = {
        id: "1",
        name: "No Owner",
        sku: "NO-001",
        price: 5,
        inventory: 0,
        status: "INACTIVE",
      };

      const form = buildBaseForm(product);
      expect(form.ownerId).toBe("");
    });
  });

  describe("validateForm", () => {
    it("returns empty errors for valid form", () => {
      const form: FormState = {
        name: "Widget",
        sku: "WID-001",
        price: "10",
        inventory: "5",
        status: "ACTIVE",
        ownerId: "o1",
        image: null,
        imageMimeType: null,
      };

      expect(validateForm(form)).toEqual({});
    });

    it("catches empty name", () => {
      const form: FormState = {
        ...INITIAL_FORM,
        sku: "SKU1",
        price: "10",
        ownerId: "o1",
        image: null,
        imageMimeType: null,
      };

      const errors = validateForm(form);
      expect(errors.name).toBe("Name is required");
    });

    it("catches empty SKU", () => {
      const form: FormState = {
        ...INITIAL_FORM,
        name: "Widget",
        price: "10",
        ownerId: "o1",
        image: null,
        imageMimeType: null,
      };

      const errors = validateForm(form);
      expect(errors.sku).toBe("SKU is required");
    });

    it("catches negative price", () => {
      const form: FormState = {
        name: "Widget",
        sku: "SKU1",
        price: "-1",
        inventory: "0",
        status: "ACTIVE",
        ownerId: "o1",
        image: null,
        imageMimeType: null,
      };

      const errors = validateForm(form);
      expect(errors.price).toBe("Price must be >= 0");
    });

    it("catches empty price", () => {
      const form: FormState = {
        name: "Widget",
        sku: "SKU1",
        price: "",
        inventory: "0",
        status: "ACTIVE",
        ownerId: "o1",
        image: null,
        imageMimeType: null,
      };

      const errors = validateForm(form);
      expect(errors.price).toBeDefined();
    });

    it("catches negative inventory", () => {
      const form: FormState = {
        name: "Widget",
        sku: "SKU1",
        price: "10",
        inventory: "-5",
        status: "ACTIVE",
        ownerId: "o1",
        image: null,
        imageMimeType: null,
      };

      const errors = validateForm(form);
      expect(errors.inventory).toBe("Inventory must be >= 0");
    });

    it("catches missing owner", () => {
      const form: FormState = {
        name: "Widget",
        sku: "SKU1",
        price: "10",
        inventory: "0",
        status: "ACTIVE",
        ownerId: "",
        image: null,
        imageMimeType: null,
      };

      const errors = validateForm(form);
      expect(errors.ownerId).toBe("Owner is required");
    });
  });

  describe("buildPayload", () => {
    it("converts form state to API payload", () => {
      const form: FormState = {
        name: "  Widget  ",
        sku: " WID-001 ",
        price: "19.99",
        inventory: "50",
        status: "ACTIVE",
        ownerId: "o1",
        image: null,
        imageMimeType: null,
      };

      const payload = buildPayload(form);
      expect(payload).toEqual({
        name: "Widget",
        sku: "WID-001",
        price: 19.99,
        inventory: 50,
        status: "ACTIVE",
        ownerId: "o1",
      });
    });

    it("includes image when requested", () => {
      const form: FormState = {
        name: "Widget",
        sku: "WID-001",
        price: "19.99",
        inventory: "10",
        status: "ACTIVE",
        ownerId: "o1",
        image: "YmFzZTY0",
        imageMimeType: "image/png",
      };

      const payload = buildPayload(form, {
        includeImage: true,
        imageValue: form.image,
        imageMimeTypeValue: form.imageMimeType,
      });

      expect(payload.image).toBe("YmFzZTY0");
      expect(payload.imageMimeType).toBe("image/png");
    });
  });
});
