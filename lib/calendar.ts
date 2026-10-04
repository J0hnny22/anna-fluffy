import { createSign } from "crypto";
import { availability, calendarSettings, openingWindows, services, teamMembers } from "@/data/site";
import type { AppointmentRequest, AvailabilityDay, Service } from "@/types";

type BusyInterval = {
  start: string;
  end: string;
};

type GoogleEvent = {
  id?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar";

export function isGoogleCalendarConfigured() {
  return Boolean(
    process.env[calendarSettings.calendarIdEnv] &&
      process.env[calendarSettings.serviceAccountEmailEnv] &&
      process.env[calendarSettings.serviceAccountPrivateKeyEnv]
  );
}

export function getCalendarConnectionStatus() {
  return {
    provider: calendarSettings.provider,
    configured: isGoogleCalendarConfigured(),
    calendarIdEnv: calendarSettings.calendarIdEnv,
    mode: calendarSettings.mode,
    timezone: calendarSettings.timezone
  };
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes: number) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function findService(serviceId: string): Service {
  return services.find((service) => service.id === serviceId) ?? services[0];
}

function eventOverlapsSlot(event: BusyInterval, date: string, slot: string, durationMinutes: number) {
  const slotStart = new Date(`${date}T${slot}:00`);
  const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60_000);
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  return eventStart < slotEnd && eventEnd > slotStart;
}

function buildLocalSlots(date: Date, durationMinutes: number, busy: BusyInterval[]): AvailabilityDay | null {
  const window = openingWindows.find((item) => item.weekday === date.getDay());

  if (!window) {
    return null;
  }

  const dateString = dateKey(date);
  const open = toMinutes(window.open);
  const close = toMinutes(window.close);
  const slots: string[] = [];
  const booked: string[] = [];

  for (
    let minutes = open;
    minutes + durationMinutes <= close;
    minutes += calendarSettings.slotIntervalMinutes
  ) {
    const slot = toTime(minutes);
    slots.push(slot);

    if (busy.some((event) => eventOverlapsSlot(event, dateString, slot, durationMinutes))) {
      booked.push(slot);
    }
  }

  return { date: dateString, slots, booked };
}

function getMockBusy(teamMemberId: string) {
  return (availability[teamMemberId] ?? []).flatMap((day) =>
    day.booked.map((slot) => {
      const start = new Date(`${day.date}T${slot}:00`);
      const end = new Date(start.getTime() + calendarSettings.slotIntervalMinutes * 60_000);

      return {
        start: start.toISOString(),
        end: end.toISOString()
      };
    })
  );
}

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, "\n");
}

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function getGoogleAccessToken() {
  const email = process.env[calendarSettings.serviceAccountEmailEnv];
  const privateKey = process.env[calendarSettings.serviceAccountPrivateKeyEnv];

  if (!email || !privateKey) {
    throw new Error("Google Calendar service account credentials are not configured.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: email,
      scope: GOOGLE_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      exp: now + 3600,
      iat: now
    })
  );
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  const signature = base64Url(signer.sign(normalizePrivateKey(privateKey)));

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsignedToken}.${signature}`
    })
  });

  if (!response.ok) {
    throw new Error(`Google token request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error("Google token response did not include an access token.");
  }

  return data.access_token;
}

async function getGoogleBusyIntervals(start: Date, end: Date): Promise<BusyInterval[]> {
  if (!isGoogleCalendarConfigured()) {
    return [];
  }

  const calendarId = process.env[calendarSettings.calendarIdEnv];
  const token = await getGoogleAccessToken();
  const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId!)}/events`);

  url.searchParams.set("timeMin", start.toISOString());
  url.searchParams.set("timeMax", end.toISOString());
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`Google Calendar events request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as { items?: GoogleEvent[] };

  return (data.items ?? [])
    .map((event) => ({
      start: event.start?.dateTime ?? event.start?.date,
      end: event.end?.dateTime ?? event.end?.date
    }))
    .filter((event): event is BusyInterval => Boolean(event.start && event.end));
}

export async function getAvailabilityDays(teamMemberId: string, serviceId: string) {
  const service = findService(serviceId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDay = addDays(today, calendarSettings.bookingWindowDays);
  const busy = isGoogleCalendarConfigured()
    ? await getGoogleBusyIntervals(today, addDays(lastDay, 1))
    : getMockBusy(teamMemberId);

  const days: AvailabilityDay[] = [];

  for (let offset = 0; offset <= calendarSettings.bookingWindowDays; offset += 1) {
    const day = buildLocalSlots(addDays(today, offset), service.durationMinutes, busy);

    if (day?.slots.length) {
      days.push(day);
    }
  }

  return {
    source: isGoogleCalendarConfigured() ? "google-calendar" : "mock",
    settings: getCalendarConnectionStatus(),
    days
  };
}

export async function createCalendarAppointment(request: AppointmentRequest) {
  const service = findService(request.serviceId);
  const teamMember = teamMembers.find((member) => member.id === request.teamMemberId);
  const currentAvailability = await getAvailabilityDays(request.teamMemberId, request.serviceId);
  const selectedDay = currentAvailability.days.find((day) => day.date === request.date);

  if (!selectedDay?.slots.includes(request.time) || selectedDay.booked.includes(request.time)) {
    throw new Error("Ese hueco ya no está disponible. Elige otra hora.");
  }

  const start = new Date(`${request.date}T${request.time}:00`);
  const end = new Date(start.getTime() + service.durationMinutes * 60_000);

  if (!isGoogleCalendarConfigured()) {
    return {
      source: "mock",
      status: "pending",
      eventId: `mock-${Date.now()}`
    };
  }

  const calendarId = process.env[calendarSettings.calendarIdEnv];
  const token = await getGoogleAccessToken();
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId!)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        summary: `Solicitud grooming · ${request.petName} · ${service.name}`,
        description: [
          `Propietario: ${request.ownerName}`,
          `Perro: ${request.petName}`,
          `Teléfono: ${request.phone}`,
          `Email: ${request.email}`,
          `Raza: ${request.breed}`,
          `Tamaño: ${request.petSize}`,
          `Servicio: ${service.name}`,
          `Profesional: ${teamMember?.name ?? request.teamMemberId}`,
          `Comentarios: ${request.notes || "Sin comentarios"}`
        ].join("\n"),
        start: {
          dateTime: start.toISOString(),
          timeZone: calendarSettings.timezone
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: calendarSettings.timezone
        },
        extendedProperties: {
          private: {
            teamMemberId: request.teamMemberId,
            serviceId: request.serviceId,
            appointmentStatus: calendarSettings.mode === "confirmed" ? "confirmed" : "pending"
          }
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Google Calendar event creation failed with status ${response.status}.`);
  }

  const event = (await response.json()) as { id?: string };

  return {
    source: "google-calendar",
    status: calendarSettings.mode === "confirmed" ? "confirmed" : "pending",
    eventId: event.id
  };
}
