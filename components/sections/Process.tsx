import { processSteps } from "@/data/site";

export function Process() {
  return (
    <section id="proceso" className="scroll-mt-24 py-16 md:py-24" aria-labelledby="process-title">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="section-kicker">Cómo trabajamos</p>
          <h2 id="process-title" className="serif-heading mt-4 text-4xl text-bark md:text-6xl">
            Así cuidamos de ellos
          </h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <article key={step.title} className="relative border-l border-rose/35 pl-6">
              <span className="absolute -left-4 top-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blush text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="pt-10 text-xl font-semibold text-bark">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-cocoa/75">{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
