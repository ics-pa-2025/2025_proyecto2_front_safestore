export function getApiUrl(): string {
  // runtime config (injected as env.js)
  const fromWindow = (window as any).__ENV?.VITE_API_URL
  const fromBuild = (import.meta as any).env?.VITE_API_URL
  return fromWindow || fromBuild || 'http://localhost:3000'
}
