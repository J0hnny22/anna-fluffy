import { faqs } from "@/data/site";

export function Faq() {
  return (
    <section className="bg-white/36 py-16 md:py-24" aria-labelledby="faq-title">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="section-kicker">Preguntas frecuentes</p>
          <h2 id="faq-title" className="serif-heading mt-4 text-4xl text-bark md:text-6xl">
            Antes de venir
          </h2>
        </div>
        <div className="divide-y divide-rose/18 border-y border-rose/18">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold text-bark">
                {faq.question}
                <span className="text-2xl leading-none text-rose transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-cocoa/75">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
