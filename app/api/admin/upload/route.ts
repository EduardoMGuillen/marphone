import { NextResponse } from "next/server";
import {
  blobMissingMessage,
  isBlobConfigured,
  uploadImageLocal,
  uploadImageToBlob,
} from "@/lib/blob-store";
import { slugify } from "@/lib/slugify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 4.5 * 1024 * 1024; // límite práctico en Vercel Server Uploads

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "La imagen no puede superar 4.5 MB" },
        { status: 400 },
      );
    }

    const ext =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "jpg";
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "producto";
    const filename = `${base}-${Date.now()}.${ext}`;
    const contentType = file.type || "image/jpeg";

    if (isBlobConfigured()) {
      const url = await uploadImageToBlob(filename, file, contentType);
      return NextResponse.json(
        { url },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: blobMissingMessage() },
        { status: 503 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImageLocal(filename, buffer);
    return NextResponse.json(
      { url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo subir la imagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
