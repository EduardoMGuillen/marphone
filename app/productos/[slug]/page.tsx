import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { INSTAGRAM_HANDLE } from "@/lib/constants";
import { instagramUrl, whatsappInterestUrl } from "@/lib/contact";
import { getProduct, products } from "@/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Producto | Marphone" };
  return {
    title: `${product.name} | Marphone`,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

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
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <Link
              href="/#catalogo"
              className="mb-6 text-sm font-medium text-muted transition hover:text-foreground"
            >
              ← Volver al catálogo
            </Link>
            <p className="text-sm font-semibold tracking-wide text-brand-blue uppercase">
              {product.brand} · {product.series}
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-muted">{product.tagline}</p>
            <p className="mt-6 text-sm font-semibold text-foreground">
              Precio: <span className="text-brand-blue">{product.priceLabel}</span>
            </p>

            <div className="mt-8 space-y-5 border-t border-black/10 pt-8">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Almacenamiento
                </p>
                <p className="mt-2 text-sm">{product.storage.join(" · ")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Colores
                </p>
                <p className="mt-2 text-sm">{product.colors.join(" · ")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Destacados
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {product.specs.map((s) => (
                    <li key={s}>— {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={whatsappInterestUrl(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Consultar por WhatsApp
              </a>
              <a
                href={instagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold transition hover:border-brand-blue hover:text-brand-blue"
              >
                Instagram {INSTAGRAM_HANDLE}
              </a>
            </div>
            <p className="mt-4 text-xs text-muted">
              Al tocar WhatsApp se abre un mensaje: “Hola, estoy interesado en
              este modelo: {product.name}”
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
