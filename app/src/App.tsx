import { Routes, Route, Navigate } from "react-router";
import AppLayout from "./components/layout/AppLayout/index";
import ProductListPage from "./pages/products/list/ProductListPage";
import ProductFormPage from "./pages/products/form/ProductFormPage";
import ProductOwnerListPage from "./pages/product-owners/list/ProductOwnerListPage";
import ProductOwnerFormPage from "./pages/product-owners/form/ProductOwnerFormPage";
import AboutPage from "./pages/about/AboutPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/products" replace />} />

        {/* Products */}
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductFormPage />} />

        {/* Product Owners */}
        <Route path="/product-owners" element={<ProductOwnerListPage />} />
        <Route path="/product-owners/new" element={<ProductOwnerFormPage />} />
        <Route path="/product-owners/:id" element={<ProductOwnerFormPage />} />

        {/* About */}
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
