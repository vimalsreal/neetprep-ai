import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Add any middleware logic here
  // For example, authentication checks for protected routes

  const protectedPaths = ["/dashboard"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath) {
    // Check for authentication token/session
    // For now, we'll allow all requests
    // In production, implement proper authentication check
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
