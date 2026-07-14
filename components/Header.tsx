"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { INSTAGRAM_HANDLE } from "@/lib/constants";
import { instagramUrl, whatsappInterestUrl } from "@/lib/contact";

const nav = [
  { href: "/#destacados", label: "Destacados" },
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#ubicacion", label: "Ubicación" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-18 md:px-8">
        <Link href="/" className="relative h-8 w-36 md:h-9 md:w-44" aria-label="Marphone">
          <Image
            src="/brand/text.png"
            alt="Marphone"
            fill
            className="object-contain object-left"
            priority
            sizes="180px"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={instagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground/70 transition hover:text-brand-blue"
          >
            {INSTAGRAM_HANDLE}
          </a>
          <a
            href={whatsappInterestUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menú</span>
          <div className="flex w-5 flex-col gap-1.5">
            <span className={`h-0.5 bg-black transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 bg-black transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 bg-black transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-white px-5 py-6 md:hidden">
          <nav className="flex flex-col gap-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={instagramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue"
            >
              Instagram {INSTAGRAM_HANDLE}
            </a>
            <a
              href={whatsappInterestUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-blue px-4 py-3 text-center font-semibold text-white"
            >
              Escribir por WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
