import { del, list, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Product } from "@/lib/products";

const CATALOG_PREFIX = "marphone/catalog/";
const UPLOADS_PREFIX = "marphone/uploads/";
const LEGACY_PATHS = ["catalog/products.json", "marphone/products.json"];
const KEEP_VERSIONS = 5;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export function isBlobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
  );
}

function blobAccess(): "public" {
  // Store Public obligatorio para que las fotos se vean en la tienda
  return "public";
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function readLocalCatalog(): Promise<Product[] | null> {
  try {
    const text = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? (parsed as Product[]) : null;
  } catch {
    return null;
  }
}

export async function writeLocalCatalog(products: Product[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf8");
}

async function listAllCatalogBlobs() {
  const blobs = [];
  let cursor: string | undefined;
  do {
    const page = await list({
      prefix: CATALOG_PREFIX,
      cursor,
      limit: 1000,
    });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

function sortNewestFirst(
  blobs: Array<{ pathname: string; uploadedAt?: Date; url: string }>,
) {
  return [...blobs].sort((a, b) => {
    const ta = a.uploadedAt?.getTime() ?? 0;
    const tb = b.uploadedAt?.getTime() ?? 0;
    if (tb !== ta) return tb - ta;
    return b.pathname.localeCompare(a.pathname);
  });
}

async function fetchJsonFromUrl(url: string): Promise<Product[] | null> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? (data as Product[]) : null;
}

async function readLegacyCatalog(): Promise<Product[] | null> {
  for (const pathname of LEGACY_PATHS) {
    try {
      const page = await list({ prefix: pathname, limit: 10 });
      const exact = page.blobs.find((b) => b.pathname === pathname);
      if (!exact) continue;
      const products = await fetchJsonFromUrl(exact.url);
      if (products) return products;
    } catch {
      // seguir con siguiente legacy
    }
  }
  return null;
}

/**
 * Lee el catálogo más reciente desde Blob (pathnames versionados).
 * `null` = aún no hay versiones (primera vez).
 * `[]` = catálogo vacío válido (no re-sembrar).
 */
export async function readBlobCatalog(): Promise<Product[] | null> {
  const blobs = sortNewestFirst(await listAllCatalogBlobs());
  if (blobs.length === 0) {
    return readLegacyCatalog();
  }

  for (const blob of blobs) {
    try {
      const products = await fetchJsonFromUrl(blob.url);
      if (products) return products;
    } catch {
      // probar versión anterior
    }
  }

  throw new Error("No se pudo leer el catálogo desde Blob");
}

async function pruneOldVersions(
  blobs: Array<{ url: string; pathname: string }>,
) {
  if (blobs.length <= KEEP_VERSIONS) return;
  const toDelete = blobs.slice(KEEP_VERSIONS).map((b) => b.url);
  if (toDelete.length === 0) return;
  try {
    await del(toDelete);
  } catch {
    // limpieza best-effort
  }
}

/**
 * Escribe una versión NUEVA del catálogo (no sobrescribe el mismo pathname).
 * Evita la caché CDN ~60s de overwrite en Vercel Blob.
 */
export async function writeBlobCatalog(products: Product[]) {
  const pathname = `${CATALOG_PREFIX}${Date.now()}-${randomId()}.json`;
  await put(pathname, JSON.stringify(products), {
    access: blobAccess(),
    addRandomSuffix: false,
    contentType: "application/json",
  });

  try {
    const blobs = sortNewestFirst(await listAllCatalogBlobs());
    await pruneOldVersions(blobs);
  } catch {
    // ok si falla el prune
  }
}

export async function uploadImageToBlob(
  filename: string,
  body: File | Buffer,
  contentType: string,
) {
  const pathname = `${UPLOADS_PREFIX}${filename}`;
  const blob = await put(pathname, body, {
    access: blobAccess(),
    addRandomSuffix: false,
    contentType,
  });
  return blob.url;
}

export async function uploadImageLocal(
  filename: string,
  buffer: Buffer,
): Promise<string> {
  await fs.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

export function blobMissingMessage() {
  return "Falta configurar Vercel Blob (BLOB_READ_WRITE_TOKEN o BLOB_STORE_ID). Crea un Blob Store Public en Storage → Blob y redespliega.";
}
