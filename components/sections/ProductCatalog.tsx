import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { productHighlights, products } from "@/data/site";
import type { Product } from "@/types";

type ProductCatalogProps = {
  items?: Product[];
};

export function ProductCatalog({ items = products }: ProductCatalogProps) {
  const featuredProducts = items.filter((product) => product.featured).slice(0, 3);
  const visibleProducts = featuredProducts.length > 0 ? featuredProducts : items.slice(0, 3);

  return (
    <section id="catalogo" className="scroll-mt-24 py-16 md:py-24" aria-labelledby="catalog-title">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="section-kicker">Tienda</p>
            <h2 id="catalog-title" className="serif-heading mt-4 text-4xl text-bark md:text-6xl">
              Alimentación y cuidados para casa
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {productHighlights.map((item) => (
              <article key={item.title} className="border border-rose/18 bg-white/48 p-5">
                <item.icon aria-hidden="true" className="text-rose" size={22} />
                <h3 className="mt-4 font-semibold text-bark">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-cocoa/72">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-rose/18 bg-rose/18 md:grid-cols-3">
          {visibleProducts.map((product) => (
            <article key={product.id} className="bg-cream p-5">
              <div className="relative aspect-[4/3] overflow-hidden bg-white/58">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 340px, (min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-rose">
                    {product.category}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-bark">{product.name}</h3>
                </div>
                <ShoppingBag aria-hidden="true" className="shrink-0 text-rose" size={23} strokeWidth={1.8} />
              </div>
              <p className="mt-4 min-h-[72px] text-sm leading-6 text-cocoa/75">{product.description}</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-rose/14 pt-4">
                <div>
                  <p className="text-lg font-bold text-bark">{product.price}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-taupe">
                    {product.size}
                  </p>
                </div>
                <span className="rounded-full bg-linen px-3 py-1 text-xs font-bold text-cocoa">
                  {product.available ? "Disponible" : "Bajo pedido"}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/catalogo"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-bark px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_10px_28px_rgba(47,33,28,0.18)] transition hover:-translate-y-0.5 hover:bg-cocoa"
          >
            Ver todo el catálogo
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
