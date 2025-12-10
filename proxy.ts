import { authMiddleware } from "@/lib/auth/middleware"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  return authMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
