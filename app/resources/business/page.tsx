import Link from "next/link";

export default function ResourcePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/resources"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Central Resource Management Home
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Business
        </h1>

        <p className="mt-3 text-slate-600">
          Welcome to the Business resource section.
          Resources and information will be organised here.
        </p>
      </div>
    </main>
  );
}
