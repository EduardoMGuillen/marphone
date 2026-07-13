import Image from "next/image";
import Link from "next/link";
import {
  INSTAGRAM_HANDLE,
  NEXUS_URL,
  WHATSAPP_DISPLAY,
} from "@/lib/constants";
import { instagramUrl, whatsappInterestUrl } from "@/lib/contact";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <div className="relative h-9 w-44">
            <Image
              src="/brand/text.png"
              alt="Marphone"
              fill
              className="object-contain object-left"
              sizes="176px"
            />
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted">
            Smartphones de alta gama en Honduras. Vitrina online, compra por
            WhatsApp e Instagram.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Explorar</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a href="/#destacados" className="hover:text-foreground">
                Destacados
              </a>
            </li>
            <li>
              <a href="/#catalogo" className="hover:text-foreground">
                Catálogo
              </a>
            </li>
            <li>
              <a href="/#nosotros" className="hover:text-foreground">
                Nosotros
              </a>
            </li>
            <li>
              <Link href="/#contacto" className="hover:text-foreground">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a
                href={whatsappInterestUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-blue"
              >
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={instagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-blue"
              >
                Instagram {INSTAGRAM_HANDLE}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {year} Marphone. Todos los derechos reservados.</p>
          <p>
            Powered by{" "}
            <a
              href={NEXUS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Nexus Global
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
