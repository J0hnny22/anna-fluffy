import { NextResponse } from "next/server";
import { services, teamMembers } from "@/data/site";
import { getAvailabilityDays } from "@/lib/calendar";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamMemberId = searchParams.get("teamMemberId") ?? teamMembers[0]?.id;
  const serviceId = searchParams.get("serviceId") ?? services[0]?.id;

  try {
    return NextResponse.json(await getAvailabilityDays(teamMemberId, serviceId));
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo cargar la disponibilidad."
      },
      { status: 500 }
    );
  }
}
