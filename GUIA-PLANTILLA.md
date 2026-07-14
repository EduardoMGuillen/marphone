# Guía para replicar esta plantilla — tienda de electrónica

Esta guía describe el **formato**, **stack** y **archivos a tocar** cuando clones el patrón de **Marphone** (vitrina de electrónica + panel admin) para otro cliente o vertical similar (celulares, consolas, audio, wearables, accesorios, etc.).

Referencia adicional del patrón Blob (floristería): `GUIA-PLANTILLA-roseluna.md`.

## Qué es esta plantilla

Landing + catálogo de productos con:

- Compra / consulta por **WhatsApp** e **Instagram** (sin carrito online)
- Mensaje de WhatsApp con **enlace a la ficha** del producto (`/productos/[slug]`)
- **Búsqueda en el header** con **desplegable** de resultados → clic abre la página del producto
- **Panel admin** con usuario/contraseña para CRUD de productos e imágenes
- **Categorías** (Teléfonos, Tablets, Consolas, Audífonos, Wearables, Accesorios, Otros) + **marcas**
- **Colores** con **sold out** por color o de todo el producto
- Catálogo con filtros por categoría y marca + query `?q=` desde la búsqueda
- Sección de **ubicación** con mapa interactivo
- Hero con foto de producto en alta calidad (AVIF)
- Fotos HD en `public/products/` (teléfonos, PS5, DualSense, Switch, JBL, AirPods, etc.)
- Persistencia en **Vercel Blob** (catálogo **versionado** + uploads)
- Bundles **one-shot** para meter productos nuevos del seed al Blob sin reaparecer si el admin los borra
- Footer oscuro + **Powered by Nexus Global**

## Stack

- **Next.js** (App Router) + **TypeScript** + **React**
- **Tailwind CSS** v4 (tokens en `app/globals.css`)
- **Framer Motion** (animación al entrar en viewport)
- **`next/font`** (Outfit + Space Grotesk)
- **`next/image`** (hero, brand, productos locales y URLs de Blob)
- **`@vercel/blob`** — catálogo JSON versionado + uploads en producción
- Fallback local: `data/products.json` + `public/uploads/` (desarrollo)
- Auth admin por cookie firmada + variables en **`.env.local`**
- Prefijos Blob: `marphone/catalog/`, `marphone/uploads/`, `marphone/meta/`

## Prompt maestro (copiar en Cursor u otro asistente)

```
Quiero una vitrina de tienda de electrónica en Next.js (App Router) + React + TypeScript + Tailwind CSS + Framer Motion, estilo Marphone.

Modelo de negocio:
- Catálogo online; la venta se cierra por WhatsApp / Instagram (sin checkout).
- Admin con usuario y contraseña para agregar, editar y eliminar productos e imágenes.
- Productos con categoría (incluye Consolas), marca, colores (sold out por color) y sold out total.
- WhatsApp debe incluir el enlace absoluto a /productos/[slug] (NEXT_PUBLIC_SITE_URL).
- Header con buscador: al escribir, desplegable con coincidencias; clic → página del producto.
- Sección de ubicación con mapa interactivo y dirección real.
- En Vercel: persistir CRUD e imágenes con Vercel Blob versionado (no sobrescribir un solo JSON).

Estructura de la landing:
1) Header fijo: logo, buscador con sugerencias, anclas (#destacados, #catalogo, #nosotros, #ubicacion, #contacto), Instagram + CTA WhatsApp, menú móvil + buscador en mobile.
2) Hero: brand dominante, titular corto, subtítulo, CTAs (catálogo + WhatsApp), fondo AVIF/JPG edge-to-edge.
3) Destacados: grid featured con foto object-contain, tagline y CTA WhatsApp (con enlace de producto).
4) Catálogo: filtros CATEGORÍA → MARCA; soporte ?q=; cards con badge Agotado / Stock parcial.
5) Por qué nosotros / beneficios.
6) Nosotros.
7) Testimonios.
8) Ubicación: dirección + mapa embebido + Cómo llegar / Abrir en Google Maps.
9) CTA final (banda de marca) con WhatsApp e Instagram.
10) Footer oscuro: marca, enlaces, contacto/dirección, © año + "Powered by Nexus Global".

Admin (protegido):
- /admin/login → sesión cookie httpOnly
- /admin → listado con imagen, categoría, marca, stock; aplica catálogo desde respuesta API
- Crear / editar: categoría, marca, colores + sold out, upload
- Mutaciones devuelven { product?, products }; esperar loading entre acciones
- Credenciales: ADMIN_USERNAME, ADMIN_PASSWORD, AUTH_SECRET
- Blob Public + BLOB_READ_WRITE_TOKEN / BLOB_STORE_ID

Requisitos técnicos:
- Tipos en lib/products.ts; seed en lib/seed-products.ts + data/products.json
- lib/blob-store.ts (versiones + uploads + markers) + lib/product-store.ts (CRUD + merge one-shot)
- lib/contact.ts → whatsappInterestUrl(name, color?, slug?) con URL del producto
- GET /api/products → índice ligero para el buscador del header
- HeaderSearch.tsx: combobox, teclado ↑↓ Enter Escape, clic → /productos/[slug]
- API /api/admin/*; middleware protege /admin y /api/admin (excepto login)
- Textos en español; reemplazar marca por [NOMBRE CLIENTE]
```

