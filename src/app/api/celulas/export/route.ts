import { NextResponse } from "next/server";
import { exportCellRequestsCSV } from "@/actions/cells";

export async function GET() {
  try {
    const csv = await exportCellRequestsCSV();

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="interesados-celulas-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al exportar solicitudes";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
