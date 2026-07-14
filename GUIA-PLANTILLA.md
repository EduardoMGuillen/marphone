# Guía para replicar esta plantilla — tienda de electrónica

Esta guía describe el **formato**, **stack** y **archivos a tocar** cuando clones el patrón de **Marphone** (vitrina de electrónica + panel admin) para otro cliente o vertical similar (celulares, accesorios, audio, wearables, etc.).

## Qué es esta plantilla

Landing + catálogo de productos con:

- Compra / consulta por **WhatsApp** e **Instagram** (sin carrito online)
- **Panel admin** con usuario/contraseña para CRUD de productos e imágenes
- **Categorías** + **marcas**
- **Colores** con **sold out** por color o de todo el producto
- Sección de **ubicación** con mapa interactivo
- Hero con foto de producto en alta calidad (AVIF)
- Fotos reales de cada teléfono en el catálogo
- Persistencia en **Vercel Blob** para que crear / editar / borrar funcione en producción
- Footer con **Powered by Nexus Global**

## Stack

- **Next.js** (App Router) + **TypeScript** + **React**
- **Tailwind CSS** v4 (tokens en `app/globals.css`)
- **Framer Motion** (animación al entrar en viewport)
- **`next/font`** (Outfit + Space Grotesk)
- **`next/image`** (hero, brand, productos locales y URLs de Blob)
- **`@vercel/blob`** — catálogo JSON + uploads de imágenes en producción
- Fallback local: `data/products.json` + `public/uploads/` (desarrollo)
- Auth admin por cookie firmada + variables en **`.env.local`**
- Catálogo en Blob con **pathnames versionados** (`marphone/catalog/<timestamp>-<id>.json`) — no sobrescribir un solo JSON

## Prompt maestro (copiar en Cursor u otro asistente)

```
Quiero una vitrina de tienda de electrónica en Next.js (App Router) + React + TypeScript + Tailwind CSS + Framer Motion, estilo Marphone.

Modelo de negocio:
- Catálogo online; la venta se cierra por WhatsApp / Instagram (sin checkout).
- Admin con usuario y contraseña para agregar, editar y eliminar productos e imágenes.
- Productos con categoría, marca, colores (cada color puede ir sold out) y sold out de todo el producto.
- Sección de ubicación con mapa interactivo y dirección real.
- En Vercel: persistir CRUD e imágenes con Vercel Blob (BLOB_READ_WRITE_TOKEN).

Estructura de la landing:
1) Header fijo ligeramente oscurecido: logo, anclas (#destacados, #catalogo, #nosotros, #ubicacion, #contacto), Instagram + CTA WhatsApp, menú móvil.
2) Hero: brand dominante, titular corto, subtítulo, CTAs (catálogo + WhatsApp), fondo con imagen real de productos (AVIF/JPG alta calidad, edge-to-edge).
3) Destacados: grid de productos featured con foto real del modelo, tagline y CTA.
4) Catálogo: filtros primero por CATEGORÍA y luego por MARCA; cards con foto real object-contain, badge Agotado / Stock parcial.
5) Por qué nosotros / beneficios.
6) Nosotros.
7) Testimonios.
8) Ubicación: dirección + mapa embebido interactivo + Cómo llegar / Abrir en Google Maps.
9) CTA final (banda de marca) con WhatsApp e Instagram.
10) Footer: marca, enlaces, contacto/dirección, © año + "Powered by Nexus Global".

Admin (protegido):
- /admin/login → sesión cookie httpOnly
- /admin → listado con imagen, categoría, marca, estado de stock
- Crear / editar: categoría, marca libre, colores (agregar/quitar + sold out por color), sold out total, upload de imagen
- En producción el upload y el JSON del catálogo van a Vercel Blob
- Credenciales vía ADMIN_USERNAME, ADMIN_PASSWORD, AUTH_SECRET

Requisitos técnicos:
- Tipos Product / Category / ProductColor en lib/products.ts
- Store: `lib/blob-store.ts` (versiones Blob) + `lib/product-store.ts` (CRUD)
- API bajo /api/admin/*
- middleware protegiendo /admin y /api/admin (excepto login)
- Fotos reales del inventario (no stock genérico); hero en public/hero/
- Textos en español; tono comercial claro; reemplazar marca por [NOMBRE CLIENTE]
- Componentes en /components; page.tsx ensambla secciones
```

