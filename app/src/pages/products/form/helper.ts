import type {
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import type { SelectOption } from "../../../components/common/FormField";
import type { Product, CreateProductPayload } from "../../../types/product";
import type { ProductOwner } from "../../../types/productOwner";

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

export type FormErrors = Partial<Record<keyof FormState, string>>;

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

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

export function createFieldChangeHandler(
  setFormOverrides: Dispatch<SetStateAction<Partial<FormState>>>,
  setErrors: Dispatch<SetStateAction<FormErrors>>
) {
  return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormOverrides((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };
}

const IMAGE_TOO_LARGE_ERROR = "Image must be smaller than 2MB";

function extractBase64Data(dataUrl: string): string {
  return dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
}

export function createImageChangeHandler(params: {
  setFormOverrides: Dispatch<SetStateAction<Partial<FormState>>>;
  setErrors: Dispatch<SetStateAction<FormErrors>>;
  setImageTouched: Dispatch<SetStateAction<boolean>>;
  setImageFileName: Dispatch<SetStateAction<string | undefined>>;
  maxSizeBytes?: number;
}) {
  const {
    setFormOverrides,
    setErrors,
    setImageTouched,
    setImageFileName,
    maxSizeBytes = MAX_IMAGE_SIZE_BYTES,
  } = params;

  return (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const input = event.target;

    if (file.size > maxSizeBytes) {
      setErrors((prev) => ({ ...prev, image: IMAGE_TOO_LARGE_ERROR }));
      input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = extractBase64Data(result);
      setFormOverrides((prev) => ({
        ...prev,
        image: base64Data,
        imageMimeType: file.type || null,
      }));
      setErrors((prev) => ({ ...prev, image: undefined }));
      setImageTouched(true);
      setImageFileName(file.name);
      input.value = "";
    };
    reader.readAsDataURL(file);
  };
}

export function createImageRemoveHandler(params: {
  setFormOverrides: Dispatch<SetStateAction<Partial<FormState>>>;
  setErrors: Dispatch<SetStateAction<FormErrors>>;
  setImageTouched: Dispatch<SetStateAction<boolean>>;
  setImageFileName: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { setFormOverrides, setErrors, setImageTouched, setImageFileName } = params;
  return () => {
    setFormOverrides((prev) => ({ ...prev, image: null, imageMimeType: null }));
    setImageTouched(true);
    setImageFileName(undefined);
    setErrors((prev) => ({ ...prev, image: undefined }));
  };
}

export function buildOwnerSelectOptions(
  owners?: ProductOwner[]
): SelectOption[] {
  return owners?.map((owner) => ({
    label: owner.name,
    value: owner.id,
  })) ?? [];
}

export function buildImagePreviewSrc(
  image: string | null,
  mimeType: string | null
) {
  if (!image) return undefined;
  return `data:${mimeType ?? "image/png"};base64,${image}`;
}

export { extractBase64Data }; // for testing purposes
