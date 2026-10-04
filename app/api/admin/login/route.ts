import { NextResponse, type NextRequest } from "next/server";
import {
  clearFailedLogins,
  createAdminSession,
  getClientKey,
  isLoginRateLimited,
  recordFailedLogin
} from "@/lib/admin-auth";

export const runtime = "nodejs";

function jsonResponse(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);

  const body = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!body?.password) {
    return jsonResponse({ message: "Introduce la contraseña." }, { status: 400 });
  }

  if (isLoginRateLimited(clientKey)) {
    return jsonResponse(
      { message: "Demasiados intentos. Espera unos minutos antes de volver a probar." },
      { status: 429 }
    );
  }

  const session = createAdminSession(body.password);

  if (!session.ok) {
    recordFailedLogin(clientKey);
    const message = session.reason === "missing-password" ? "No se puede iniciar sesión ahora." : "Contraseña incorrecta.";

    return jsonResponse({ message }, { status: session.reason === "missing-password" ? 500 : 401 });
  }

  clearFailedLogins(clientKey);

  return jsonResponse({
    token: session.token,
    expiresAt: session.expiresAt
  });
}
