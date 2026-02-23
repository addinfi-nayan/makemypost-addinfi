/**
 * Get the current app URL based on environment
 * Returns localhost for development, production URL for Vercel
 */
export function getAppUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  
  // Server-side: check environment variables
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Fallback for development
  return 'http://localhost:3000';
}

/**
 * Get OAuth redirect URI for the current environment
 */
export function getOAuthRedirectUri(): string {
  return `${getAppUrl()}/api/oauth/callback`;
}

/**
 * Get auth callback URI for the current environment  
 */
export function getAuthCallbackUri(): string {
  return `${getAppUrl()}/auth/callback`;
}
