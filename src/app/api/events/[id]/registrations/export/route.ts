import { NextRequest, NextResponse } from "next/server";
import { exportRegistrationsCSV } from "@/actions/events";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const csv = await exportRegistrationsCSV(id);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="registrations-${id.slice(0, 8)}.csv"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al exportar";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