## Estructura de archivos clave

| Área | Ruta |
|------|------|
| Landing | `app/page.tsx` |
| Detalle producto | `app/productos/[slug]/page.tsx` |
| Admin login / listado / form | `app/admin/**` |
| APIs admin | `app/api/admin/**` |
| Índice público búsqueda | `app/api/products/route.ts` |
| Auth + middleware | `lib/auth.ts`, `middleware.ts` |
| Blob versionado + uploads | `lib/blob-store.ts` |
| CRUD catálogo | `lib/product-store.ts` |
| Seed / categorías / marcas | `lib/seed-products.ts`, `data/products.json` |
| WhatsApp + URL producto | `lib/contact.ts`, `lib/constants.ts` |
| Header + buscador | `components/Header.tsx`, `HeaderSearch.tsx` |
| Catálogo / destacados / cards | `Catalog.tsx`, `Featured.tsx`, `ProductCard.tsx` |
| Compra detalle (color + WA) | `components/ProductPurchase.tsx` |
| Hero | `components/Hero.tsx` + `public/hero/iphones.avif` |
| Imágenes semilla | `public/products/[slug].jpg` |
| Brand | `public/brand/` |
| Ubicación | `components/Location.tsx` |
| Footer | `components/Footer.tsx` |
| Config site URL + imágenes remotas | `next.config.ts` |

Al clonar para otro cliente: renombra prefijos Blob `marphone/` → `cliente/` en `lib/blob-store.ts`.

## Modelo de producto

