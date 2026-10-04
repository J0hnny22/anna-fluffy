import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { businessInfo, openingHours } from "@/data/site";
import { LinkButton } from "@/components/ui/Button";
import type { EditableBusinessInfo } from "@/types";

type ContactProps = {
  info?: EditableBusinessInfo;
};

export function Contact({ info = businessInfo }: ContactProps) {
  return (
    <section id="contacto" className="scroll-mt-24 py-16 md:py-24" aria-labelledby="contact-title">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="border border-rose/18 bg-cream p-7 md:p-10">
            <p className="section-kicker">Contacto</p>
            <h2 id="contact-title" className="serif-heading mt-4 text-4xl text-bark md:text-6xl">
              Estamos aquí para ayudarte
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-cocoa/75">
              Escríbenos para resolver dudas, valorar el servicio adecuado o solicitar una cita.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="#citas">Pedir cita</LinkButton>
              <LinkButton href={`https://wa.me/${info.whatsapp.replace(/\D/g, "")}`} variant="secondary">
                <MessageCircle aria-hidden="true" size={17} />
                WhatsApp
              </LinkButton>
              <LinkButton href={`tel:${info.phone.replaceAll(" ", "")}`} variant="secondary">
                <Phone aria-hidden="true" size={17} />
                Llamar
              </LinkButton>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="border border-rose/18 bg-white/55 p-6">
              <h3 className="font-semibold text-bark">Datos del salón</h3>
              <ul className="mt-5 grid gap-4 text-sm text-cocoa/78">
                <li className="flex gap-3">
                  <MapPin aria-hidden="true" className="mt-0.5 text-rose" size={18} />
                  {info.address}
                </li>
                <li className="flex gap-3">
                  <Phone aria-hidden="true" className="mt-0.5 text-rose" size={18} />
                  {info.phone}
                </li>
                <li className="flex gap-3">
                  <Mail aria-hidden="true" className="mt-0.5 text-rose" size={18} />
                  {info.email}
                </li>
                <li className="flex gap-3">
                  <Instagram aria-hidden="true" className="mt-0.5 text-rose" size={18} />
                  {info.instagram}
                </li>
              </ul>
            </div>
            <div className="border border-rose/18 bg-bark p-6 text-cream">
              <h3 className="font-semibold">Horario</h3>
              <dl className="mt-5 grid gap-3 text-sm">
                {openingHours.map((item) => (
                  <div key={item.day} className="flex justify-between gap-4 border-b border-cream/12 pb-3">
                    <dt className="text-cream/70">{item.day}</dt>
                    <dd className="text-right font-semibold">{item.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="grid min-h-48 place-items-center border border-dashed border-rose/35 bg-linen/80 p-6 text-center text-sm font-semibold text-cocoa/65">
              Mapa / Google Maps pendiente de configurar
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
