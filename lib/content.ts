import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import { businessInfo, galleryItems, products, services, testimonials } from "@/data/site";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase-admin";
import type { EditableContent, EditableService, Service } from "@/types";

const contentPath = path.join(process.cwd(), "data", "content.json");

const fallbackContent: EditableContent = {
  businessInfo,
  services: services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    durationMinutes: service.durationMinutes,
    priceFrom: service.priceFrom,
    active: service.active
  })),
  products,
  galleryItems,
  testimonials
};

function normalizeContent(value: Partial<EditableContent>): EditableContent {
  return {
    businessInfo: { ...fallbackContent.businessInfo, ...value.businessInfo },
    services: Array.isArray(value.services) ? value.services : fallbackContent.services,
    products: Array.isArray(value.products) ? value.products : fallbackContent.products,
    galleryItems: Array.isArray(value.galleryItems) ? value.galleryItems : fallbackContent.galleryItems,
    testimonials: Array.isArray(value.testimonials) ? value.testimonials : fallbackContent.testimonials
  };
}

export async function getEditableContent(): Promise<EditableContent> {
  noStore();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("id", "main")
        .maybeSingle();

      if (!error && data?.content) {
        return normalizeContent(data.content as Partial<EditableContent>);
      }
    }
  }

  try {
    const raw = await readFile(contentPath, "utf8");
    return normalizeContent(JSON.parse(raw) as Partial<EditableContent>);
  } catch {
    return fallbackContent;
  }
}

export async function saveEditableContent(content: EditableContent) {
  const normalized = normalizeContent(content);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase
        .from("site_content")
        .upsert({
          id: "main",
          content: normalized,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw new Error(error.message);
      }

      return normalized;
    }
  }

  await writeFile(contentPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

function mergeServiceIcons(editableServices: EditableService[]): Service[] {
  return editableServices
    .filter((service) => service.active)
    .map((service) => {
      const staticService = services.find((item) => item.id === service.id) ?? services[0];

      return {
        ...service,
        icon: staticService.icon
      };
    });
}

export async function getSiteContent() {
  const content = await getEditableContent();

  return {
    ...content,
    services: mergeServiceIcons(content.services)
  };
}
