import { apiSlice } from "./apiSlice";
import type { BaseApiResponse, PaginatedResponse } from "../../types/api";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  ProductFilters,
} from "../../types/product";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResponse<Product>,
      ProductFilters | void
    >({
      query: (params) => ({
        url: "/products",
        params: params || undefined,
      }),
      transformResponse: (response: BaseApiResponse<PaginatedResponse<Product>>) =>
        response.data!,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: BaseApiResponse<Product>) => response.data!,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation<Product, CreateProductPayload>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      transformResponse: (response: BaseApiResponse<Product>) => response.data!,
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: string; body: UpdateProductPayload }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: BaseApiResponse<Product>) => response.data!,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    getProductsByOwner: builder.query<Product[], string>({
      query: (ownerId) => `/products/owner/${ownerId}`,
      transformResponse: (response: BaseApiResponse<Product[]>) => response.data ?? [],
      providesTags: (result, _error, ownerId) => {
        const ownerTag = { type: "Product" as const, id: `OWNER-${ownerId}` };
        if (!result) {
          return [ownerTag, { type: "Product", id: "LIST" }];
        }
        return [
          ...result.map(({ id }) => ({ type: "Product" as const, id })),
          ownerTag,
          { type: "Product", id: "LIST" },
        ];
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsByOwnerQuery,
} = productApi;
