import { INSTAGRAM_URL, WHATSAPP_NUMBER } from "./constants";

/** Origen público de la tienda (WhatsApp / enlaces). */
export function getSiteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
}

export function productPageUrl(slug: string, origin = getSiteOrigin()) {
  const path = `/productos/${slug}`;
  const base = origin.replace(/\/$/, "");
  return base ? `${base}${path}` : path;
}

/**
 * Mensaje de interés por WhatsApp.
 * Si hay `productSlug`, incluye el enlace a la ficha del producto.
 */
export function whatsappInterestUrl(
  modelName?: string,
  colorName?: string,
  productSlug?: string,
) {
  let text = "Hola, estoy interesado en un modelo de Marphone";
  if (modelName && colorName) {
    text = `Hola, estoy interesado en este modelo: ${modelName} (color: ${colorName})`;
  } else if (modelName) {
    text = `Hola, estoy interesado en este modelo: ${modelName}`;
  }

  if (productSlug) {
    text += `\n\n${productPageUrl(productSlug)}`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function instagramUrl() {
  return INSTAGRAM_URL;
}
