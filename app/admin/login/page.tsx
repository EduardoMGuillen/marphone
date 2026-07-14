"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)]">
        <div className="relative mx-auto mb-6 h-10 w-44">
          <Image
            src="/brand/text.png"
            alt="Marphone"
            fill
            className="object-contain"
            sizes="176px"
            priority
          />
        </div>
        <h1 className="text-center font-display text-2xl font-semibold tracking-tight">
          Panel de administración
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Inicia sesión para gestionar el catálogo.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Usuario
            </span>
            <input
              className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Contraseña
            </span>
            <input
              type="password"
              className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-blue py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-muted">
          Cargando…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
