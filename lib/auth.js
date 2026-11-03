import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "hh_admin_session";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET environment variable is not set. Generate one (e.g. `openssl rand -base64 32`) and add it to your .env.local."
    );
  }
  return new TextEncoder().encode(secret);
}

// Cost 10 is still strong and about 4x faster than 12 (bcryptjs is pure JS).
const BCRYPT_COST = 10;

export async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_COST);
}

// True when a stored hash was made with a higher cost than we now use.
export function needsRehash(hash) {
  try {
    return bcrypt.getRounds(hash) > BCRYPT_COST;
  } catch {
    return false;
  }
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken({ adminId, email, firstName }) {
  return new SignJWT({ adminId, email, firstName })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (err) {
    return null;
  }
}

// For use inside API route handlers (not page middleware — middleware
// only protects /admin/* pages, not /api/* routes, so every mutating API
// route needs to check this itself).
export async function requireApiSession(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}