## Estructura de archivos clave

| Área | Ruta |
|------|------|
| Landing | `app/page.tsx` |
| Detalle producto | `app/productos/[slug]/page.tsx` |
| Admin login / listado / form | `app/admin/**` |
| APIs admin | `app/api/admin/**` |
| Auth + middleware | `lib/auth.ts`, `middleware.ts` |
| Catálogo / seed / Blob | `lib/blob-store.ts`, `lib/product-store.ts`, `lib/seed-products.ts`, `data/products.json` |
| Contacto / WhatsApp / tienda | `lib/constants.ts`, `lib/contact.ts` |
| Hero | `components/Hero.tsx` + `public/hero/iphones.avif` |
| Imágenes producto (semilla) | `public/products/[slug].jpg` |
| Brand | `public/brand/` |
| Ubicación | `components/Location.tsx` |

## Modelo de producto

```ts
type Category =
  | "Teléfonos" | "Tablets" | "Audífonos"
  | "Wearables" | "Accesorios" | "Otros";

type ProductColor = { name: string; soldOut?: boolean };

type Product = {
  slug: string;
  name: string;
  category: Category;
  brand: string;          // texto libre (Apple, Anker, JBL…)
  series: string;
  tagline: string;
  priceLabel: string;     // ej. "Consultar"
  storage: string[];      // variantes / capacidad
  colors: ProductColor[];
  specs: string[];
  featured?: boolean;
  soldOut?: boolean;      // agotado todo el producto
  image: string;          // /products/....jpg o URL de Vercel Blob
};
```

- **Sold out total:** `soldOut: true`
- **Sold out por color:** `colors[].soldOut: true`
- Si todos los colores están agotados, el producto se trata como agotado en la UI

## Checklist al adaptar otra tienda de electrónica

| Qué cambiar | Archivo habitual |
|-------------|------------------|
| SEO, título, locale | `app/layout.tsx` |
| Colores de marca | `app/globals.css` (`--brand-blue`, etc.) |
| WhatsApp, Instagram, dirección, coords | `lib/constants.ts` |
| Logos / favicon | `public/brand/` |
| Navegación (tono del header) | `components/Header.tsx` |
| Hero + imagen de fondo | `components/Hero.tsx`, `public/hero/` |
| Destacados / catálogo / cards | `components/Featured.tsx`, `Catalog.tsx`, `ProductCard.tsx` |
| Detalle + selector de color | `app/productos/[slug]/page.tsx`, `ProductPurchase.tsx` |
| Fotos reales por modelo | `public/products/` (+ uploads vía admin) |
| Nosotros / por qué / testimonios | `About.tsx`, `WhyMarphone.tsx`, `Testimonials.tsx` |
| Mapa y dirección | `components/Location.tsx` + `STORE_*` en constants |
| CTA WhatsApp / Instagram | `components/CtaBand.tsx` |
| Footer + Nexus | `components/Footer.tsx` |
| Categorías / marcas sugeridas / seed | `lib/seed-products.ts`, `data/products.json` |
| Credenciales admin + Blob | `.env.local` / Vercel Env |

## Admin

