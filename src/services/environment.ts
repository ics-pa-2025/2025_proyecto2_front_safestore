export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL as string;
}

export function getAuthApiUrl(): string {
  return import.meta.env.VITE_AUTH_API_URL as string;
}
