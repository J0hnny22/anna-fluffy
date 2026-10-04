"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, RefreshCw, Send } from "lucide-react";
import { availability, services, teamMembers } from "@/data/site";
import type { AppointmentRequest, AvailabilityDay } from "@/types";
import { Button } from "@/components/ui/Button";
import { FieldLabel, SelectInput, TextArea, TextInput } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const initialRequest: AppointmentRequest = {
  ownerName: "",
  petName: "",
  phone: "",
  email: "",
  breed: "",
  petSize: "",
  serviceId: services[0]?.id ?? "",
  teamMemberId: teamMembers[0]?.id ?? "",
  date: availability[teamMembers[0]?.id]?.[0]?.date ?? "",
  time: "",
  notes: ""
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(new Date(`${date}T12:00:00`));
}

export function AppointmentBooking() {
  const [request, setRequest] = useState(initialRequest);
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityDay[]>(availability[initialRequest.teamMemberId] ?? []);
  const [calendarSource, setCalendarSource] = useState<"google-calendar" | "mock">("mock");
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAvailability() {
      setLoadingAvailability(true);
      setError("");

      try {
        const params = new URLSearchParams({
          teamMemberId: request.teamMemberId,
          serviceId: request.serviceId
        });
        const response = await fetch(`/api/availability?${params.toString()}`);
        const data = (await response.json()) as {
          source?: "google-calendar" | "mock";
          days?: AvailabilityDay[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "No se pudo cargar la disponibilidad.");
        }

        if (!active) {
          return;
        }

        const days = data.days ?? [];
        setAvailabilityDays(days);
        setCalendarSource(data.source ?? "mock");
        setRequest((current) => ({
          ...current,
          date: days[0]?.date ?? "",
          time: ""
        }));
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la disponibilidad.");
        }
      } finally {
        if (active) {
          setLoadingAvailability(false);
        }
      }
    }

    loadAvailability();

    return () => {
      active = false;
    };
  }, [request.serviceId, request.teamMemberId]);

  const selectedAvailability = availabilityDays;
  const selectedDay = useMemo(
    () => selectedAvailability.find((day) => day.date === request.date) ?? selectedAvailability[0],
    [request.date, selectedAvailability]
  );

  const chosenService = services.find((service) => service.id === request.serviceId);
  const chosenTeamMember = teamMembers.find((member) => member.id === request.teamMemberId);
  const canSubmit = Boolean(request.time) && !submitting;

  function update<K extends keyof AppointmentRequest>(key: K, value: AppointmentRequest[K]) {
    setSubmitted(false);
    setError("");
    setRequest((current) => ({ ...current, [key]: value }));
  }

  function handleTeamChange(value: string) {
    setRequest((current) => ({
      ...current,
      teamMemberId: value,
      date: "",
      time: ""
    }));
    setSubmitted(false);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requiredValues = [
      request.ownerName,
      request.petName,
      request.phone,
      request.email,
      request.breed,
      request.petSize,
      request.serviceId,
      request.teamMemberId,
      request.date,
      request.time
    ];

    if (requiredValues.some((value) => !value.trim())) {
      setError("Completa los campos obligatorios y selecciona una hora disponible.");
      return;
    }

    if (selectedDay?.booked.includes(request.time)) {
      setError("Esa hora ya no está disponible. Elige otra franja.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo enviar la solicitud.");
      }

      setSubmitted(true);
      setError("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo enviar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="citas" className="scroll-mt-24 bg-bark py-16 text-cream md:py-24" aria-labelledby="booking-title">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="section-kicker text-blush">Reserva tu cita</p>
            <h2 id="booking-title" className="serif-heading mt-4 text-4xl md:text-6xl">
              Elige profesional, servicio y hora
            </h2>
            <p className="mt-5 text-base leading-7 text-cream/75">
              Los huecos se generan desde apertura hasta cierre y se bloquean cuando ya aparecen
              ocupados en el calendario compartido.
            </p>

            <div className="mt-8 border border-cream/14 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <CalendarDays aria-hidden="true" className="text-blush" size={22} />
                <p className="font-semibold">Resumen</p>
              </div>
              <dl className="mt-5 grid gap-3 text-sm text-cream/75">
                <div className="flex justify-between gap-4">
                  <dt>Servicio</dt>
                  <dd className="text-right text-cream">{chosenService?.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Profesional</dt>
                  <dd className="text-right text-cream">{chosenTeamMember?.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Duración</dt>
                  <dd className="text-right text-cream">{chosenService?.durationMinutes} min aprox.</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Calendario</dt>
                  <dd className="text-right text-cream">
                    {calendarSource === "google-calendar" ? "Google Calendar" : "Modo demo"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-cream p-5 text-bark shadow-soft md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <FieldLabel label="Profesional">
                <SelectInput value={request.teamMemberId} onChange={(event) => handleTeamChange(event.target.value)}>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </SelectInput>
              </FieldLabel>
              <FieldLabel label="Servicio">
                <SelectInput value={request.serviceId} onChange={(event) => update("serviceId", event.target.value)}>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </SelectInput>
              </FieldLabel>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-cocoa">Fecha</p>
                {loadingAvailability ? (
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-rose">
                    <RefreshCw aria-hidden="true" size={14} className="animate-spin" />
                    Cargando agenda
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
                {selectedAvailability.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => {
                      update("date", day.date);
                      update("time", "");
                    }}
                    className={cn(
                      "min-h-14 min-w-32 border px-4 py-3 text-left text-sm font-semibold transition sm:min-w-0",
                      request.date === day.date
                        ? "border-bark bg-bark text-cream"
                        : "border-rose/20 bg-white/70 text-bark hover:border-rose"
                    )}
                  >
                    {formatDate(day.date)}
                  </button>
                ))}
              </div>
              {!loadingAvailability && !selectedAvailability.length ? (
                <p className="mt-3 text-sm font-semibold text-rose">
                  No hay huecos publicados para los próximos días.
                </p>
              ) : null}
            </div>

            <div className="mt-7">
              <div className="flex items-center gap-2 text-sm font-semibold text-cocoa">
                <Clock aria-hidden="true" size={17} />
                Horas disponibles
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {selectedDay?.slots.map((slot) => {
                  const booked = selectedDay.booked.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={booked}
                      aria-pressed={request.time === slot}
                      onClick={() => update("time", slot)}
                      className={cn(
                        "min-h-11 border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-400",
                        request.time === slot
                          ? "border-rose bg-rose text-white"
                          : "border-rose/25 bg-white/70 text-bark hover:border-rose"
                      )}
                      aria-label={booked ? `${slot} no disponible` : `${slot} disponible`}
                    >
                      {request.time === slot ? `${slot} ✓` : slot}
                    </button>
                  );
                })}
              </div>
              {!request.time ? (
                <p className="mt-3 text-sm font-semibold text-rose">
                  Selecciona una hora disponible para enviar la solicitud.
                </p>
              ) : null}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <FieldLabel label="Nombre del propietario">
                <TextInput required value={request.ownerName} onChange={(event) => update("ownerName", event.target.value)} />
              </FieldLabel>
              <FieldLabel label="Nombre del perro">
                <TextInput required value={request.petName} onChange={(event) => update("petName", event.target.value)} />
              </FieldLabel>
              <FieldLabel label="Teléfono">
                <TextInput required type="tel" value={request.phone} onChange={(event) => update("phone", event.target.value)} />
              </FieldLabel>
              <FieldLabel label="Email">
                <TextInput required type="email" value={request.email} onChange={(event) => update("email", event.target.value)} />
              </FieldLabel>
              <FieldLabel label="Raza">
                <TextInput required value={request.breed} onChange={(event) => update("breed", event.target.value)} />
              </FieldLabel>
              <FieldLabel label="Tamaño">
                <SelectInput required value={request.petSize} onChange={(event) => update("petSize", event.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="pequeno">Pequeño</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                  <option value="gigante">Gigante</option>
                </SelectInput>
              </FieldLabel>
            </div>

            <div className="mt-5">
              <FieldLabel label="Comentarios">
                <TextArea value={request.notes} onChange={(event) => update("notes", event.target.value)} />
              </FieldLabel>
            </div>

            {error ? (
              <p role="alert" className="mt-5 border border-rose/35 bg-rose/10 px-4 py-3 text-sm font-semibold text-bark">
                {error}
              </p>
            ) : null}

            {submitted ? (
              <div role="status" className="mt-5 border border-sage/45 bg-sage/15 px-4 py-4 text-sm text-bark">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 aria-hidden="true" size={18} />
                  Solicitud enviada
                </div>
                <p className="mt-2 text-cocoa/75">
                  Te contactaremos para confirmar definitivamente la cita.
                </p>
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={!canSubmit}
              className="mt-7 w-full disabled:cursor-not-allowed disabled:bg-taupe/45 disabled:shadow-none sm:w-auto"
            >
              <Send aria-hidden="true" size={17} />
              {submitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
