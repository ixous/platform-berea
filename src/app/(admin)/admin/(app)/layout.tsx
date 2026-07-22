import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminFooter } from "@/components/layout/AdminFooter";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SidebarProvider } from "@/components/layout/SidebarProvider";

const defaultBreadcrumb = [{ label: "Dashboard", href: "/admin" }];

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader session={session} />
          <Breadcrumb items={defaultBreadcrumb} />
          <main className="flex-1 overflow-y-auto bg-muted/20 p-6">{children}</main>
          <AdminFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