```ts
type Category =
  | "Teléfonos"
  | "Tablets"
  | "Consolas"
  | "Audífonos"
  | "Wearables"
  | "Accesorios"
  | "Otros";

type ProductColor = { name: string; soldOut?: boolean };

type Product = {
  slug: string;
  name: string;
  category: Category;
  brand: string;          // texto libre (Apple, Sony, Nintendo, JBL…)
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
- Actualizar el orden de categorías en `Catalog.tsx` y `ALL_CATEGORIES` en el seed al añadir categorías nuevas

## Checklist al adaptar otra tienda

| Qué cambiar | Archivo habitual |
|-------------|------------------|
| SEO, título, locale | `app/layout.tsx` |
| Colores de marca | `app/globals.css` (`--brand-blue`, etc.) |
| WhatsApp, Instagram, dirección, coords | `lib/constants.ts` |
| URL pública (enlaces WhatsApp) | `NEXT_PUBLIC_SITE_URL` + `next.config.ts` |
| Logos / favicon | `public/brand/` |
| Header + búsqueda | `Header.tsx`, `HeaderSearch.tsx` |
| Hero + imagen de fondo | `Hero.tsx`, `public/hero/` |
| Destacados / catálogo / cards | `Featured.tsx`, `Catalog.tsx`, `ProductCard.tsx` |
| Detalle + selector de color + WA | `productos/[slug]`, `ProductPurchase.tsx` |
| Fotos por modelo | `public/products/` (+ uploads admin) |
| Nosotros / por qué / testimonios | `About.tsx`, `WhyMarphone.tsx`, `Testimonials.tsx` |
| Mapa y dirección | `Location.tsx` + `STORE_*` |
| CTA WhatsApp / Instagram | `CtaBand.tsx` |
| Footer oscuro + Nexus | `Footer.tsx` |
| Categorías / marcas / seed | `seed-products.ts`, `data/products.json` |
| Prefijos Blob | `lib/blob-store.ts` |
| Bundles one-shot seed→Blob | `SEED_MERGE_BUNDLES` en `product-store.ts` |
| Credenciales admin + Blob | `.env.local` / Vercel Env |

## Admin

1. Variables locales (no se versionan; `.env*` está en `.gitignore`):

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=cambia-esta-clave
AUTH_SECRET=cambia-este-secreto-largo

# URL pública (mensajes WhatsApp con enlace al producto):
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app

# En Vercel se inyectan al crear el Blob Store:
# BLOB_READ_WRITE_TOKEN=...
# BLOB_STORE_ID=...
```

2. Entra a `/admin/login`
3. Desde el dashboard: agregar / editar / quitar, subir imágenes, sold out por color o total
4. Tras un guardado exitoso, la API devuelve el catálogo completo; el listado lo aplica sin martillar lecturas
5. **Espera a que cierre el loading** antes de la siguiente acción

### Vercel (obligatorio para CRUD en producción)

En Vercel el filesystem es efímero: sin Blob, los cambios del admin **no se guardan**.

1. Proyecto → **Storage** → **Create** → **Blob**
2. Acceso **Public** (obligatorio para que las fotos se vean)
3. Conéctalo al proyecto (`BLOB_READ_WRITE_TOKEN` y / o `BLOB_STORE_ID`)
4. Define `NEXT_PUBLIC_SITE_URL` con el dominio final (recomendado)
5. Redespliega

#### Cómo se guarda el catálogo (importante)

**No** se sobrescribe un único `products.json`. Cada crear / editar / borrar escribe un archivo **nuevo**:

`marphone/catalog/<timestamp>-<id>.json`

Luego se lista el prefijo y se usa la versión **más reciente**. Se conservan unas pocas versiones viejas (`KEEP_VERSIONS` en `blob-store.ts`). Markers de merges: `marphone/meta/merged-<id>.json`.

**Por qué:** al sobrescribir el mismo pathname, el CDN de Blob puede servir la versión anterior ~60s → productos que “vuelven”, catálogo vacío o lecturas stale.

| Entorno | Productos | Imágenes subidas |
|---------|-----------|------------------|
| **Vercel** (con token / store) | `marphone/catalog/*.json` (versiones) | `marphone/uploads/…` |
| **Local** (sin token) | `data/products.json` | `public/uploads/` |

Legacy: si aún existe `catalog/products.json` o `marphone/products.json`, se lee una vez y luego migra al esquema versionado.

Comportamiento (`lib/blob-store.ts` + `lib/product-store.ts`):

- Seed desde `data/products.json` **solo** si no hay ninguna versión en Blob
- Un catálogo vacío `[]` es válido: **no** se re-siembra
- Mutaciones API: `{ product?, products }`
- Bundles one-shot (`SEED_MERGE_BUNDLES`): agregan slugs del seed **una sola vez** al Blob; tras escribir el marker, borrar un producto **no** lo vuelve a traer en redeploys
- Para nuevos packs de productos en un sitio ya desplegado: añade un bundle con **nuevo `id`** y los slugs, o cárgalos por admin

