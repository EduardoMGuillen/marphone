"use client";

import { useMemo, useState } from "react";
import { INSTAGRAM_HANDLE } from "@/lib/constants";
import { instagramUrl, whatsappInterestUrl } from "@/lib/contact";
import type { Product } from "@/lib/products";
import { availableColors, isProductSoldOut } from "@/lib/products";

type Props = {
  product: Product;
};

export default function ProductPurchase({ product }: Props) {
  const soldOut = isProductSoldOut(product);
  const inStockColors = useMemo(() => availableColors(product), [product]);
  const [selectedColor, setSelectedColor] = useState(
    inStockColors[0]?.name ?? "",
  );

  const whatsappHref = soldOut
    ? undefined
    : whatsappInterestUrl(
        product.name,
        selectedColor || undefined,
      );

  return (
    <>
      {product.colors.length > 0 ? (
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">
            Colores
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.colors.map((color) => {
              const colorGone = Boolean(product.soldOut || color.soldOut);
              const selected = selectedColor === color.name && !colorGone;
              return (
                <button
                  key={color.name}
                  type="button"
                  disabled={colorGone || soldOut}
                  onClick={() => setSelectedColor(color.name)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                    colorGone
                      ? "cursor-not-allowed border-black/5 text-muted line-through opacity-60"
                      : selected
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-black/10 hover:border-brand-blue hover:text-brand-blue"
                  }`}
                >
                  {color.name}
                  {colorGone ? " · Agotado" : ""}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {soldOut ? (
        <p className="mt-6 inline-flex rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-foreground">
          Producto agotado
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            Consultar por WhatsApp
          </a>
        ) : (
          <span className="rounded-full bg-black/10 px-6 py-3 text-sm font-semibold text-muted">
            No disponible
          </span>
        )}
        <a
          href={instagramUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold transition hover:border-brand-blue hover:text-brand-blue"
        >
          Instagram {INSTAGRAM_HANDLE}
        </a>
      </div>
      {!soldOut ? (
        <p className="mt-4 text-xs text-muted">
          Al tocar WhatsApp se abre un mensaje con el modelo
          {selectedColor ? ` y el color ${selectedColor}` : ""}.
        </p>
      ) : (
        <p className="mt-4 text-xs text-muted">
          Este producto no tiene stock ahora. Escríbenos por Instagram para
          alternativas.
        </p>
      )}
    </>
  );
}
