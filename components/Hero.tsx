"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { whatsappInterestUrl } from "@/lib/contact";

type Props = {
  heroImage?: string;
};

export default function Hero({ heroImage = "/products/iphone-17-pro-max.jpg" }: Props) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Smartphone premium Marphone"
          fill
          priority
          className="object-cover object-center opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-28 md:justify-center md:px-8 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="relative mb-8 h-12 w-56 md:h-14 md:w-72">
            <Image
              src="/brand/text.png"
              alt="Marphone"
              fill
              className="object-contain object-left"
              priority
              sizes="288px"
            />
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
            El próximo smartphone.
            <span className="block text-brand-blue">Hoy en Marphone.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/75 md:text-lg">
            Teléfonos, tablets, audífonos y accesorios. Compra fácil por
            WhatsApp o Instagram.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Explorar catálogo
            </a>
            <a
              href={whatsappInterestUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
