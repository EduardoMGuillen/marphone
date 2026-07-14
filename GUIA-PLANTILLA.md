# Guía para replicar esta plantilla — tienda de electrónica

Esta guía describe el **formato**, **stack** y **archivos a tocar** cuando clones el patrón de **Marphone** (vitrina de electrónica + panel admin) para otro cliente o vertical similar (celulares, accesorios, audio, wearables, etc.).

## Qué es esta plantilla

Landing + catálogo de productos con:

- Compra / consulta por **WhatsApp** e **Instagram** (sin carrito online)
- **Panel admin** con usuario/contraseña para CRUD de productos e imágenes
- **Categorías** + **marcas**
- **Colores** con **sold out** por color o de todo el producto
- Sección de **ubicación** con mapa interactivo
- Footer con **Powered by Nexus Global**

## Stack

- **Next.js** (App Router) + **TypeScript** + **React**
- **Tailwind CSS** v4 (tokens en `app/globals.css`)
- **Framer Motion** (animación al entrar en viewport)
- **`next/font`** (Outfit + Space Grotesk)
- **`next/image`** (fotos locales en `public/products/` y brand en `public/brand/`)
- Persistencia de catálogo en **`data/products.json`**
- Auth admin por cookie firmada + variables en **`.env.local`**

## Prompt maestro (copiar en Cursor u otro asistente)

```
Quiero una vitrina de tienda de electrónica en Next.js (App Router) + React + TypeScript + Tailwind CSS + Framer Motion, estilo Marphone.

Modelo de negocio:
- Catálogo online; la venta se cierra por WhatsApp / Instagram (sin checkout).
- Admin con usuario y contraseña para agregar, editar y eliminar productos e imágenes.
- Productos con categoría, marca, colores (cada color puede ir sold out) y sold out de todo el producto.
- Sección de ubicación con mapa interactivo y dirección real.

Estructura de la landing:
1) Header fijo: logo, anclas (#destacados, #catalogo, #nosotros, #ubicacion, #contacto), Instagram + CTA WhatsApp, menú móvil.
2) Hero: brand dominante, titular corto, subtítulo, CTAs (catálogo + WhatsApp), imagen de producto destacado de fondo.
3) Destacados: grid de productos featured con foto real, tagline y CTA.
4) Catálogo: filtros primero por CATEGORÍA y luego por MARCA; cards con badge Agotado / Stock parcial.
5) Por qué nosotros / beneficios.
6) Nosotros.
7) Testimonios.
8) Ubicación: dirección + mapa embebido interactivo + Cómo llegar / Abrir en Google Maps.
9) CTA final (banda de marca) con WhatsApp e Instagram.
10) Footer: marca, enlaces, contacto/dirección, © año + "Powered by Nexus Global".

Admin (protegido):
- /admin/login → sesión cookie httpOnly
- /admin → listado con imagen, categoría, marca, estado de stock
- Crear / editar: categoría, marca libre, colores (agregar/quitar + sold out por color), sold out total, upload de imagen a /public/products
- Credenciales vía ADMIN_USERNAME, ADMIN_PASSWORD, AUTH_SECRET

Requisitos técnicos:
- Tipos Product / Category / ProductColor en lib/products.ts
- Store en lib/product-store.ts + data/products.json
- API bajo /api/admin/*
- middleware protegiendo /admin y /api/admin (excepto login)
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
| Catálogo / seed | `lib/product-store.ts`, `lib/seed-products.ts`, `data/products.json` |
| Contacto / WhatsApp | `lib/constants.ts`, `lib/contact.ts` |
| Imágenes producto | `public/products/` |
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
  image: string;          // /products/....jpg
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
| Navegación | `components/Header.tsx` |
| Hero | `components/Hero.tsx` |
| Destacados / catálogo / cards | `components/Featured.tsx`, `Catalog.tsx`, `ProductCard.tsx` |
| Detalle + selector de color | `app/productos/[slug]/page.tsx`, `ProductPurchase.tsx` |
| Nosotros / por qué / testimonios | `About.tsx`, `WhyMarphone.tsx`, `Testimonials.tsx` |
| Mapa y dirección | `components/Location.tsx` + `STORE_*` en constants |
| CTA WhatsApp / Instagram | `components/CtaBand.tsx` |
| Footer + Nexus | `components/Footer.tsx` |
| Categorías / marcas sugeridas / seed | `lib/seed-products.ts`, `data/products.json` |
| Credenciales admin | `.env.local` |

## Admin

1. Copia `.env.local` (no se versiona; `.env*` está en `.gitignore`):

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=cambia-esta-clave
AUTH_SECRET=cambia-este-secreto-largo
```

2. Entra a `/admin/login`
3. Desde el dashboard: agregar / editar / quitar productos, subir imágenes, marcar colores o el producto como sold out

**Nota de hosting:** `data/products.json` y uploads en `public/products/` persisten en disco local/VPS. En serverless efímero (ej. algunos planes de Vercel) conviene Blob/DB; el contrato de `Product` se mantiene.

## Imágenes de producto

- Catálogo y admin usan la misma ruta `product.image` (normalmente `/products/[slug].jpg`)
- Subir desde el form del admin (`POST /api/admin/upload`)
- Semilla / fotos iniciales en `public/products/`
- Brand: `/brand/text.png`, `/brand/logo-complete.png`, `/brand/pet.png`

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
