"use client";

import { motion } from "framer-motion";
import {
  INSTAGRAM_HANDLE,
  WHATSAPP_DISPLAY,
} from "@/lib/constants";
import { instagramUrl, whatsappInterestUrl } from "@/lib/contact";

export default function CtaBand() {
  return (
    <section id="contacto" className="bg-brand-blue text-white">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            ¿Listo para tu próximo teléfono?
          </h2>
          <p className="mt-4 text-white/90 md:text-lg">
            Escríbenos y te respondemos con disponibilidad, colores y formas de
            pago. Sin carrito online — atención directa Marphone.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappInterestUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <a
              href={instagramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
            >
              Instagram {INSTAGRAM_HANDLE}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
