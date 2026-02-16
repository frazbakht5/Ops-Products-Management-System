import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";

import { getErrorMessage } from "../../../utils/getErrorMessage";
import FormField from "../../../components/common/FormField";
import {
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../store/api/productApi";
import { useGetProductOwnersQuery } from "../../../store/api/productOwnerApi";
import {
  buildBaseForm,
  buildPayload,
  validateForm,
  INITIAL_FORM,
  type FormState,
} from "./helper";

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { data: existing, isLoading: loadingProduct } =
    useGetProductByIdQuery(id!, { skip: !isEdit });
  const { data: ownersData } = useGetProductOwnersQuery({ limit: 100 });
  const [createProduct, { isLoading: isCreating }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductMutation();

  const isSaving = isCreating || isUpdating;

  const [formOverrides, setFormOverrides] = useState<Partial<FormState>>({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const baseForm = useMemo<FormState>(
    () => buildBaseForm(existing),
    [existing],
  );
  const formValues = useMemo(
    () => ({ ...baseForm, ...formOverrides }),
    [baseForm, formOverrides],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormOverrides((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = buildPayload(formValues);

    try {
      if (isEdit) {
        await updateProduct({ id: id!, body: payload }).unwrap();
        enqueueSnackbar("Product updated successfully", {
          variant: "success",
        });
      } else {
        await createProduct(payload).unwrap();
        enqueueSnackbar("Product created successfully", {
          variant: "success",
        });
      }
      navigate("/products");
      setFormOverrides(INITIAL_FORM);
    } catch (err) {
      enqueueSnackbar(
        getErrorMessage(
          err,
          isEdit ? "Failed to update product" : "Failed to create product",
        ),
        { variant: "error" },
      );
    }
  };

  if (isEdit && loadingProduct) {
    return (
      <Box className="flex items-center justify-center py-20">
        <CircularProgress />
      </Box>
    );
  }

  const ownerOptions = (ownersData?.items ?? []).map((o) => ({
    label: o.name,
    value: o.id,
  }));

  return (
    <>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/products")}
        className="mb-4"
      >
        Back to Products
      </Button>

      <Typography variant="h4" className="mb-6">
        {isEdit ? "Edit Product" : "Create Product"}
      </Typography>

      <Paper variant="outlined" className="mx-auto max-w-2xl p-6">
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FormField
            name="name"
            label="Name"
            value={formValues.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <FormField
            name="sku"
            label="SKU"
            value={formValues.sku}
            onChange={handleChange}
            error={errors.sku}
            required
          />

          <FormField
            name="price"
            label="Price"
            type="number"
            value={formValues.price}
            onChange={handleChange}
            error={errors.price}
            required
          />

          <FormField
            name="inventory"
            label="Inventory"
            type="number"
            value={formValues.inventory}
            onChange={handleChange}
            error={errors.inventory}
          />

          <FormField
            name="status"
            label="Status"
            type="select"
            value={formValues.status}
            onChange={handleChange}
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
          />

          <FormField
            name="ownerId"
            label="Owner"
            type="select"
            value={formValues.ownerId}
            onChange={handleChange}
            options={ownerOptions}
            error={errors.ownerId}
            required
          />

          <Box className="mt-6 flex gap-3">
            <Button
              type="submit"
              variant="contained"
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={18} /> : undefined}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/products")}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