#### Errores frecuentes

| Síntoma | Qué hacer |
|---------|-----------|
| Access denied | Blob **Public** + `BLOB_READ_WRITE_TOKEN` + Redeploy |
| Catálogo inconsistente al guardar seguido | Versiones en `blob-store.ts`; no actuar hasta cerrar loading |
| Catálogo vacío tras borrar todo | Es válido; vuelve a agregar (no se recuperan solos) |
| Productos nuevos del seed no salen en Vercel | Blob ya existía: usa bundle one-shot o agrégalos en `/admin` |
| WhatsApp sin enlace absoluto | Define `NEXT_PUBLIC_SITE_URL` y redespliega |

## WhatsApp con enlace al producto

`lib/contact.ts`:

```ts
whatsappInterestUrl(modelName?, colorName?, productSlug?)
```

Si hay `productSlug`, el texto incluye:

```
Hola, estoy interesado en este modelo: … (color: …)

https://dominio/productos/slug
```

Usado en `ProductPurchase`, `ProductCard`, `Featured`.  
Origen: `NEXT_PUBLIC_SITE_URL`, o en build de Vercel `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` vía `next.config.ts`.

## Buscador del header

- UI: `components/HeaderSearch.tsx` (desktop en navbar + fila bajo el logo en mobile)
- Datos: `GET /api/products` (índice ligero: slug, name, brand, category, image…)
- Al escribir: desplegable (hasta 8), teclado ↑↓ / Enter / Escape
- Clic o Enter sobre una opción → `/productos/[slug]`
- Sin coincidencias + Enter → `/?q=…#catalogo` (filtra el catálogo)
- Catálogo: `Catalog.tsx` lee `q`, muestra “Resultados para…” y botón limpiar; `scroll-mt` para el header fijo
- **iOS / Safari:** el input debe usar al menos **16px** en mobile (`text-base md:text-sm`). Con `text-sm` (< 16px) Safari hace **zoom automático** al enfocar el campo

## Hero

- Archivo: `public/hero/iphones.avif`
- Componente: `components/Hero.tsx` → `HERO_IMAGE = "/hero/iphones.avif"`
- Edge-to-edge `object-cover`, overlay oscuro, brand + CTA
- Otro cliente: sustituye el AVIF/JPG y la ruta en `Hero.tsx`
- Formatos: **AVIF** o **WebP/JPG** ≥ 1600px de ancho

## Imágenes de producto

- Fotos HD por modelo en `public/products/[slug].jpg` (ideal ≥ ~1200–1400px)
- Incluye electrónica amplia: teléfonos, **consolas** (PS5, DualSense, Switch), **parlantes JBL**, **AirPods**, etc.
- Cards y detalle: `object-contain` sobre fondo `surface`
- Admin upload → Blob `marphone/uploads/…` o local `/uploads/...`
- Brand: `/brand/text.png`, `/brand/logo-complete.png`, `/brand/pet.png`
- `next.config.ts` → remotePatterns: Unsplash (si aplica) + `*.public.blob.vercel-storage.com`

## Ubicación

Constantes en `lib/constants.ts`:

- `STORE_NAME`, `STORE_ADDRESS`, `STORE_CITY`, `STORE_COORDS`, `STORE_MAPS_QUERY`

Componente: mapa embebido (Google Maps) + **Cómo llegar** / **Abrir en Google Maps**. Ancla: `#ubicacion`.

## Powered by Nexus Global

Footer oscuro (fondo negro, texto blanco para que el logo claro se lea):

<https://www.nexusglobalsuministros.com/>

Constante `NEXUS_URL` en `lib/constants.ts`.

## Comandos útiles

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # comprobar que compila antes de desplegar
```

- Tienda: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- Búsqueda API: `http://localhost:3000/api/products`
