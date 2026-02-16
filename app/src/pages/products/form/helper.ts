import type { Product, CreateProductPayload } from "../../../types/product";

export interface FormState {
  name: string;
  sku: string;
  price: string;
  inventory: string;
  status: "ACTIVE" | "INACTIVE";
  ownerId: string;
  image: string | null;
  imageMimeType: string | null;
}

export const INITIAL_FORM: FormState = {
  name: "",
  sku: "",
  price: "",
  inventory: "0",
  status: "ACTIVE",
  ownerId: "",
  image: null,
  imageMimeType: null,
};

export function buildBaseForm(existing?: Product): FormState {
  if (!existing) return INITIAL_FORM;
  return {
    name: existing.name,
    sku: existing.sku,
    price: String(existing.price),
    inventory: String(existing.inventory),
    status: existing.status,
    ownerId: existing.owner?.id ?? "",
    image: existing.image ?? null,
    imageMimeType: existing.imageMimeType ?? null,
  };
}

export function validateForm(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.sku.trim()) errors.sku = "SKU is required";
  if (form.price === "" || Number(form.price) < 0)
    errors.price = "Price must be >= 0";
  if (form.inventory === "" || Number(form.inventory) < 0)
    errors.inventory = "Inventory must be >= 0";
  if (!form.ownerId) errors.ownerId = "Owner is required";
  if (form.image && !form.imageMimeType) {
    errors.image = "Image type is required";
  }
  if (!form.image && form.imageMimeType) {
    errors.image = "Image data is required";
  }
  return errors;
}

export function buildPayload(
  form: FormState,
  options?: {
    includeImage?: boolean;
    imageValue?: string | null;
    imageMimeTypeValue?: string | null;
  }
): CreateProductPayload {
  const payload: CreateProductPayload = {
    name: form.name.trim(),
    sku: form.sku.trim(),
    price: Number(form.price),
    inventory: Number(form.inventory),
    status: form.status,
    ownerId: form.ownerId,
  };

  if (options?.includeImage) {
    payload.image = options.imageValue ?? null;
    payload.imageMimeType = options.imageMimeTypeValue ?? null;
  }

  return payload;
}
