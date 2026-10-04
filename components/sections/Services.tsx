import { services } from "@/data/site";
import type { Service } from "@/types";

type ServicesProps = {
  servicesList?: Service[];
};

export function Services({ servicesList = services }: ServicesProps) {
  return (
    <section id="servicios" className="scroll-mt-24 bg-white/38 py-16 md:py-24" aria-labelledby="services-title">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">Servicios</p>
            <h2 id="services-title" className="serif-heading mt-4 text-4xl text-bark md:text-6xl">
              Cuidados claros, sin prisas
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-cocoa/72">
            Precios editables y orientativos. La tarifa final se confirma según tamaño, manto y
            estado del pelo.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servicesList.map((service) => (
            <article
              key={service.id}
              className="group border border-rose/18 bg-cream p-6 transition hover:-translate-y-1 hover:border-rose/35 hover:bg-white/65"
            >
              <div className="flex items-start justify-between gap-5">
                <service.icon aria-hidden="true" className="text-rose" size={27} strokeWidth={1.8} />
                <span className="rounded-full bg-linen px-3 py-1 text-xs font-semibold text-cocoa">
                  {service.priceFrom}
                </span>
              </div>
              <h3 className="mt-7 text-xl font-semibold text-bark">{service.name}</h3>
              <p className="mt-3 min-h-[72px] text-sm leading-6 text-cocoa/75">{service.description}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-taupe">
                {service.durationMinutes} min aprox.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
