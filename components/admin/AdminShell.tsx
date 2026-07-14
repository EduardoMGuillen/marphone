"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function AdminShell({ title, children }: Props) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="relative h-8 w-36">
              <Image
                src="/brand/text.png"
                alt="Marphone"
                fill
                className="object-contain object-left"
                sizes="144px"
              />
            </Link>
            <div className="hidden h-6 w-px bg-black/10 sm:block" />
            <div>
              <p className="text-xs font-semibold tracking-wide text-brand-blue uppercase">
                Admin
              </p>
              <h1 className="font-display text-lg font-semibold tracking-tight">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold transition hover:border-black/25"
            >
              Ver tienda
            </Link>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-blue disabled:opacity-60"
            >
              {loggingOut ? "Saliendo…" : "Cerrar sesión"}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
