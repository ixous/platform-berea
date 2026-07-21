import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight">Centro Cristiano Berea</h1>
          <p className="mt-1 text-sm text-muted-foreground">Panel Administrativo</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
