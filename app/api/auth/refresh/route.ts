import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import { verifyToken, rotateRefreshToken } from "@/lib/auth/token-utils"

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 })
    }

    const payload = await verifyToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
    }

    await connectDB()

    const userAgent = request.headers.get("user-agent") || "unknown"
    const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1"

    const newRefreshToken = await rotateRefreshToken(payload.jti, payload.sub, userAgent, ipAddress)

    const { createAccessToken } = await import("@/lib/auth/token-utils")
    const newAccessToken = await createAccessToken(payload.sub, payload.jti)

    const response = NextResponse.json({ success: true })

    response.cookies.set({
      name: "accessToken",
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
    })

    response.cookies.set({
      name: "refreshToken",
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Refresh error:", error)
    return NextResponse.json({ error: "Token refresh failed" }, { status: 500 })
  }
}
