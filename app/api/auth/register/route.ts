import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import { User } from "@/lib/db/models/user"
import { RegisterSchema } from "@/lib/schemas/auth"
import { createAccessToken, createRefreshToken, generateSessionId } from "@/lib/auth/token-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 })
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: parsed.data.email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Create user
    const user = await User.create({
      email: parsed.data.email,
      password: parsed.data.password,
      name: parsed.data.name,
    })

    // Create session
    const sessionId = generateSessionId()
    const userAgent = request.headers.get("user-agent") || "unknown"
    const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1"

    const accessToken = await createAccessToken(user._id.toString(), sessionId)
    const refreshToken = await createRefreshToken(user._id.toString(), sessionId, userAgent, ipAddress)

    // Create response
    const response = NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    })

    // Set secure cookies
    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
    })

    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
