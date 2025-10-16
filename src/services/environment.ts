export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || 'http://104.236.125.252:3000';
}

export function getAuthApiUrl(): string {
  return import.meta.env.VITE_AUTH_API_URL || 'http://104.236.125.252:3001';
}
