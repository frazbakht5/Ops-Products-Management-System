import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AppLayout from "./components/layout/AppLayout/index";

const ProductListPage = lazy(
  () => import("./pages/products/list/ProductListPage"),
);
const ProductFormPage = lazy(
  () => import("./pages/products/form/ProductFormPage"),
);
const ProductOwnerListPage = lazy(
  () => import("./pages/product-owners/list/ProductOwnerListPage"),
);
const ProductOwnerFormPage = lazy(
  () => import("./pages/product-owners/form/ProductOwnerFormPage"),
);
const AboutPage = lazy(() => import("./pages/about/AboutPage"));

function PageLoader() {
  return (
    <Box className="flex items-center justify-center py-20">
      <CircularProgress />
    </Box>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/products" replace />} />

        {/* Products */}
        <Route
          path="/products"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductListPage />
            </Suspense>
          }
        />
        <Route
          path="/products/new"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductFormPage />
            </Suspense>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductFormPage />
            </Suspense>
          }
        />

        {/* Product Owners */}
        <Route
          path="/product-owners"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductOwnerListPage />
            </Suspense>
          }
        />
        <Route
          path="/product-owners/new"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductOwnerFormPage />
            </Suspense>
          }
        />
        <Route
          path="/product-owners/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductOwnerFormPage />
            </Suspense>
          }
        />

        {/* About */}
        <Route
          path="/about"
          element={
            <Suspense fallback={<PageLoader />}>
              <AboutPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
