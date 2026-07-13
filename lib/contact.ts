import { INSTAGRAM_URL, WHATSAPP_NUMBER } from "./constants";

export function whatsappInterestUrl(modelName?: string) {
  const text = modelName
    ? `Hola, estoy interesado en este modelo: ${modelName}`
    : "Hola, estoy interesado en un modelo de Marphone";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function instagramUrl() {
  return INSTAGRAM_URL;
}
