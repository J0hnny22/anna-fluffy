import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase-admin";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);
const maxFileSize = 5 * 1024 * 1024;

export const runtime = "nodejs";

function jsonResponse(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  if (!requireAdminSession(request)) {
    return jsonResponse({ message: "Sesión no válida o caducada." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return jsonResponse({ message: "No se ha recibido ninguna imagen." }, { status: 400 });
  }

  const extension = allowedTypes.get(file.type);

  if (!extension) {
    return jsonResponse({ message: "Formato no permitido. Usa JPG, PNG o WEBP." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return jsonResponse({ message: "La imagen supera los 5 MB." }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}-${randomBytes(8).toString("hex")}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const bucket = process.env.SUPABASE_ASSETS_BUCKET ?? "site-assets";

    if (supabase) {
      const { error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false
      });

      if (error) {
        return jsonResponse({ message: error.message }, { status: 500 });
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

      return jsonResponse({
        imageUrl: data.publicUrl
      });
    }
  }

  const filePath = path.join(uploadsDir, fileName);

  await writeFile(filePath, buffer);

  return jsonResponse({
    imageUrl: `/uploads/${fileName}`
  });
}
