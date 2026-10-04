import Link from "next/link";
import { businessInfo } from "@/data/site";

export default function CookiesPage() {
  return (
    <main className="section-shell py-16">
      <Link href="/" className="text-sm font-bold text-rose hover:text-bark">
        Volver al inicio
      </Link>
      <h1 className="serif-heading mt-8 text-5xl text-bark">Política de cookies</h1>
      <p className="mt-6 max-w-3xl text-base leading-8 text-cocoa/78">
        Texto provisional para {businessInfo.name}. Sustituir por una política adaptada a las
        cookies y herramientas reales que se instalen en el sitio.
      </p>
    </main>
  );
}
