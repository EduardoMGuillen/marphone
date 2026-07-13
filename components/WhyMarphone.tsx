"use client";

import { motion } from "framer-motion";

const points = [
  {
    title: "Originales y verificados",
    body: "Trabajamos modelos de alta gama con garantía y soporte claro al comprar.",
  },
  {
    title: "Asesoría personal",
    body: "Te guiamos por WhatsApp o Instagram para elegir almacenamiento, color y presupuesto.",
  },
  {
    title: "Sin fricción online",
    body: "La web es tu vitrina. Cierras la compra directo con el equipo Marphone.",
  },
  {
    title: "Stock de flagships",
    body: "iPhone 17, Galaxy Ultra, Pixel Pro y más referencias premium disponibles.",
  },
];

export default function WhyMarphone() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 text-sm font-semibold tracking-wide text-brand-blue uppercase">
            Por qué Marphone
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Compra premium, trato cercano.
          </h2>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {points.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <p className="font-display text-sm font-semibold text-brand-blue">
                0{i + 1}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
