import { Suspense } from "react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export const revalidate = 300;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-berea-light">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-berea-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:outline-none"
      >
        Saltar al contenido
      </a>
      <Suspense fallback={<div className="h-16 border-b bg-white" />}>
        <PublicHeader />
      </Suspense>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
