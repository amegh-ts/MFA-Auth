import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })

  response.cookies.delete("accessToken")
  response.cookies.delete("refreshToken")

  return response
}
