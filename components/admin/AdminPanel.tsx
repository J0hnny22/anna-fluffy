"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Image as ImageIcon, LogOut, Plus, Save, ShieldCheck, Trash2, Upload } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { EditableContent, EditableService, GalleryItem, Product, Testimonial } from "@/types";

type Section = "productos" | "servicios" | "galeria" | "resenas" | "negocio";
type ImageUploadTarget = "product" | "gallery-before" | "gallery-after" | "logo";

const tabs: { id: Section; label: string }[] = [
  { id: "productos", label: "Productos" },
  { id: "servicios", label: "Servicios" },
  { id: "galeria", label: "Antes/después" },
  { id: "resenas", label: "Reseñas" },
  { id: "negocio", label: "Datos" }
];

const fieldClass =
  "min-h-11 w-full border border-rose/20 bg-white/70 px-3 py-2 text-sm text-bark placeholder:text-cocoa/40";
const labelClass = "grid gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-taupe";

function emptyProduct(): Product {
  return {
    id: `producto-${Date.now()}`,
    name: "Nuevo producto",
    category: "Alimento seco",
    description: "Descripción breve del producto.",
    price: "XX,XX €",
    size: "Formato",
    imageUrl: "/images/products/pienso-pollo-mini.svg",
    available: true,
    featured: false
  };
}

function emptyService(): EditableService {
  return {
    id: `servicio-${Date.now()}`,
    name: "Nuevo servicio",
    description: "Descripción del servicio.",
    durationMinutes: 60,
    priceFrom: "Desde XX €",
    active: true
  };
}

function emptyGalleryItem(): GalleryItem {
  return {
    pet: "Nuevo",
    treatment: "Tratamiento",
    tone: "rose",
    beforeImageUrl: "",
    afterImageUrl: ""
  };
}

function emptyTestimonial(): Testimonial {
  return {
    name: "Cliente",
    copy: "Texto de la reseña."
  };
}

