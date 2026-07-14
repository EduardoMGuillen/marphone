import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductPurchase from "@/components/ProductPurchase";
import { getProduct } from "@/lib/product-store";
import { isProductSoldOut } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Producto | Marphone" };
  return {
    title: `${product.name} | Marphone`,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const soldOut = isProductSoldOut(product);

  return (
    <>
      <Header />
      <main className="flex-1 bg-white pt-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-2 md:gap-16 md:px-8 md:py-20">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-surface">
            <Image
              src={product.image}
              alt={product.name}
              fill
              quality={90}
              className={`object-cover ${soldOut ? "opacity-70" : ""}`}
              sizes="(max-width:768px) 100vw, 50vw"
              priority
            />
            {soldOut ? (
              <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white">
                Agotado
              </span>
            ) : null}
          </div>

          <div className="flex flex-col justify-center">
            <Link
              href="/#catalogo"
              className="mb-6 text-sm font-medium text-muted transition hover:text-foreground"
            >
              ← Volver al catálogo
            </Link>
            <p className="text-sm font-semibold tracking-wide text-brand-blue uppercase">
              {product.category} · {product.brand} · {product.series}
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-muted">{product.tagline}</p>
            <p className="mt-6 text-sm font-semibold text-foreground">
              Precio: <span className="text-brand-blue">{product.priceLabel}</span>
            </p>

            <div className="mt-8 space-y-5 border-t border-black/10 pt-8">
              {product.storage.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                    {product.category === "Teléfonos" || product.category === "Tablets"
                      ? "Almacenamiento"
                      : "Variantes"}
                  </p>
                  <p className="mt-2 text-sm">{product.storage.join(" · ")}</p>
                </div>
              ) : null}

              <ProductPurchase product={product} />

              {product.specs.length > 0 ? (
                <div className="border-t border-black/10 pt-5">
                  <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                    Detalles
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {product.specs.map((s) => (
                      <li key={s}>— {s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
