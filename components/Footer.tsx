import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { businessInfo, navItems } from "@/data/site";
import type { EditableBusinessInfo } from "@/types";

type FooterProps = {
  info?: EditableBusinessInfo;
};

export function Footer({ info = businessInfo }: FooterProps) {
  return (
    <footer className="border-t border-rose/18 bg-cream py-12">
      <div className="section-shell grid gap-8 md:grid-cols-[1.1fr_0.9fr_0.8fr]">
        <div>
          <Image
            src={info.logo}
            alt={info.name}
            width={180}
            height={180}
            className="h-auto w-36"
          />
          <p className="mt-4 max-w-sm text-sm leading-6 text-cocoa/72">{info.description}</p>
        </div>
        <nav aria-label="Navegación secundaria" className="grid content-start gap-3 text-sm">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href.startsWith("#") ? `/${item.href}` : item.href}
              className="font-semibold text-cocoa hover:text-bark"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="text-sm text-cocoa/75">
          <p className="font-semibold text-bark">{info.phone}</p>
          <p className="mt-2">{info.email}</p>
          <a
            href={`https://wa.me/${info.whatsapp.replace(/\D/g, "")}`}
            className="mt-4 inline-flex items-center gap-2 font-bold text-rose hover:text-bark"
          >
            <MessageCircle aria-hidden="true" size={17} />
            WhatsApp
          </a>
          <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link href="/aviso-legal" className="hover:text-bark">
              Aviso legal
            </Link>
            <Link href="/politica-privacidad" className="hover:text-bark">
              Política de privacidad
            </Link>
            <Link href="/politica-cookies" className="hover:text-bark">
              Política de cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
