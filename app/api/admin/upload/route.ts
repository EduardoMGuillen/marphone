import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { slugify } from "@/lib/slugify";

export const runtime = "nodejs";

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

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
        contentType: file.type || "image/jpeg",
      });
      return NextResponse.json({ url: blob.url });
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Falta BLOB_READ_WRITE_TOKEN. Crea un Blob Store en Vercel para subir imágenes.",
        },
        { status: 500 },
      );
    }

    // Desarrollo local sin Blob
    const dir = path.join(process.cwd(), "public", "products");
    await fs.mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), buffer);
    return NextResponse.json({ url: `/products/${filename}` });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo subir la imagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
