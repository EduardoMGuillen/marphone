import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { slugify } from "@/lib/slugify";

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

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La imagen no puede superar 5 MB" },
        { status: 400 },
      );
    }

    const ext =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "jpg";
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "producto";
    const filename = `${base}-${Date.now()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "products");
    await fs.mkdir(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ url: `/products/${filename}` });
  } catch {
    return NextResponse.json(
      { error: "No se pudo subir la imagen" },
      { status: 500 },
    );
  }
}