1. Variables locales (no se versionan; `.env*` está en `.gitignore`):

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=cambia-esta-clave
AUTH_SECRET=cambia-este-secreto-largo
# En Vercel se inyecta al crear el Blob Store:
# BLOB_READ_WRITE_TOKEN=...
```

2. Entra a `/admin/login`
3. Desde el dashboard: agregar / editar / quitar productos, subir imágenes, marcar colores o el producto como sold out

### Vercel (obligatorio para CRUD en producción)

En Vercel el filesystem es efímero: sin Blob, los cambios del admin **no se guardan**.

1. Proyecto → **Storage** → **Create** → **Blob**
2. Acceso **Public** (obligatorio para que las fotos se vean)
3. Conéctalo al proyecto (`BLOB_READ_WRITE_TOKEN` y/ o `BLOB_STORE_ID`)
4. Redespliega

#### Cómo se guarda el catálogo (importante)

**No** se sobrescribe un único `products.json`. Cada crear / editar / borrar escribe un archivo **nuevo**:

`marphone/catalog/<timestamp>-<id>.json`

Luego se lista el prefijo y se usa la versión **más reciente**. Se conservan unas pocas versiones viejas.

**Por qué:** al sobrescribir el mismo pathname, el CDN de Blob puede servir la versión anterior ~60s → productos que “vuelven”, catálogo vacío o lecturas stale.

| Entorno | Productos | Imágenes subidas |
|---------|-----------|------------------|
| **Vercel** (con token / store) | `marphone/catalog/*.json` (versiones) | `marphone/uploads/…` |
| **Local** (sin token) | `data/products.json` | `public/uploads/` |

Legacy: si aún existe `catalog/products.json` o `marphone/products.json`, se lee una vez y luego migra al esquema versionado.

Comportamiento (`lib/blob-store.ts` + `lib/product-store.ts`):

- Seed desde `data/products.json` **solo** si no hay ninguna versión en Blob
- Un catálogo vacío `[]` es válido: **no** se re-siembra
- Mutaciones API devuelven `{ product?, products }`; el admin aplica el catálogo desde la respuesta
- Esperar a que cierre el loading del panel antes de la siguiente acción
- Tras create/update/delete: `revalidatePath` de tienda + admin

#### Errores frecuentes

| Síntoma | Qué hacer |
|---------|-----------|
| Access denied | Blob **Public** + `BLOB_READ_WRITE_TOKEN` + Redeploy |
| Catálogo inconsistente al guardar seguido | Usar versiones (ya en `blob-store.ts`); no actuar hasta cerrar loading |
| Catálogo vacío tras borrar todo | Es válido; vuelve a agregar productos (no se recuperan solos) |
## Hero

- Archivo: `public/hero/iphones.avif` (línea iPhone / grupo de productos en alta calidad)
- Componente: `components/Hero.tsx` → constante `HERO_IMAGE = "/hero/iphones.avif"`
- Mostrar edge-to-edge con `object-cover`, overlay oscuro y brand + CTA encima
- Para otro cliente: sustituye el AVIF/JPG en `public/hero/` y actualiza la ruta en `Hero.tsx`
- Formatos recomendados: **AVIF** o **WebP/JPG** grandes (≥ 1600px de ancho)

## Imágenes de producto

- Usar **fotos reales de cada modelo** (renders oficiales / inventario), no stock genérico de Unsplash
- Semilla en `public/products/[slug].jpg` (ideal ≥ ~1200–1400px de alto para pantallas retina)
- Cards y detalle: `object-contain` sobre fondo `surface` para que el producto se vea completo
- Catálogo y admin comparten `product.image`
- Subidas nuevas desde el admin (`POST /api/admin/upload`) → en Vercel van a Blob `marphone/uploads/…`; en local a `/uploads/...`
- Brand: `/brand/text.png`, `/brand/logo-complete.png`, `/brand/pet.png`
- `next.config.ts` debe permitir remotePatterns de Unsplash (si aplica) y `*.public.blob.vercel-storage.com`

## Ubicación

Constantes en `lib/constants.ts`:

- `STORE_NAME`, `STORE_ADDRESS`, `STORE_CITY`, `STORE_COORDS`, `STORE_MAPS_QUERY`

Componente: mapa embebido (Google Maps) + botones **Cómo llegar** / **Abrir en Google Maps**. Ancla: `#ubicacion`.

## Powered by Nexus Global

En el footer:

<https://www.nexusglobalsuministros.com/>

Constante `NEXUS_URL` en `lib/constants.ts`. Conserva o adapta según el acuerdo comercial.

## Comandos útiles

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # comprobar que compila antes de desplegar
```

- Tienda: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
