import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

type RouteContext = {
  params: Promise<{
    file: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { file } = await context.params;

  if (!/^[a-zA-Z0-9._-]+$/.test(file)) {
    return NextResponse.json({ message: "Archivo no válido." }, { status: 400 });
  }

  const extension = path.extname(file).toLowerCase();
  const contentType = contentTypes[extension];

  if (!contentType) {
    return NextResponse.json({ message: "Formato no permitido." }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "uploads", file);
    const image = await readFile(filePath);

    return new NextResponse(image, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType
      }
    });
  } catch {
    return NextResponse.json({ message: "Imagen no encontrada." }, { status: 404 });
  }
}
