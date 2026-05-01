import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8">
        <header className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Student Ebook Exchange
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
            Buy, sell, or swap textbooks with other students. Browse available listings or post your own.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/listings"
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-400 hover:bg-slate-900"
          >
            <h2 className="text-xl font-semibold text-cyan-200">Manage Listings</h2>
            <p className="mt-2 text-sm text-slate-300">
              Create, edit, and delete your ebook listings. Choose from available courses and set your price or swap preferences.
            </p>
          </Link>

          <Link
            href="/report"
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-400 hover:bg-slate-900"
          >
            <h2 className="text-xl font-semibold text-cyan-200">Browse Listings</h2>
            <p className="mt-2 text-sm text-slate-300">
              Search active listings by course, trade type, condition, and price range. View marketplace statistics.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
