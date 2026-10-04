import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const LOGIN_WINDOW_MS = 1000 * 60 * 15;
const MAX_LOGIN_ATTEMPTS = 6;
const sessions = new Map<string, { expiresAt: number }>();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getPasswordHash(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeCompare(a: string, b: string) {
  const left = getPasswordHash(a);
  const right = getPasswordHash(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function cleanupExpiredSessions() {
  const now = Date.now();

  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(token);
    }
  }
}

function cleanupLoginAttempts() {
  const now = Date.now();

  for (const [key, attempt] of loginAttempts.entries()) {
    if (attempt.resetAt <= now) {
      loginAttempts.delete(key);
    }
  }
}

export function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();

  return forwardedFor || realIp || "unknown";
}

export function isLoginRateLimited(key: string) {
  cleanupLoginAttempts();

  const attempt = loginAttempts.get(key);
  return Boolean(attempt && attempt.count >= MAX_LOGIN_ATTEMPTS && attempt.resetAt > Date.now());
}

export function recordFailedLogin(key: string) {
  cleanupLoginAttempts();

  const current = loginAttempts.get(key);

  if (!current || current.resetAt <= Date.now()) {
    loginAttempts.set(key, { count: 1, resetAt: Date.now() + LOGIN_WINDOW_MS });
    return;
  }

  loginAttempts.set(key, { ...current, count: current.count + 1 });
}

export function clearFailedLogins(key: string) {
  loginAttempts.delete(key);
}

export function createAdminSession(password: string) {
  cleanupExpiredSessions();

  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    return { ok: false as const, reason: "missing-password" as const };
  }

  if (!safeCompare(password, configuredPassword)) {
    return { ok: false as const, reason: "invalid-password" as const };
  }

  const token = randomBytes(48).toString("base64url");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, { expiresAt });

  return { ok: true as const, token, expiresAt };
}

export function requireAdminSession(request: NextRequest) {
  cleanupExpiredSessions();

  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  const session = token ? sessions.get(token) : undefined;

  if (!session || session.expiresAt <= Date.now()) {
    return false;
  }

  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}