export function AdminPanel() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [content, setContent] = useState<EditableContent | null>(null);
  const [activeTab, setActiveTab] = useState<Section>("productos");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState("");

  const featuredCount = useMemo(
    () => content?.products.filter((product) => product.featured).length ?? 0,
    [content]
  );

  useEffect(() => {
    const stored = window.sessionStorage.getItem("anna-admin-token");

    if (!stored) {
      return;
    }

    setToken(stored);
    void fetchContent(stored);
  }, []);

  async function fetchContent(sessionToken: string) {
    setLoading(true);
    setStatus("");

    const response = await fetch("/api/admin/content", {
      headers: { Authorization: `Bearer ${sessionToken}` }
    });

    if (!response.ok) {
      window.sessionStorage.removeItem("anna-admin-token");
      setToken("");
      setStatus("La sesión ha caducado. Vuelve a entrar.");
      setLoading(false);
      return;
    }

    setContent((await response.json()) as EditableContent);
    setLoading(false);
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const body = (await response.json().catch(() => null)) as { token?: string; message?: string } | null;

    if (!response.ok || !body?.token) {
      setStatus(body?.message ?? "No se ha podido iniciar sesión.");
      setLoading(false);
      return;
    }

    window.sessionStorage.setItem("anna-admin-token", body.token);
    setToken(body.token);
    setPassword("");
    await fetchContent(body.token);
  }

  async function saveContent() {
    if (!content) {
      return;
    }

    setLoading(true);
    setStatus("Guardando cambios...");

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(content)
    });

    if (!response.ok) {
      setStatus("No se ha podido guardar. Revisa la sesión.");
      setLoading(false);
      return;
    }

    setContent((await response.json()) as EditableContent);
    setStatus("Cambios guardados.");
    setLoading(false);
  }

  function logout() {
    window.sessionStorage.removeItem("anna-admin-token");
    setToken("");
    setContent(null);
  }

  function updateProduct(index: number, patch: Partial<Product>) {
    setContent((current) =>
      current
        ? {
            ...current,
            products: current.products.map((product, itemIndex) =>
              itemIndex === index ? { ...product, ...patch } : product
            )
          }
        : current
    );
  }

  function updateService(index: number, patch: Partial<EditableService>) {
    setContent((current) =>
      current
        ? {
            ...current,
            services: current.services.map((service, itemIndex) =>
              itemIndex === index ? { ...service, ...patch } : service
            )
          }
        : current
    );
  }

  function updateGallery(index: number, patch: Partial<GalleryItem>) {
    setContent((current) =>
      current
        ? {
            ...current,
            galleryItems: current.galleryItems.map((item, itemIndex) =>
              itemIndex === index ? { ...item, ...patch } : item
            )
          }
        : current
    );
  }

  function updateTestimonial(index: number, patch: Partial<Testimonial>) {
    setContent((current) =>
      current
        ? {
            ...current,
            testimonials: current.testimonials.map((item, itemIndex) =>
              itemIndex === index ? { ...item, ...patch } : item
            )
          }
        : current
    );
  }

  function removeFromList(key: "products" | "services" | "galleryItems" | "testimonials", index: number) {
    setContent((current) =>
      current
        ? {
            ...current,
            [key]: current[key].filter((_, itemIndex) => itemIndex !== index)
          }
        : current
    );
  }

  async function uploadImage(file: File, target: ImageUploadTarget, index?: number) {
    const targetKey = `${target}-${index ?? "business"}`;
    const formData = new FormData();
    formData.append("file", file);
    setUploadingTarget(targetKey);
    setStatus("Subiendo imagen...");

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    const body = (await response.json().catch(() => null)) as { imageUrl?: string; message?: string } | null;

    setUploadingTarget("");

    if (!response.ok || !body?.imageUrl) {
      setStatus(body?.message ?? "No se ha podido subir la imagen.");
      return;
    }

    const uploadedUrl = body.imageUrl;

    if (target === "product" && typeof index === "number") {
      updateProduct(index, { imageUrl: uploadedUrl });
    }

    if (target === "gallery-before" && typeof index === "number") {
      updateGallery(index, { beforeImageUrl: uploadedUrl });
    }

    if (target === "gallery-after" && typeof index === "number") {
      updateGallery(index, { afterImageUrl: uploadedUrl });
    }

    if (target === "logo") {
      setContent((current) =>
        current
          ? {
              ...current,
              businessInfo: { ...current.businessInfo, logo: uploadedUrl }
            }
          : current
      );
    }

    setStatus("Imagen subida. Recuerda guardar los cambios.");
  }

  function UploadControl({
    label,
    target,
    index
  }: {
    label: string;
    target: ImageUploadTarget;
    index?: number;
  }) {
    const targetKey = `${target}-${index ?? "business"}`;

    return (
      <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-rose/30 bg-white/70 px-4 text-sm font-bold text-bark transition hover:bg-white">
        <Upload aria-hidden="true" size={16} />
        {uploadingTarget === targetKey ? "Subiendo..." : label}
        <input
          className="sr-only"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={uploadingTarget === targetKey}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";

            if (file) {
              void uploadImage(file, target, index);
            }
          }}
        />
      </label>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-cream py-12">
        <section className="section-shell grid min-h-[calc(100vh-6rem)] content-center">
          <div className="mx-auto w-full max-w-md border border-rose/18 bg-white/58 p-7 shadow-[0_20px_70px_rgba(78,53,43,0.08)]">
            <ShieldCheck aria-hidden="true" className="text-rose" size={34} />
            <p className="section-kicker mt-6">Admin seguro</p>
            <h1 className="serif-heading mt-3 text-4xl text-bark">Entrar al panel</h1>
            <p className="mt-3 text-sm leading-6 text-cocoa/72">
              El panel usa sesión en memoria del servidor y envía el token solo por cabecera.
            </p>
            <form onSubmit={login} className="mt-7 grid gap-4">
              <label className={labelClass}>
                Contraseña
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={fieldClass}
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
              <button
                disabled={loading}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-bark px-5 text-sm font-bold text-cream disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
              {status ? <p className="text-sm font-semibold text-rose">{status}</p> : null}
            </form>
          </div>
        </section>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="min-h-screen bg-cream py-12">
        <div className="section-shell text-sm font-semibold text-cocoa">Cargando contenido...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-8 md:py-12">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-5 border-b border-rose/18 pb-7 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">Admin</p>
            <h1 className="serif-heading mt-3 text-5xl text-bark">Contenido editable</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cocoa/72">
              Gestiona productos, servicios, galería, reseñas y datos básicos del negocio.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rose/25 bg-white/50 px-4 text-sm font-bold text-bark"
            >
              <Eye aria-hidden="true" size={17} />
              Ver web
            </Link>
            <button
              onClick={saveContent}
              disabled={loading}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-bark px-4 text-sm font-bold text-cream disabled:opacity-60"
            >
              <Save aria-hidden="true" size={17} />
              Guardar
            </button>
            <button
              onClick={logout}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rose/25 px-4 text-sm font-bold text-bark"
            >
              <LogOut aria-hidden="true" size={17} />
              Salir
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold ${
                activeTab === tab.id ? "bg-bark text-cream" : "border border-rose/20 bg-white/50 text-bark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {status ? (
          <p className="mt-4 border border-rose/18 bg-white/50 px-4 py-3 text-sm font-semibold text-cocoa">{status}</p>
        ) : null}

        {activeTab === "productos" ? (
          <section className="mt-7">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-cocoa/72">{featuredCount} productos destacados en la home.</p>
              <button
                onClick={() => setContent({ ...content, products: [emptyProduct(), ...content.products] })}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-rose px-4 text-sm font-bold text-white"
              >
                <Plus aria-hidden="true" size={17} />
                Añadir producto
              </button>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {content.products.map((product, index) => (
                <article key={product.id} className="grid gap-4 border border-rose/18 bg-white/55 p-5 sm:grid-cols-[160px_1fr]">
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-cream">
                      <Image src={product.imageUrl} alt="" fill sizes="160px" className="object-cover" />
                    </div>
                    <div className="mt-3">
                      <UploadControl label="Subir imagen" target="product" index={index} />
                    </div>
                    <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-cocoa">
                      <input type="checkbox" checked={product.featured ?? false} onChange={(event) => updateProduct(index, { featured: event.target.checked })} />
                      Home
                    </label>
                    <label className="mt-2 flex items-center gap-2 text-sm font-semibold text-cocoa">
                      <input type="checkbox" checked={product.available} onChange={(event) => updateProduct(index, { available: event.target.checked })} />
                      Disponible
                    </label>
                  </div>
                  <div className="grid gap-3">
                    <input className={fieldClass} value={product.name} onChange={(event) => updateProduct(index, { name: event.target.value })} />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input className={fieldClass} value={product.category} onChange={(event) => updateProduct(index, { category: event.target.value })} />
                      <input className={fieldClass} value={product.price} onChange={(event) => updateProduct(index, { price: event.target.value })} />
                      <input className={fieldClass} value={product.size} onChange={(event) => updateProduct(index, { size: event.target.value })} />
                    </div>
                    <textarea className={fieldClass} value={product.description} rows={3} onChange={(event) => updateProduct(index, { description: event.target.value })} />
                    <p className="flex items-center gap-2 text-xs font-semibold text-taupe">
                      <ImageIcon aria-hidden="true" size={16} />
                      Imagen cargada desde el panel
                    </p>
                    <button onClick={() => removeFromList("products", index)} className="inline-flex min-h-10 items-center gap-2 justify-self-start rounded-full border border-rose/30 px-4 text-sm font-bold text-bark">
                      <Trash2 aria-hidden="true" size={16} />
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "servicios" ? (
          <section className="mt-7 grid gap-4">
            <button onClick={() => setContent({ ...content, services: [emptyService(), ...content.services] })} className="inline-flex min-h-10 items-center gap-2 justify-self-start rounded-full bg-rose px-4 text-sm font-bold text-white">
              <Plus aria-hidden="true" size={17} />
              Añadir servicio
            </button>
            {content.services.map((service, index) => (
              <article key={service.id} className="grid gap-3 border border-rose/18 bg-white/55 p-5 md:grid-cols-[1fr_140px_140px_auto]">
                <div className="grid gap-3">
                  <input className={fieldClass} value={service.name} onChange={(event) => updateService(index, { name: event.target.value })} />
                  <textarea className={fieldClass} value={service.description} rows={2} onChange={(event) => updateService(index, { description: event.target.value })} />
                </div>
                <input className={fieldClass} value={service.priceFrom} onChange={(event) => updateService(index, { priceFrom: event.target.value })} />
                <input className={fieldClass} type="number" min={15} value={service.durationMinutes} onChange={(event) => updateService(index, { durationMinutes: Number(event.target.value) })} />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-cocoa">
                    <input type="checkbox" checked={service.active} onChange={(event) => updateService(index, { active: event.target.checked })} />
                    Activo
                  </label>
                  <button onClick={() => removeFromList("services", index)} className="text-rose">
                    <Trash2 aria-hidden="true" size={18} />
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {activeTab === "galeria" ? (
          <section className="mt-7 grid gap-4">
            <button onClick={() => setContent({ ...content, galleryItems: [emptyGalleryItem(), ...content.galleryItems] })} className="inline-flex min-h-10 items-center gap-2 justify-self-start rounded-full bg-rose px-4 text-sm font-bold text-white">
              <Plus aria-hidden="true" size={17} />
              Añadir caso
            </button>
            <div className="grid gap-4 md:grid-cols-3">
              {content.galleryItems.map((item, index) => (
                <article key={`${item.pet}-${index}`} className="border border-rose/18 bg-white/55 p-5">
                  <div className="grid grid-cols-2 gap-2">
                    {item.beforeImageUrl ? (
                      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                        <Image src={item.beforeImageUrl} alt={`Antes de ${item.pet}`} fill sizes="180px" className="object-cover" />
                      </div>
                    ) : (
                      <div className={`photo-plate tone-${item.tone} aspect-[4/5]`} />
                    )}
                    {item.afterImageUrl ? (
                      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                        <Image src={item.afterImageUrl} alt={`Después de ${item.pet}`} fill sizes="180px" className="object-cover" />
                      </div>
                    ) : (
                      <div className={`photo-plate tone-${item.tone} aspect-[4/5] brightness-110`} />
                    )}
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <UploadControl label="Subir antes" target="gallery-before" index={index} />
                    <UploadControl label="Subir después" target="gallery-after" index={index} />
                  </div>
                  <input className={`${fieldClass} mt-4`} value={item.pet} onChange={(event) => updateGallery(index, { pet: event.target.value })} />
                  <input className={`${fieldClass} mt-3`} value={item.treatment} onChange={(event) => updateGallery(index, { treatment: event.target.value })} />
                  <select className={`${fieldClass} mt-3`} value={item.tone} onChange={(event) => updateGallery(index, { tone: event.target.value as GalleryItem["tone"] })}>
                    <option value="rose">Rosa</option>
                    <option value="sage">Verde</option>
                    <option value="butter">Dorado</option>
                  </select>
                  <button onClick={() => removeFromList("galleryItems", index)} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-rose/30 px-4 text-sm font-bold text-bark">
                    <Trash2 aria-hidden="true" size={16} />
                    Eliminar
                  </button>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "resenas" ? (
          <section className="mt-7 grid gap-4">
            <button onClick={() => setContent({ ...content, testimonials: [emptyTestimonial(), ...content.testimonials] })} className="inline-flex min-h-10 items-center gap-2 justify-self-start rounded-full bg-rose px-4 text-sm font-bold text-white">
              <Plus aria-hidden="true" size={17} />
              Añadir reseña
            </button>
            <div className="grid gap-4 md:grid-cols-3">
              {content.testimonials.map((item, index) => (
                <article key={`${item.name}-${index}`} className="border border-rose/18 bg-white/55 p-5">
                  <input className={fieldClass} value={item.name} onChange={(event) => updateTestimonial(index, { name: event.target.value })} />
                  <textarea className={`${fieldClass} mt-3`} value={item.copy} rows={5} onChange={(event) => updateTestimonial(index, { copy: event.target.value })} />
                  <button onClick={() => removeFromList("testimonials", index)} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-rose/30 px-4 text-sm font-bold text-bark">
                    <Trash2 aria-hidden="true" size={16} />
                    Eliminar
                  </button>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "negocio" ? (
          <section className="mt-7 grid gap-4 border border-rose/18 bg-white/55 p-5 md:grid-cols-2">
            {Object.entries(content.businessInfo).map(([key, value]) => (
              key === "logo" ? (
                <div key={key} className="grid gap-3 border border-rose/18 bg-cream p-4 md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-taupe">Logo</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border border-rose/18 bg-white">
                      <Image src={value} alt="Logo actual" fill sizes="96px" className="object-contain" />
                    </div>
                    <UploadControl label="Subir logo" target="logo" />
                  </div>
                </div>
              ) : (
                <label key={key} className={labelClass}>
                  {key}
                  <input
                    className={fieldClass}
                    value={value}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        businessInfo: { ...content.businessInfo, [key]: event.target.value }
                      })
                    }
                  />
                </label>
              )
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
