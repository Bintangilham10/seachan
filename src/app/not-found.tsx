import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)] sm:p-6">
      <h1 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">Page Not Found</h1>
      <p className="mt-2 text-sm font-semibold text-slate-600">The room code or path is invalid.</p>
      <Link href="/" className="mt-4 inline-flex text-sm font-extrabold">
        Back to Home
      </Link>
    </div>
  );
}
