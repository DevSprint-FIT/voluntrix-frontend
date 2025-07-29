// This file handles redirection from dynamic routes to the new token-based route
export default function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Check if it's using the old dynamic route pattern with [username]
  if (pathname.startsWith('/PublicFeed/') && pathname !== '/PublicFeed') {
    // Redirect to the new token-based page
    return Response.redirect(new URL('/PublicFeed', req.url));
  }
  
  return null;
}

// Apply this middleware to the relevant patterns
export const config = {
  matcher: '/PublicFeed/:path*',
};
