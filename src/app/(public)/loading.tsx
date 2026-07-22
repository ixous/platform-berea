export default function PublicLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-berea-navy border-t-berea-gold" />
        <p className="mt-4 text-sm text-berea-muted">Cargando...</p>
      </div>
    </div>
  );
}
