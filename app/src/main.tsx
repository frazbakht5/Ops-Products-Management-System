import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { AppThemeProvider } from "./context/ThemeContext";
import { store } from "./store/store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SnackbarProvider>
      </AppThemeProvider>
    </Provider>
  </StrictMode>
);
