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
  createFieldChangeHandler,
  createImageChangeHandler,
  createImageRemoveHandler,
  buildOwnerSelectOptions,
  buildImagePreviewSrc,
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
  const [imageTouched, setImageTouched] = useState(false);
  const [imageFileName, setImageFileName] = useState<string | undefined>();

  const baseForm = useMemo<FormState>(
    () => buildBaseForm(existing),
    [existing],
  );
  const formValues = useMemo(
    () => ({ ...baseForm, ...formOverrides }),
    [baseForm, formOverrides],
  );

  const handleChange = useMemo(
    () => createFieldChangeHandler(setFormOverrides, setErrors),
    [setFormOverrides, setErrors],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = buildPayload(formValues, {
      includeImage: imageTouched,
      imageValue: formValues.image,
      imageMimeTypeValue: formValues.imageMimeType,
    });

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
      setImageTouched(false);
      setImageFileName(undefined);
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

  const handleImageChange = useMemo(
    () =>
      createImageChangeHandler({
        setFormOverrides,
        setErrors,
        setImageTouched,
        setImageFileName,
      }),
    [setFormOverrides, setErrors, setImageTouched, setImageFileName],
  );

  const handleRemoveImage = useMemo(
    () =>
      createImageRemoveHandler({
        setFormOverrides,
        setErrors,
        setImageTouched,
        setImageFileName,
      }),
    [setFormOverrides, setErrors, setImageTouched, setImageFileName],
  );

  if (isEdit && loadingProduct) {
    return (
      <Box className="flex items-center justify-center py-20">
        <CircularProgress />
      </Box>
    );
  }

  const ownerOptions = buildOwnerSelectOptions(ownersData?.items);

  const imagePreviewSrc = buildImagePreviewSrc(
    formValues.image,
    formValues.imageMimeType,
  );

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

      <Paper
        variant="outlined"
        sx={{
          width: { xs: "100%", lg: "80%" },
          mx: "auto",
          p: { xs: 3, md: 4 },
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: "stretch",
              gap: 4,
            }}
          >
            <Box sx={{ flex: 2, minWidth: 0 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 3,
                }}
              >
                <Box>
                  <FormField
                    name="name"
                    label="Name"
                    value={formValues.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />
                </Box>
                <Box>
                  <FormField
                    name="sku"
                    label="SKU"
                    value={formValues.sku}
                    onChange={handleChange}
                    error={errors.sku}
                    required
                  />
                </Box>
                <Box>
                  <FormField
                    name="price"
                    label="Price"
                    type="number"
                    value={formValues.price}
                    onChange={handleChange}
                    error={errors.price}
                    inputProps={{ min: 0 }}
                    required
                  />
                </Box>
                <Box>
                  <FormField
                    name="inventory"
                    label="Inventory"
                    type="number"
                    value={formValues.inventory}
                    onChange={handleChange}
                    error={errors.inventory}
                    inputProps={{ min: 0 }}
                  />
                </Box>
                <Box>
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
                </Box>
                <Box>
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
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" className="mb-2">
                  Product Image (optional)
                </Typography>
                <input
                  accept="image/*"
                  id="product-image-upload"
                  type="file"
                  hidden
                  onChange={handleImageChange}
                />
                <Box className="flex flex-wrap gap-2">
                  <label htmlFor="product-image-upload">
                    <Button component="span" variant="outlined">
                      {formValues.image ? "Replace Image" : "Upload Image"}
                    </Button>
                  </label>
                  {formValues.image && (
                    <Button color="secondary" onClick={handleRemoveImage}>
                      Remove Image
                    </Button>
                  )}
                </Box>
                {imageFileName && (
                  <Typography variant="body2" className="mt-2" color="text.secondary">
                    Selected file: {imageFileName}
                  </Typography>
                )}
                {!imageFileName && formValues.image && (
                  <Typography variant="body2" className="mt-2" color="text.secondary">
                    Image already attached. Upload a new file to replace or remove it.
                  </Typography>
                )}
                {errors.image && (
                  <Typography color="error" variant="body2" className="mt-1">
                    {errors.image}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: { xs: "100%", lg: 0 },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                minHeight: 220,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "background.default",
                overflow: "hidden",
              }}
            >
              {imagePreviewSrc ? (
                <img
                  src={imagePreviewSrc}
                  alt="Product"
                  className="object-contain"
                  style={{ maxWidth: "100%", height: "auto", maxHeight: 280 }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Product image preview will appear here.
                </Typography>
              )}
            </Box>
          </Box>

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
