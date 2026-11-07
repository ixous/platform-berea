import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCellRequests } from "@/actions/cells";
import { CellRequestsClient } from "./cell-requests-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interesados en Células (WhatsApp) — Administración",
  robots: { index: false, follow: false },
};

export default async function AdminCelulasPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const { items, total } = await getCellRequests("", 1, "");

  return <CellRequestsClient initialItems={items} total={total} />;
}
