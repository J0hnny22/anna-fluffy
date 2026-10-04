"use client";

import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/types";

type CatalogClientProps = {
  products: Product[];
};

export function CatalogClient({ products }: CatalogClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [availability, setAvailability] = useState("Todos");

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );

  const filteredProducts = products.filter((product) => {
    const searchable = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    const matchesQuery = searchable.includes(query.trim().toLowerCase());
    const matchesCategory = category === "Todos" || product.category === category;
    const matchesAvailability =
      availability === "Todos" ||
      (availability === "Disponible" && product.available) ||
      (availability === "Bajo pedido" && !product.available);

    return matchesQuery && matchesCategory && matchesAvailability;
  });

  return (
    <section className="bg-white/35 py-12 md:py-16">
      <div className="section-shell">
        <div className="border border-rose/18 bg-cream p-4 md:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
            <label className="relative block">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose"
                size={18}
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar producto"
                className="min-h-12 w-full border border-rose/20 bg-white/70 pl-11 pr-4 text-sm text-bark placeholder:text-cocoa/45"
              />
            </label>
            <label className="relative block">
              <SlidersHorizontal
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose"
                size={18}
              />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="min-h-12 w-full appearance-none border border-rose/20 bg-white/70 pl-11 pr-4 text-sm font-semibold text-bark"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              className="min-h-12 w-full border border-rose/20 bg-white/70 px-4 text-sm font-semibold text-bark"
            >
              <option>Todos</option>
              <option>Disponible</option>
              <option>Bajo pedido</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="border border-rose/18 bg-cream p-5 transition hover:-translate-y-1 hover:border-rose/35 hover:bg-white/60"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-white/58">
                <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width: 1024px) 330px, 50vw" className="object-cover" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-rose">{product.category}</p>
              <h2 className="mt-2 text-xl font-semibold text-bark">{product.name}</h2>
              <p className="mt-3 min-h-[72px] text-sm leading-6 text-cocoa/75">{product.description}</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-rose/14 pt-4">
                <div>
                  <p className="text-lg font-bold text-bark">{product.price}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-taupe">{product.size}</p>
                </div>
                <span className="rounded-full bg-linen px-3 py-1 text-xs font-bold text-cocoa">
                  {product.available ? "Disponible" : "Bajo pedido"}
                </span>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-8 border border-rose/18 bg-cream p-8 text-center text-sm font-semibold text-cocoa">
            No hay productos que coincidan con esos filtros.
          </div>
        ) : null}
      </div>
    </section>
  );
}
