import { Star } from "lucide-react";
import { testimonials } from "@/data/site";
import type { Testimonial } from "@/types";

type ReviewsProps = {
  items?: Testimonial[];
};

export function Reviews({ items = testimonials }: ReviewsProps) {
  return (
    <section className="py-16 md:py-24" aria-labelledby="reviews-title">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="section-kicker">Confianza</p>
          <h2 id="reviews-title" className="serif-heading mt-4 text-4xl text-bark md:text-6xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 text-sm leading-6 text-cocoa/70">
            Testimonios de muestra para sustituir por opiniones verificadas antes de producción.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map((testimonial, index) => (
            <figure key={`${testimonial.name}-${index}`} className="border border-rose/18 bg-white/48 p-6">
              <div className="flex gap-1 text-rose" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((item) => (
                  <Star key={item} size={16} fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-5 text-base leading-7 text-cocoa/84">
                “{testimonial.copy}”
              </blockquote>
              <figcaption className="mt-6 text-sm font-bold text-bark">{testimonial.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
