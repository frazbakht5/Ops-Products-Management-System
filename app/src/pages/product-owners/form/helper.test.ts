import { describe, it, expect } from "vitest";
import {
  INITIAL_FORM,
  buildBaseForm,
  validateForm,
  buildPayload,
  type FormState,
} from "./helper";
import type { ProductOwner } from "../../../types/productOwner";

describe("ProductOwner form helper", () => {
  describe("buildBaseForm", () => {
    it("returns INITIAL_FORM when no existing owner", () => {
      expect(buildBaseForm()).toEqual(INITIAL_FORM);
    });

    it("maps existing owner fields to form state", () => {
      const owner: ProductOwner = {
        id: "o1",
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "555-1234",
      };

      const form = buildBaseForm(owner);
      expect(form).toEqual({
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "555-1234",
      });
    });

    it("handles missing phone gracefully", () => {
      const owner: ProductOwner = {
        id: "o1",
        name: "Jane",
        email: "jane@example.com",
      };

      const form = buildBaseForm(owner);
      expect(form.phone).toBe("");
    });
  });

  describe("validateForm", () => {
    it("returns empty errors for valid form", () => {
      const form: FormState = {
        name: "Jane",
        email: "jane@example.com",
        phone: "",
      };

      expect(validateForm(form)).toEqual({});
    });

    it("catches empty name", () => {
      const form: FormState = { name: "", email: "a@b.com", phone: "" };
      expect(validateForm(form).name).toBe("Name is required");
    });

    it("catches empty email", () => {
      const form: FormState = { name: "Jane", email: "", phone: "" };
      expect(validateForm(form).email).toBe("Email is required");
    });

    it("catches invalid email format", () => {
      const form: FormState = { name: "Jane", email: "not-email", phone: "" };
      expect(validateForm(form).email).toBe("Enter a valid email address");
    });

    it("accepts valid email formats", () => {
      const form: FormState = {
        name: "Jane",
        email: "user@domain.co",
        phone: "",
      };
      expect(validateForm(form)).toEqual({});
    });
  });

  describe("buildPayload", () => {
    it("converts form state to API payload", () => {
      const form: FormState = {
        name: "  Jane Doe  ",
        email: " jane@example.com ",
        phone: " 555-1234 ",
      };

      const payload = buildPayload(form);
      expect(payload).toEqual({
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "555-1234",
      });
    });

    it("omits phone when empty", () => {
      const form: FormState = {
        name: "Jane",
        email: "jane@example.com",
        phone: "",
      };

      const payload = buildPayload(form);
      expect(payload).not.toHaveProperty("phone");
    });
  });
});
