"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="nosotros" className="bg-black text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm font-semibold tracking-wide text-brand-blue uppercase">
            Nosotros
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Marphone es tecnología con cara amigable.
          </h2>
          <p className="mt-5 text-white/70 md:text-lg">
            Somos una tienda de smartphones de alta gama en Honduras. Te ayudamos
            a elegir el modelo correcto y cierras la compra por WhatsApp o
            Instagram — simple, directo y humano.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <Image
            src="/brand/logo-complete.png"
            alt="Mascota y logo Marphone"
            fill
            className="object-contain"
            sizes="(max-width:768px) 90vw, 420px"
          />
        </motion.div>
      </div>
    </section>
  );
}
