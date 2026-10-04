import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getEditableContent, saveEditableContent } from "@/lib/content";
import type { EditableContent } from "@/types";

function unauthorized() {
  return NextResponse.json({ message: "Sesión no válida o caducada." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!requireAdminSession(request)) {
    return unauthorized();
  }

  return NextResponse.json(await getEditableContent());
}

export async function PUT(request: NextRequest) {
  if (!requireAdminSession(request)) {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as EditableContent | null;

  if (!body?.businessInfo || !Array.isArray(body.products) || !Array.isArray(body.services)) {
    return NextResponse.json({ message: "Contenido no válido." }, { status: 400 });
  }

  return NextResponse.json(await saveEditableContent(body));
}
