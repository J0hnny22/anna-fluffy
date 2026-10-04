"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import { businessInfo, navItems } from "@/data/site";
import { LinkButton } from "@/components/ui/Button";
import type { EditableBusinessInfo } from "@/types";

type HeaderProps = {
  info?: EditableBusinessInfo;
};

export function Header({ info = businessInfo }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rose/15 bg-cream shadow-[0_6px_24px_rgba(78,53,43,0.04)]">
      <div className="section-shell flex min-h-[76px] items-center justify-between gap-5">
        <Link href="/#inicio" className="flex items-center gap-3" aria-label={`${info.name} inicio`}>
          <Image
            src={info.logo}
            alt={info.name}
            width={92}
            height={92}
            className="h-14 w-14 rounded-full object-contain"
            priority
          />
          <span className="hidden text-sm font-semibold uppercase tracking-[0.22em] text-cocoa sm:block">
            Grooming
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href.startsWith("#") ? `/${item.href}` : item.href}
              className="text-sm font-medium text-cocoa/85 transition hover:text-bark"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <LinkButton href="/#citas">Pedir cita</LinkButton>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="#citas"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-bark px-4 text-sm font-semibold text-cream"
          >
            <CalendarCheck aria-hidden="true" size={15} />
            Cita
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose/25 text-bark"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-rose/15 bg-cream lg:hidden">
          <nav className="section-shell grid py-4" aria-label="Navegación móvil">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                className="border-b border-rose/10 py-3 text-base font-medium text-cocoa"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <LinkButton href="/#citas" className="mt-4" onClick={() => setOpen(false)}>
              Pedir cita
            </LinkButton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
