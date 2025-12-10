import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import { User } from "@/lib/db/models/user"
import { verifyToken } from "@/lib/auth/token-utils"
import { validateSession } from "@/lib/auth/token-utils"

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(accessToken)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await connectDB()

    // Validate session
    const isValidSession = await validateSession(payload.jti, payload.sub)
    if (!isValidSession) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    const user = await User.findById(payload.sub).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
