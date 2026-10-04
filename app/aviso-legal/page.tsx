import Link from "next/link";
import { businessInfo } from "@/data/site";

export default function AvisoLegalPage() {
  return (
    <main className="section-shell py-16">
      <Link href="/" className="text-sm font-bold text-rose hover:text-bark">
        Volver al inicio
      </Link>
      <h1 className="serif-heading mt-8 text-5xl text-bark">Aviso legal</h1>
      <p className="mt-6 max-w-3xl text-base leading-8 text-cocoa/78">
        Contenido legal provisional para {businessInfo.name}. Sustituir antes de producción por
        datos fiscales, titularidad del sitio, domicilio, condiciones de uso y cualquier información
        legal obligatoria aplicable.
      </p>
    </main>
  );
}
