import { NextResponse } from "next/server";
import { createCalendarAppointment } from "@/lib/calendar";
import type { AppointmentRequest } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const appointment = (await request.json()) as AppointmentRequest;
    const result = await createCalendarAppointment(appointment);

    return NextResponse.json({
      ok: true,
      ...result,
      message:
        result.status === "confirmed"
          ? "Cita añadida al calendario."
          : "Solicitud enviada. Te contactaremos para confirmar definitivamente la cita."
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "No se pudo enviar la solicitud."
      },
      { status: 500 }
    );
  }
}
