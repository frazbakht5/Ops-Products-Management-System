import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ChangeEvent } from "react";
import {
  INITIAL_FORM,
  buildBaseForm,
  validateForm,
  buildPayload,
  type FormState,
  createFieldChangeHandler,
  createImageChangeHandler,
  createImageRemoveHandler,
  buildOwnerSelectOptions,
  buildImagePreviewSrc,
  MAX_IMAGE_SIZE_BYTES,
} from "./helper";
import type { Product } from "../../../types/product";
import type { ProductOwner } from "../../../types/productOwner";

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

  describe("helper utilities", () => {
    it("updates overrides and clears errors via createFieldChangeHandler", () => {
      let overrides: Partial<FormState> = {};
      let errors: Partial<Record<keyof FormState, string>> = { name: "Required" };
      const setFormOverrides = vi.fn((updater) => {
        overrides =
          typeof updater === "function" ? updater(overrides) : (updater as Partial<FormState>);
      });
      const setErrors = vi.fn((updater) => {
        errors =
          typeof updater === "function"
            ? updater(errors)
            : (updater as Partial<Record<keyof FormState, string>>);
      });

      const handler = createFieldChangeHandler(setFormOverrides as any, setErrors as any);
      handler({
        target: { name: "name", value: "Updated" },
      } as unknown as ChangeEvent<HTMLInputElement>);

      expect(overrides.name).toBe("Updated");
      expect(errors.name).toBeUndefined();
    });

    it("builds owner select options", () => {
      const owners: ProductOwner[] = [
        { id: "1", name: "Alice", email: "a@test.com" },
        { id: "2", name: "Bob", email: "b@test.com" },
      ];
      const options = buildOwnerSelectOptions(owners);
      expect(options).toEqual([
        { label: "Alice", value: "1" },
        { label: "Bob", value: "2" },
      ]);
    });

    it("builds image preview src", () => {
      const preview = buildImagePreviewSrc("YmFzZTY0", "image/png");
      expect(preview).toBe("data:image/png;base64,YmFzZTY0");
    });

    describe("image handlers", () => {
      const originalFileReader = globalThis.FileReader;

      beforeEach(() => {
        class MockFileReader {
          public result: string | ArrayBuffer | null = null;
          public onloadend: (() => void) | null = null;
          readAsDataURL() {
            this.result = "data:image/png;base64,TESTDATA";
            this.onloadend?.();
          }
        }
        globalThis.FileReader = MockFileReader as unknown as typeof FileReader;
      });

      afterEach(() => {
        globalThis.FileReader = originalFileReader;
      });

      it("processes selected image files", () => {
        let overrides: Partial<FormState> = {};
        let errors: Partial<Record<keyof FormState, string>> = {};
        const setFormOverrides = vi.fn((updater) => {
          overrides = typeof updater === "function" ? updater(overrides) : (updater as any);
        });
        const setErrors = vi.fn((updater) => {
          errors = typeof updater === "function" ? updater(errors) : (updater as any);
        });
        const setImageTouched = vi.fn();
        const setImageFileName = vi.fn();

        const handler = createImageChangeHandler({
          setFormOverrides: setFormOverrides as any,
          setErrors: setErrors as any,
          setImageTouched,
          setImageFileName,
        });

        const file = new File(["hello"], "photo.png", { type: "image/png" });
        const event = {
          target: {
            files: [file],
            value: "path",
          },
        } as unknown as ChangeEvent<HTMLInputElement>;

        handler(event);

        expect(overrides.image).toBe("TESTDATA");
        expect(overrides.imageMimeType).toBe("image/png");
        expect(errors.image).toBeUndefined();
        expect(setImageTouched).toHaveBeenCalledWith(true);
        expect(setImageFileName).toHaveBeenCalledWith("photo.png");
        expect(event.target.value).toBe("");
      });

      it("sets error when file is too large", () => {
        let errors: Partial<Record<keyof FormState, string>> = {};
        const setErrors = vi.fn((updater) => {
          errors = typeof updater === "function" ? updater(errors) : (updater as any);
        });
        const handler = createImageChangeHandler({
          setFormOverrides: vi.fn() as any,
          setErrors: setErrors as any,
          setImageTouched: vi.fn(),
          setImageFileName: vi.fn(),
          maxSizeBytes: 1,
        });

        const file = new File([new ArrayBuffer(MAX_IMAGE_SIZE_BYTES)], "large.png", {
          type: "image/png",
        });
        const event = {
          target: {
            files: [file],
            value: "path",
          },
        } as unknown as ChangeEvent<HTMLInputElement>;

        handler(event);

        expect(errors.image).toBe("Image must be smaller than 2MB");
        expect(event.target.value).toBe("");
      });
    });

    it("clears image state via createImageRemoveHandler", () => {
      let overrides: Partial<FormState> = { image: "abc", imageMimeType: "image/png" };
      let errors: Partial<Record<keyof FormState, string>> = { image: "err" };
      const setFormOverrides = vi.fn((updater) => {
        overrides = typeof updater === "function" ? updater(overrides) : (updater as any);
      });
      const setErrors = vi.fn((updater) => {
        errors = typeof updater === "function" ? updater(errors) : (updater as any);
      });
      const setImageTouched = vi.fn();
      const setImageFileName = vi.fn();

      const handler = createImageRemoveHandler({
        setFormOverrides: setFormOverrides as any,
        setErrors: setErrors as any,
        setImageTouched,
        setImageFileName,
      });

      handler();

      expect(overrides.image).toBeNull();
      expect(overrides.imageMimeType).toBeNull();
      expect(errors.image).toBeUndefined();
      expect(setImageTouched).toHaveBeenCalledWith(true);
      expect(setImageFileName).toHaveBeenCalledWith(undefined);
    });
  });
});
