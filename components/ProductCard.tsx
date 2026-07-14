"use client";

import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM_HANDLE } from "@/lib/constants";
import { instagramUrl, whatsappInterestUrl } from "@/lib/contact";
import type { Product } from "@/lib/products";
import { isProductSoldOut } from "@/lib/products";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const soldOut = isProductSoldOut(product);
  const soldColorCount = product.colors.filter((c) => c.soldOut).length;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:border-black/15 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]">
      <Link
        href={`/productos/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          quality={85}
          className={`object-cover transition duration-500 group-hover:scale-[1.03] ${
            soldOut ? "opacity-60" : ""
          }`}
          sizes="(max-width:768px) 50vw, 25vw"
        />
        {soldOut ? (
          <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
            Agotado
          </span>
        ) : soldColorCount > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-foreground uppercase backdrop-blur">
            Stock parcial
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          {product.category} · {product.brand}
        </p>
        <Link href={`/productos/${product.slug}`} className="mt-1">
          <h3 className="font-display text-base font-semibold tracking-tight md:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted line-clamp-2">{product.tagline}</p>
        {product.colors.length > 0 ? (
          <p className="mt-2 text-xs text-muted">
            {product.colors.length} color
            {product.colors.length === 1 ? "" : "es"}
            {soldColorCount > 0 && !soldOut
              ? ` · ${soldColorCount} agotado${soldColorCount === 1 ? "" : "s"}`
              : ""}
          </p>
        ) : null}
        <p className="mt-3 text-sm font-semibold text-brand-blue">{product.priceLabel}</p>
        <div className="mt-4 flex flex-col gap-2">
          {soldOut ? (
            <Link
              href={`/productos/${product.slug}`}
              className="rounded-full bg-black/10 px-3 py-2 text-center text-xs font-semibold text-muted"
            >
              Ver detalle
            </Link>
          ) : (
            <a
              href={whatsappInterestUrl(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-blue px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-brand-blue-dark"
            >
              Consultar por WhatsApp
            </a>
          )}
          <a
            href={instagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-black/10 px-3 py-2 text-center text-xs font-semibold transition hover:border-brand-blue hover:text-brand-blue"
          >
            Instagram {INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </article>
  );
}
