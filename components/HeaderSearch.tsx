"use client";

import Image from "next/image";
import {
  FormEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type SearchProduct = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  series: string;
  tagline: string;
  image: string;
  soldOut?: boolean;
};

type Props = {
  className?: string;
  inputClassName?: string;
  onSearched?: () => void;
};

let cachedIndex: SearchProduct[] | null = null;
let cachePromise: Promise<SearchProduct[]> | null = null;

async function loadIndex(): Promise<SearchProduct[]> {
  if (cachedIndex) return cachedIndex;
  if (!cachePromise) {
    cachePromise = fetch("/api/products", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo cargar el catálogo");
        const data = (await res.json()) as SearchProduct[];
        cachedIndex = Array.isArray(data) ? data : [];
        return cachedIndex;
      })
      .catch((err) => {
        cachePromise = null;
        throw err;
      });
  }
  return cachePromise;
}

function matches(product: SearchProduct, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  const haystack = [
    product.name,
    product.brand,
    product.series,
    product.slug,
    product.tagline,
    product.category,
  ]
    .join(" ")
    .toLowerCase();
  return q
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export default function HeaderSearch({
  className,
  inputClassName,
  onSearched,
}: Props) {
  const router = useRouter();
  const inputId = useId();
  const listId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [products, setProducts] = useState<SearchProduct[]>(cachedIndex ?? []);
  const [ready, setReady] = useState(Boolean(cachedIndex));

  useEffect(() => {
    let cancelled = false;
    loadIndex()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const results = useMemo(() => {
    if (!value.trim()) return [];
    return products.filter((p) => matches(p, value)).slice(0, 8);
  }, [products, value]);

  const showDropdown = open && value.trim().length > 0;

  function goToProduct(slug: string) {
    setOpen(false);
    setValue("");
    onSearched?.();
    router.push(`/productos/${slug}`);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (results[active]) {
      goToProduct(results[active].slug);
      return;
    }
    if (results[0]) {
      goToProduct(results[0].slug);
      return;
    }
    // Sin coincidencia: mantener filtro en catálogo
    const q = value.trim();
    const href = q ? `/?q=${encodeURIComponent(q)}#catalogo` : "/#catalogo";
    setOpen(false);
    onSearched?.();
    router.push(href);
    window.setTimeout(() => {
      document
        .getElementById("catalogo")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  return (
    <form
      ref={rootRef}
      onSubmit={submit}
      className={`relative ${className ?? ""}`}
      role="search"
    >
      <label htmlFor={inputId} className="sr-only">
        Buscar productos en el catálogo
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="search"
          value={value}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && results[active]
              ? `${listId}-opt-${results[active].slug}`
              : undefined
          }
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!showDropdown || results.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => (i + 1) % results.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (i - 1 + results.length) % results.length);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Buscar productos…"
          autoComplete="off"
          className={
            inputClassName ??
            "w-full rounded-full border border-black/10 bg-white/80 py-2 pl-4 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand-blue"
          }
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-foreground/55 transition hover:bg-black/5 hover:text-brand-blue"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {showDropdown ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+0.4rem)] right-0 left-0 z-[60] max-h-80 overflow-auto rounded-2xl border border-black/8 bg-white py-1.5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.45)]"
        >
          {!ready ? (
            <li className="px-4 py-3 text-sm text-muted">Buscando…</li>
          ) : results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">
              Sin resultados. Enter para ver el catálogo.
            </li>
          ) : (
            results.map((product, index) => {
              const selected = index === active;
              return (
                <li key={product.slug} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    id={`${listId}-opt-${product.slug}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => goToProduct(product.slug)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                      selected ? "bg-brand-blue/10" : "hover:bg-black/[0.03]"
                    }`}
                  >
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-surface">
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        unoptimized={product.image.startsWith("http")}
                        className="object-contain p-1"
                        sizes="44px"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {product.name}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {product.brand} · {product.category}
                        {product.soldOut ? " · Agotado" : ""}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </form>
  );
}
