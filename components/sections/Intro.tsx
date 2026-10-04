import { trustPoints } from "@/data/site";

export function Intro() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="intro-title">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="section-kicker">Filosofía</p>
            <h2 id="intro-title" className="serif-heading mt-4 text-4xl text-bark md:text-6xl">
              Mucho más que una peluquería canina
            </h2>
          </div>
          <p className="text-lg leading-8 text-cocoa/78">
            En Anna & Fluffy&apos;s cuidamos cada detalle para que tu perro se sienta cómodo,
            seguro y bien atendido. Adaptamos cada sesión a su raza, tipo de pelo, edad y carácter,
            trabajando siempre con paciencia y respeto.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-rose/18 bg-rose/18 md:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => (
            <article key={point.title} className="bg-cream p-6">
              <point.icon aria-hidden="true" className="mb-5 text-rose" size={25} strokeWidth={1.8} />
              <h3 className="text-lg font-semibold text-bark">{point.title}</h3>
              <p className="mt-3 text-sm leading-6 text-cocoa/75">{point.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
