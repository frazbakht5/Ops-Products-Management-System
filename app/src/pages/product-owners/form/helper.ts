import type { CreateProductOwnerPayload, ProductOwner } from "../../../types/productOwner";

export interface FormState {
  name: string;
  email: string;
  phone: string;
}

export const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
};

export function buildBaseForm(existing?: ProductOwner): FormState {
  if (!existing) return INITIAL_FORM;
  return {
    name: existing.name,
    email: existing.email,
    phone: existing.phone ?? "",
  };
}

export function validateForm(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address";
  return errors;
}

export function buildPayload(form: FormState): CreateProductOwnerPayload {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
  };
}
