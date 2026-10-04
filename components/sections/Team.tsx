import { CalendarCheck } from "lucide-react";
import { teamMembers } from "@/data/site";

export function Team() {
  return (
    <section id="equipo" className="scroll-mt-24 bg-linen/75 py-16 md:py-24" aria-labelledby="team-title">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-kicker">Equipo</p>
            <h2 id="team-title" className="serif-heading mt-4 text-4xl text-bark md:text-6xl">
              Conoce al equipo
            </h2>
            <p className="mt-5 text-base leading-7 text-cocoa/75">
              Cada profesional tiene su propia disponibilidad para que puedas elegir con quién
              reservar.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {teamMembers.map((member, index) => (
              <article key={member.id} className="border border-rose/18 bg-cream p-6">
                <div className="photo-plate mb-6 aspect-[4/3] rounded-2xl" aria-hidden="true" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="serif-heading text-3xl text-bark">{member.name}</h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-rose">
                      {member.role}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-cocoa">
                    <CalendarCheck aria-hidden="true" size={14} />
                    {member.availabilityStatus}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-cocoa/75">{member.bio}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {member.specialties.map((specialty) => (
                    <span
                      key={`${member.id}-${specialty}`}
                      className="rounded-full bg-linen px-3 py-1 text-xs font-semibold text-cocoa"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <a href="#citas" className="mt-6 inline-flex text-sm font-bold text-rose hover:text-bark">
                  Ver disponibilidad {index === 0 ? "de Anna" : ""}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
