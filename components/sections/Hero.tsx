import Image from "next/image";
import { ArrowDown, CalendarCheck } from "lucide-react";
import { businessInfo } from "@/data/site";
import { LinkButton } from "@/components/ui/Button";
import type { EditableBusinessInfo } from "@/types";

type HeroProps = {
  info?: EditableBusinessInfo;
};

export function Hero({ info = businessInfo }: HeroProps) {
  return (
    <section id="inicio" className="overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="min-w-0">
          <Image
            src={info.logo}
            alt={info.name}
            width={180}
            height={180}
            className="mb-5 h-24 w-24 rounded-full border border-rose/20 object-cover shadow-[0_12px_30px_rgba(78,53,43,0.12)] lg:hidden"
            priority
          />
          <p className="section-kicker">{info.tagline}</p>
          <h1 className="serif-heading mt-5 max-w-[16ch] break-words text-[clamp(1.8rem,7vw,4rem)] text-bark sm:max-w-2xl sm:text-[clamp(2.25rem,4.6vw,4.15rem)]">
            Porque su bienestar también se nota por fuera.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-cocoa/80">
            Atención personalizada, productos de calidad y mucho cariño para que cada visita sea
            una experiencia agradable.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="#citas">
              <CalendarCheck aria-hidden="true" size={18} />
              Pedir cita
            </LinkButton>
            <LinkButton href="#servicios" variant="secondary">
              Ver servicios
              <ArrowDown aria-hidden="true" size={17} />
            </LinkButton>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] min-w-0">
          <div className="absolute -left-5 top-8 hidden h-56 w-28 rounded-l-full border border-rose/40 md:block" />
          <div className="relative grid min-h-[360px] place-items-center rounded-[2rem] border border-rose/18 bg-cream/70 p-7 shadow-soft md:min-h-[440px] md:p-10">
            <Image
              src={info.logo}
              alt={`${info.name} logo`}
              width={560}
              height={560}
              className="h-auto w-full max-w-[430px]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
