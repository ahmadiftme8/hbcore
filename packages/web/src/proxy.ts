import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(_request: NextRequest) {
  const response = NextResponse.next();

  // Set Cross-Origin-Opener-Policy to allow Firebase popup authentication
  // 'same-origin-allow-popups' allows popups from same origin and cross-origin popups
  // This is required for Firebase's signInWithPopup to work properly
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  // Set Content Security Policy to allow Cloudflare Turnstile and API server
  // Turnstile requires:
  // - script-src: to load the Turnstile script from challenges.cloudflare.com
  // - frame-src: to allow Turnstile's iframe (with script execution)
  // - connect-src: to allow Turnstile API calls and backend API calls
  // - child-src: alternative to frame-src for older browsers
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Build connect-src directive with API URL
  const connectSrc = [
    "'self'",
    'https://challenges.cloudflare.com',
    'https://*.cloudflare.com',
    apiUrl, // Allow connections to API server
  ].join(' ');

  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com",
    "child-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
