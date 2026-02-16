/**
 * Centralized API configuration for the frontend.
 * Read from Vite env var `VITE_API_BASE_URL` with a sane default.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "/api";

export default API_BASE_URL;
