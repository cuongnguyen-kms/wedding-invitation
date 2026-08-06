export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4" role="status" aria-label="Loading">
      <div className="h-7 w-40 rounded bg-stone-200" />
      <div className="h-10 w-full max-w-2xl rounded bg-stone-200" />
      <div className="h-40 w-full rounded bg-stone-200" />
    </div>
  );
}
