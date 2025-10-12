export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || 'http://localhost:3000';
}

export function getAuthApiUrl(): string {
  return import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3001';
}
