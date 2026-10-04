import Link from "next/link";
import { businessInfo } from "@/data/site";

export default function PrivacidadPage() {
  return (
    <main className="section-shell py-16">
      <Link href="/" className="text-sm font-bold text-rose hover:text-bark">
        Volver al inicio
      </Link>
      <h1 className="serif-heading mt-8 text-5xl text-bark">Política de privacidad</h1>
      <p className="mt-6 max-w-3xl text-base leading-8 text-cocoa/78">
        Texto provisional. Antes de publicar, añadir responsable del tratamiento, finalidades,
        base legal, conservación, destinatarios, derechos de usuario y datos de contacto reales de
        {` ${businessInfo.name}`}.
      </p>
    </main>
  );
}
