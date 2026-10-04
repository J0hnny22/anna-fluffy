import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!body?.password) {
    return NextResponse.json({ message: "Introduce la contraseña." }, { status: 400 });
  }

  const session = createAdminSession(body.password);

  if (!session.ok) {
    const message =
      session.reason === "missing-password"
        ? "Falta configurar ADMIN_PASSWORD en el servidor."
        : "Contraseña incorrecta.";

    return NextResponse.json({ message }, { status: session.reason === "missing-password" ? 500 : 401 });
  }

  return NextResponse.json({
    token: session.token,
    expiresAt: session.expiresAt
  });
}
