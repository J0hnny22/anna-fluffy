import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getEditableContent, saveEditableContent } from "@/lib/content";
import type { EditableContent } from "@/types";

export const runtime = "nodejs";

function jsonResponse(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function unauthorized() {
  return jsonResponse({ message: "Sesión no válida o caducada." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!requireAdminSession(request)) {
    return unauthorized();
  }

  return jsonResponse(await getEditableContent());
}

export async function PUT(request: NextRequest) {
  if (!requireAdminSession(request)) {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as EditableContent | null;

  if (!body?.businessInfo || !Array.isArray(body.products) || !Array.isArray(body.services)) {
    return jsonResponse({ message: "Contenido no válido." }, { status: 400 });
  }

  return jsonResponse(await saveEditableContent(body));
}
