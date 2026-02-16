import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { Sentry } from "./sentry";
import { AppThemeProvider } from "./context/ThemeContext";
import { store } from "./store/store";
import App from "./App";
import "./index.css";

function ErrorFallback() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-lg font-semibold">Something went wrong.</h1>
      <p className="text-sm text-gray-600">Please refresh and try again.</p>
    </div>
  );
}

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
            <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
              <App />
            </Sentry.ErrorBoundary>
          </BrowserRouter>
        </SnackbarProvider>
      </AppThemeProvider>
    </Provider>
  </StrictMode>
);
