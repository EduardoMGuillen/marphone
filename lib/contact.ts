import { INSTAGRAM_URL, WHATSAPP_NUMBER } from "./constants";

export function whatsappInterestUrl(modelName?: string, colorName?: string) {
  let text = "Hola, estoy interesado en un modelo de Marphone";
  if (modelName && colorName) {
    text = `Hola, estoy interesado en este modelo: ${modelName} (color: ${colorName})`;
  } else if (modelName) {
    text = `Hola, estoy interesado en este modelo: ${modelName}`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function instagramUrl() {
  return INSTAGRAM_URL;
}
