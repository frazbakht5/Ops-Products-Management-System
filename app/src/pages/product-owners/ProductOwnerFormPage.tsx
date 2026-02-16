import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";

import { getErrorMessage } from "../../utils/getErrorMessage";
import FormField from "../../components/common/FormField";
import {
  useGetProductOwnerByIdQuery,
  useCreateProductOwnerMutation,
  useUpdateProductOwnerMutation,
} from "../../store/api/productOwnerApi";
import type { CreateProductOwnerPayload } from "../../types/productOwner";

// ── Form state type ─────────────────────────────────────────────────────────
interface FormState {
  name: string;
  email: string;
  phone: string;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
};

// ── Component ───────────────────────────────────────────────────────────────
export default function ProductOwnerFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // API hooks
  const { data: existing, isLoading: loadingOwner } =
    useGetProductOwnerByIdQuery(id!, { skip: !isEdit });
  const [createOwner, { isLoading: isCreating }] =
    useCreateProductOwnerMutation();
  const [updateOwner, { isLoading: isUpdating }] =
    useUpdateProductOwnerMutation();

  const isSaving = isCreating || isUpdating;

  // Local form state
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Populate form when editing
  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        email: existing.email,
        phone: existing.phone ?? "",
      });
    }
  }, [existing]);

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateProductOwnerPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
    };

    try {
      if (isEdit) {
        await updateOwner({ id: id!, body: payload }).unwrap();
        enqueueSnackbar("Product owner updated successfully", {
          variant: "success",
        });
      } else {
        await createOwner(payload).unwrap();
        enqueueSnackbar("Product owner created successfully", {
          variant: "success",
        });
      }
      navigate("/product-owners");
    } catch (err) {
      enqueueSnackbar(
        getErrorMessage(err, isEdit
          ? "Failed to update product owner"
          : "Failed to create product owner"),
        { variant: "error" },
      );
    }
  };

  // ── Loading state ───────────────────────────────────────────────────────
  if (isEdit && loadingOwner) {
    return (
      <Box className="flex items-center justify-center py-20">
        <CircularProgress />
      </Box>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/product-owners")}
        className="mb-4"
      >
        Back to Product Owners
      </Button>

      <Typography variant="h4" className="mb-6">
        {isEdit ? "Edit Product Owner" : "Create Product Owner"}
      </Typography>

      <Paper variant="outlined" className="mx-auto max-w-2xl p-6">
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FormField
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <FormField
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <FormField
            name="phone"
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Optional"
          />

          <Box className="mt-6 flex gap-3">
            <Button
              type="submit"
              variant="contained"
              disabled={isSaving}
              startIcon={
                isSaving ? <CircularProgress size={18} /> : undefined
              }
            >
              {isEdit ? "Update" : "Create"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/product-owners")}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
