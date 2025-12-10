/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignJWT, jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";
import { Session } from "@/lib/db/models/session";
import { connectDB } from "@/lib/db/mongodb";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);
const ACCESS_TOKEN_EXPIRATION = "5m";
const REFRESH_TOKEN_EXPIRATION = "7d";

export interface TokenPayload {
  sub: string; // user id
  jti: string; // session id
  type: "access" | "refresh";
  iat: number;
  exp: number;
}

export async function createAccessToken(
  userId: string,
  sessionId: string
): Promise<string> {
  const token = await new SignJWT({ type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(sessionId)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

export async function createRefreshToken(
  userId: string,
  sessionId: string,
  userAgent: string,
  ipAddress: string
): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const token = await new SignJWT({ type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(sessionId)
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRATION)
    .sign(JWT_SECRET);

  await connectDB();
  await Session.create({
    userId,
    jti: sessionId,
    userAgent,
    ipAddress,
    expiresAt,
  });

  return token;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function rotateRefreshToken(
  oldSessionId: string,
  userId: string,
  userAgent: string,
  ipAddress: string
): Promise<string> {
  await connectDB();

  // Revoke old session
  await Session.updateOne({ jti: oldSessionId }, { revokedAt: new Date() });

  // Create new session
  const newSessionId = uuidv4();
  const newRefreshToken = await createRefreshToken(
    userId,
    newSessionId,
    userAgent,
    ipAddress
  );

  return newRefreshToken;
}

export async function validateSession(
  jti: string,
  userId: string
): Promise<boolean> {
  await connectDB();

  const session = await Session.findOne({
    jti,
    userId,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  return !!session;
}

export function generateSessionId(): string {
  return uuidv4();
}
