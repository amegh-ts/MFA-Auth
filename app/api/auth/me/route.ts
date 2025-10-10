import { NextResponse, type NextRequest } from "next/server"
import { verifyAccessToken } from "@/lib/jwt"
import { connectToDB } from "@/lib/db"
import { User } from "@/models/user"

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null
  if (!token) {
    return NextResponse.json({ error: "Missing access token" }, { status: 401 })
  }

  try {
    const payload = await verifyAccessToken(token)
    await connectToDB()
    const user = await User.findById(payload.sub).lean()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json({ id: user._id.toString(), email: user.email, createdAt: user.createdAt }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }
}
