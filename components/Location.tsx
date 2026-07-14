"use client";

import { motion } from "framer-motion";
import {
  STORE_ADDRESS,
  STORE_CITY,
  STORE_COORDS,
  STORE_MAPS_QUERY,
  STORE_NAME,
} from "@/lib/constants";

const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_MAPS_QUERY)}`;
const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(STORE_MAPS_QUERY)}&z=16&output=embed`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${STORE_COORDS.lat},${STORE_COORDS.lng}`;

export default function Location() {
  return (
    <section id="ubicacion" className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-2xl"
        >
          <p className="mb-3 text-sm font-semibold tracking-wide text-brand-blue uppercase">
            Ubicación
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Visítanos en {STORE_NAME}.
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            Estamos en San Pedro Sula. Usa el mapa para explorar la zona o pedir
            indicaciones.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-stretch"
        >
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">
              Dirección
            </p>
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {STORE_NAME}
            </p>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted md:text-lg">
              {STORE_ADDRESS}
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">{STORE_CITY}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Cómo llegar
              </a>
              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold transition hover:border-brand-blue hover:text-brand-blue"
              >
                Abrir en Google Maps
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-surface shadow-[0_30px_80px_-50px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
            <iframe
              title={`Mapa de Marphone en ${STORE_NAME}`}
              src={mapsEmbedUrl}
              className="h-[320px] w-full border-0 md:h-[420px] lg:h-full lg:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
