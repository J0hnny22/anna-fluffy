import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const content = await getSiteContent();

  return (
    <>
      <Header info={content.businessInfo} />
      <main>
        <section className="py-14 md:py-20">
          <div className="section-shell">
            <Link href="/#catalogo" className="inline-flex items-center gap-2 text-sm font-bold text-rose hover:text-bark">
              <ArrowLeft aria-hidden="true" size={17} />
              Volver a la tienda
            </Link>
            <p className="section-kicker mt-8">Catálogo completo</p>
            <div className="mt-4 grid gap-5 lg:grid-cols-[0.9fr_0.55fr] lg:items-end">
              <h1 className="serif-heading text-5xl text-bark md:text-7xl">
                Productos para cuidarles también en casa
              </h1>
              <p className="text-sm leading-6 text-cocoa/72">
                Busca por categoría, disponibilidad o nombre. Las imágenes son provisionales para
                previsualizar el catálogo antes de subir fotografías reales.
              </p>
            </div>
          </div>
        </section>
        <CatalogClient products={content.products} />
      </main>
      <Footer info={content.businessInfo} />
    </>
  );
}
