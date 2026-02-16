import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE,
    tracesSampleRate: Number(
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? "0.1",
    ),
    replaysSessionSampleRate: Number(
      import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? "0.0",
    ),
    replaysOnErrorSampleRate: Number(
      import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? "1.0",
    ),
  });
}

export { Sentry };
