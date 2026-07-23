export default function PublicLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 animate-fade-in">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-berea-navy/10 border-t-berea-gold" />
        <p className="mt-5 text-sm font-medium text-berea-muted">Cargando...</p>
      </div>
    </div>
  );
}
