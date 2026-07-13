# Guía para replicar esta plantilla en otro proyecto o sector

Esta guía describe el **formato**, **stack** y **archivos a tocar** cuando clones el patrón de esta landing (Next.js + React + Tailwind + Framer Motion) para otro cliente o vertical.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** (paleta extendida en `tailwind.config.ts`)
- **Framer Motion** (animaciones ligeras al cargar y al hacer scroll)
- **`next/font`** (una fuente display + una sans)
- **`next/image`** para fotos (demo vía Unsplash en `lib/demo-images.ts`; sustituir en producción)

## Prompt maestro (copiar en Cursor u otro asistente)

```
Quiero una landing en Next.js (App Router) + React + TypeScript + Tailwind CSS + animaciones ligeras con Framer Motion, mismo patrón que una web de servicios profesionales premium.

Estructura obligatoria:
1) Header fijo: logo/nombre, navegación a anclas (#servicios, #sobre, #testimonios, #contacto), CTA principal, menú móvil.
2) Hero: titular en 2 líneas con acento en gradiente o color de marca, subtítulo, 2 botones (primario + secundario), bloque visual derecho (imagen optimizada con next/image o placeholder), 3 métricas o bullets de confianza.
3) Servicios: título de sección + grid de 4–6 tarjetas (icono, título, descripción corta), animación al entrar en viewport.
4) Sobre / propuesta de valor: 2 columnas (imagen + texto), lista con checks, opcional tarjeta flotante con dato clave.
5) Testimonios: 3 citas en cards con comillas y autor.
6) CTA final: banda con gradiente de marca, titular, texto corto, botones (tel/mail o formulario).
7) Footer: marca, descripción breve, enlaces rápidos, fila inferior con © año + enlace "Powered by Nexus Global" a https://www.nexusglobalsuministros.com/

Requisitos técnicos:
- Tipografías con next/font (una display + una sans).
- Paleta en tailwind.config (extend colors) alineada al sector del cliente.
- dark: coherente con prefers-color-scheme.
- Imágenes demo solo de fuentes con licencia clara (Unsplash) en lib/demo-images.ts + remotePatterns en next.config; comentario de sustituir en producción.
- Textos en español, tono profesional; reemplazar marca de ejemplo por [NOMBRE CLIENTE].
- Componentes en /components, página principal ensambla secciones.
```

## Checklist al adaptar otro sector

| Qué cambiar | Archivo habitual |
|-------------|------------------|
| Título, descripción SEO | `app/layout.tsx` |
| Paleta de marca | `tailwind.config.ts` (renombrar grupo de colores si aplica) |
| Navegación y CTA cabecera | `components/Header.tsx` |
| Titular, métricas, hero visual | `components/Hero.tsx` |
| Listado de servicios | `components/Services.tsx` |
| Historia, imagen lateral | `components/About.tsx` y `lib/demo-images.ts` |
| Testimonios | `components/Testimonials.tsx` |
| Contacto (tel, mail, dirección) | `components/CtaBand.tsx` |
| Pie, enlaces, powered by | `components/Footer.tsx` |
| Orden de secciones | `app/page.tsx` |

## Imágenes de demostración

- URLs centralizadas en `lib/demo-images.ts`.
- Licencia Unsplash: <https://unsplash.com/license>
- Antes de producción: sustituir por fotos del cliente o stock con licencia explícita.

## Powered by Nexus Global

En el footer del template hay un enlace **Powered by Nexus Global** hacia:

<https://www.nexusglobalsuministros.com/>

Si reutilizas el footer en otro repo, conserva o adapta esa constante (`NEXUS_URL` en `components/Footer.tsx`) según tu acuerdo comercial.

## Variante estilo “agencia” (tipo Nexus Global)

Si quieres acercarte a un sitio con **Proyectos**, **Proceso**, **Partners** y **formulario de contacto**, añade al prompt:

- Sección **Proyectos**: grid de casos con stack/tecnologías y enlace “Ver detalles”.
- Sección **Proceso**: pasos numerados (Descubrimiento → Diseño → Desarrollo → Lanzamiento) + bullets de compromiso.
- **Partners / logos**: carrusel o fila de logos en escala de grises.
- **Contacto**: formulario + email/redes; backend o servicio de envío según necesidad.

## Comandos útiles

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # comprobar que compila antes de desplegar
```
