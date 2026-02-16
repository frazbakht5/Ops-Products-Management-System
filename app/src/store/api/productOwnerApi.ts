import { apiSlice } from "./apiSlice";
import type { BaseApiResponse, PaginatedResponse } from "../../types/api";
import type {
  ProductOwner,
  CreateProductOwnerPayload,
  UpdateProductOwnerPayload,
  ProductOwnerFilters,
} from "../../types/productOwner";

export const productOwnerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductOwners: builder.query<
      PaginatedResponse<ProductOwner>,
      ProductOwnerFilters | void
    >({
      query: (params) => ({
        url: "/product-owners",
        params: params || undefined,
      }),
      transformResponse: (
        response: BaseApiResponse<PaginatedResponse<ProductOwner>>,
      ) => response.data!,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "ProductOwner" as const,
                id,
              })),
              { type: "ProductOwner", id: "LIST" },
            ]
          : [{ type: "ProductOwner", id: "LIST" }],
    }),

    getProductOwnerById: builder.query<ProductOwner, string>({
      query: (id) => `/product-owners/${id}`,
      transformResponse: (response: BaseApiResponse<ProductOwner>) =>
        response.data!,
      providesTags: (_result, _error, id) => [{ type: "ProductOwner", id }],
    }),

    createProductOwner: builder.mutation<
      ProductOwner,
      CreateProductOwnerPayload
    >({
      query: (body) => ({
        url: "/product-owners",
        method: "POST",
        body,
      }),
      transformResponse: (response: BaseApiResponse<ProductOwner>) =>
        response.data!,
      invalidatesTags: [{ type: "ProductOwner", id: "LIST" }],
    }),

    updateProductOwner: builder.mutation<
      ProductOwner,
      { id: string; body: UpdateProductOwnerPayload }
    >({
      query: ({ id, body }) => ({
        url: `/product-owners/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: BaseApiResponse<ProductOwner>) =>
        response.data!,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ProductOwner", id },
        { type: "ProductOwner", id: "LIST" },
      ],
    }),

    deleteProductOwner: builder.mutation<void, string>({
      query: (id) => ({
        url: `/product-owners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ProductOwner", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductOwnersQuery,
  useGetProductOwnerByIdQuery,
  useCreateProductOwnerMutation,
  useUpdateProductOwnerMutation,
  useDeleteProductOwnerMutation,
} = productOwnerApi;
