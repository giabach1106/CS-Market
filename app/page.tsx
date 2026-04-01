'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [dbStatus, setDbStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dbVersion, setDbVersion] = useState('');

  const checkDatabase = async () => {
    setDbStatus('loading');
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error('Health check failed.');
      }
      setDbVersion(data.version || '');
      setDbStatus('success');
    } catch (error) {
      console.error(error);
      setDbStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8">
        <header className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">CS348 Stage 2</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Student Ebook Exchange Marketplace
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
            Raw SQL + PostgreSQL + Next.js implementation with one CRUD main table (
            <span className="font-semibold text-cyan-200">listings</span>) and one report
            interface (
            <span className="font-semibold text-cyan-200">available listings</span>).
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/listings"
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-400 hover:bg-slate-900"
          >
            <h2 className="text-xl font-semibold text-cyan-200">Requirement 1: Listings CRUD</h2>
            <p className="mt-2 text-sm text-slate-300">
              Create, edit, and delete listings. Form dropdowns load students, courses, and ebooks
              dynamically from the database.
            </p>
          </Link>

          <Link
            href="/report"
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-400 hover:bg-slate-900"
          >
            <h2 className="text-xl font-semibold text-cyan-200">
              Requirement 2: Available Listings Report
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Filter active listings by course, trade type, condition, price range, and posted date
              range, then view aggregate statistics.
            </p>
          </Link>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">System Check</h2>
          <p className="mt-1 text-sm text-slate-300">
            Use this button to verify live PostgreSQL connectivity before recording your demo.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={checkDatabase}
              disabled={dbStatus === 'loading'}
              className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {dbStatus === 'loading' ? 'Checking...' : 'Check DB Connection'}
            </button>

            {dbStatus === 'success' && (
              <p className="text-sm text-emerald-300">Connected: {dbVersion}</p>
            )}
            {dbStatus === 'error' && (
              <p className="text-sm text-rose-300">Connection failed. Verify docker-compose and DB init.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
