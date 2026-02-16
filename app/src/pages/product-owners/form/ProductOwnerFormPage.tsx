import { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";

import { getErrorMessage } from "../../../utils/getErrorMessage";
import FormField from "../../../components/common/FormField";
import {
  useGetProductOwnerByIdQuery,
  useCreateProductOwnerMutation,
  useUpdateProductOwnerMutation,
} from "../../../store/api/productOwnerApi";
import { useGetProductsByOwnerQuery } from "../../../store/api/productApi";
import {
  buildBaseForm,
  buildPayload,
  validateForm,
  INITIAL_FORM,
  type FormState,
} from "./helper";

export default function ProductOwnerFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { data: existing, isLoading: loadingOwner } =
    useGetProductOwnerByIdQuery(id!, { skip: !isEdit });
  const [createOwner, { isLoading: isCreating }] =
    useCreateProductOwnerMutation();
  const [updateOwner, { isLoading: isUpdating }] =
    useUpdateProductOwnerMutation();

  const isSaving = isCreating || isUpdating;

  const {
    data: ownerProducts = [],
    isFetching: ownerProductsLoading,
    error: ownerProductsError,
  } = useGetProductsByOwnerQuery(isEdit ? (id as string) : skipToken);

  const ownerProductsErrorMessage = useMemo(
    () =>
      ownerProductsError
        ? getErrorMessage(
            ownerProductsError,
            "Failed to load owner's products",
          )
        : null,
    [ownerProductsError],
  );

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
      setFormOverrides(INITIAL_FORM);
    } catch (err) {
      enqueueSnackbar(
        getErrorMessage(
          err,
          isEdit
            ? "Failed to update product owner"
            : "Failed to create product owner",
        ),
        { variant: "error" },
      );
    }
  };

  if (isEdit && loadingOwner) {
    return (
      <Box className="flex items-center justify-center py-20">
        <CircularProgress />
      </Box>
    );
  }

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

      <Paper
        variant="outlined"
        sx={{
          mx: "auto",
          width: "100%",
          maxWidth: 1200,
          p: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
            alignItems: "stretch",
          }}
        >
          <Box sx={{ flex: 1 }}>
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
                name="email"
                label="Email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <FormField
                name="phone"
                label="Phone"
                type="tel"
                value={formValues.phone}
                onChange={handleChange}
                placeholder="Optional"
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
                <Button
                  variant="outlined"
                  onClick={() => navigate("/product-owners")}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
              minHeight: 240,
              backgroundColor: "background.default",
            }}
          >
            <Typography variant="h6" className="mb-3">
              Products owned by this user
            </Typography>
            {!isEdit && (
              <Typography variant="body2" color="text.secondary">
                Save the owner first to see their products.
              </Typography>
            )}
            {isEdit && ownerProductsLoading && (
              <Box className="flex items-center gap-2">
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
              </Box>
            )}
            {isEdit && ownerProductsErrorMessage && (
              <Typography color="error" variant="body2">
                {ownerProductsErrorMessage}
              </Typography>
            )}
            {isEdit &&
              !ownerProductsLoading &&
              !ownerProductsErrorMessage &&
              ownerProducts.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No products are currently assigned to this owner.
                </Typography>
              )}
            {isEdit &&
              !ownerProductsLoading &&
              !ownerProductsErrorMessage &&
              ownerProducts.length > 0 && (
                <List dense>
                  {ownerProducts.map((product) => (
                    <ListItem key={product.id} disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to={`/products/${product.id}`}
                      >
                        <ListItemText
                          primary={product.name}
                          secondary={`SKU: ${product.sku}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
          </Box>
        </Box>
      </Paper>
    </>
  );
}
