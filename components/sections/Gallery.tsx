import Image from "next/image";
import { galleryItems } from "@/data/site";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/types";

type GalleryProps = {
  items?: GalleryItem[];
};

export function Gallery({ items = galleryItems }: GalleryProps) {
  return (
    <section className="py-16 md:py-24" aria-labelledby="gallery-title">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">Galería</p>
            <h2 id="gallery-title" className="serif-heading mt-4 text-4xl text-bark md:text-6xl">
              Antes y después
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-cocoa/72">
            Sustituye estas imágenes temporales por trabajos reales del salón antes de publicar.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.pet} className="group">
              <div className="grid grid-cols-2 gap-2">
                {item.beforeImageUrl ? (
                  <div className="relative aspect-[4/5] overflow-hidden bg-linen" aria-label={`Antes de ${item.pet}`}>
                    <Image src={item.beforeImageUrl} alt={`Antes de ${item.pet}`} fill sizes="(min-width: 768px) 180px, 50vw" className="object-cover" />
                  </div>
                ) : (
                  <div className={cn("photo-plate tone-" + item.tone, "aspect-[4/5]")} aria-label={`Antes de ${item.pet}`} />
                )}
                {item.afterImageUrl ? (
                  <div className="relative aspect-[4/5] overflow-hidden bg-linen" aria-label={`Después de ${item.pet}`}>
                    <Image src={item.afterImageUrl} alt={`Después de ${item.pet}`} fill sizes="(min-width: 768px) 180px, 50vw" className="object-cover" />
                  </div>
                ) : (
                  <div className={cn("photo-plate tone-" + item.tone, "aspect-[4/5] brightness-110")} aria-label={`Después de ${item.pet}`} />
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-b border-rose/20 pb-4">
                <div>
                  <h3 className="font-semibold text-bark">{item.pet}</h3>
                  <p className="mt-1 text-sm text-cocoa/72">{item.treatment}</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-rose">Muestra</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
