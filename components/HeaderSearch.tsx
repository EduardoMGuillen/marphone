"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  inputClassName?: string;
  onSearched?: () => void;
};

export default function HeaderSearch({
  className,
  inputClassName,
  onSearched,
}: Props) {
  const router = useRouter();
  const inputId = useId();
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    const href = q
      ? `/?q=${encodeURIComponent(q)}#catalogo`
      : "/#catalogo";
    router.push(href);
    onSearched?.();

    window.setTimeout(() => {
      document
        .getElementById("catalogo")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  return (
    <form onSubmit={submit} className={className} role="search">
      <label htmlFor={inputId} className="sr-only">
        Buscar productos en el catálogo
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
    </form>
  );
}
