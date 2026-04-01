'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { AvailableListingReportRow, AvailableListingReportStats, Course } from '@/lib/types';

type ReportFilters = {
  courseId: string;
  tradeType: '' | 'SELL' | 'SWAP' | 'BOTH';
  condition: '' | 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
  minPrice: string;
  maxPrice: string;
  fromDate: string;
  toDate: string;
};

const DEFAULT_FILTERS: ReportFilters = {
  courseId: '',
  tradeType: '',
  condition: '',
  minPrice: '',
  maxPrice: '',
  fromDate: '',
  toDate: '',
};

const DEFAULT_STATS: AvailableListingReportStats = {
  total_active: 0,
  avg_price_sell: 0,
  sell_count: 0,
  swap_or_both_count: 0,
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }
  return data as T;
}

function formatPrice(price: number | null) {
  if (price === null) {
    return 'N/A';
  }
  return `$${Number(price).toFixed(2)}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export default function ReportPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS);
  const [rows, setRows] = useState<AvailableListingReportRow[]>([]);
  const [stats, setStats] = useState<AvailableListingReportStats>(DEFAULT_STATS);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadCourses = async () => {
    const courseData = await fetchJson<{ courses: Course[] }>('/api/meta/courses');
    setCourses(courseData.courses);
  };

  const loadReport = async (nextFilters: ReportFilters) => {
    const params = new URLSearchParams();
    if (nextFilters.courseId) params.set('courseId', nextFilters.courseId);
    if (nextFilters.tradeType) params.set('tradeType', nextFilters.tradeType);
    if (nextFilters.condition) params.set('condition', nextFilters.condition);
    if (nextFilters.minPrice) params.set('minPrice', nextFilters.minPrice);
    if (nextFilters.maxPrice) params.set('maxPrice', nextFilters.maxPrice);
    if (nextFilters.fromDate) params.set('fromDate', nextFilters.fromDate);
    if (nextFilters.toDate) params.set('toDate', nextFilters.toDate);

    const queryString = params.toString();
    const url = `/api/reports/available-listings${queryString ? `?${queryString}` : ''}`;
    const reportData = await fetchJson<{
      rows: AvailableListingReportRow[];
      stats: AvailableListingReportStats;
    }>(url);

    setRows(reportData.rows);
    setStats({
      total_active: Number(reportData.stats.total_active || 0),
      avg_price_sell: Number(reportData.stats.avg_price_sell || 0),
      sell_count: Number(reportData.stats.sell_count || 0),
      swap_or_both_count: Number(reportData.stats.swap_or_both_count || 0),
    });
  };

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        await loadCourses();
        await loadReport(DEFAULT_FILTERS);
      } catch (error: any) {
        setErrorMessage(error.message || 'Failed to load report.');
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const onApplyFilters = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await loadReport(filters);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to fetch report data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetFilters = async () => {
    setFilters(DEFAULT_FILTERS);
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await loadReport(DEFAULT_FILTERS);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to reset report data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
        <p>Loading report workspace...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-8">
        <header className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Requirement 2</p>
              <h1 className="text-3xl font-bold text-white">Available Listings Report</h1>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400"
              >
                Home
              </Link>
              <Link
                href="/listings"
                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400"
              >
                Listings CRUD
              </Link>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            The course filter options below are loaded from the database at runtime.
          </p>
        </header>

        {errorMessage && (
          <section className="rounded-lg border border-rose-700 bg-rose-950/40 p-3 text-sm text-rose-200">
            {errorMessage}
          </section>
        )}

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold text-cyan-200">Filters</h2>
          <form className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" onSubmit={onApplyFilters}>
            <label className="flex flex-col gap-1 text-sm">
              Course
              <select
                value={filters.courseId}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, courseId: event.target.value }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              >
                <option value="">All courses</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_code} - {course.course_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Trade Type
              <select
                value={filters.tradeType}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    tradeType: event.target.value as ReportFilters['tradeType'],
                  }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              >
                <option value="">All</option>
                <option value="SELL">SELL</option>
                <option value="SWAP">SWAP</option>
                <option value="BOTH">BOTH</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Condition
              <select
                value={filters.condition}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    condition: event.target.value as ReportFilters['condition'],
                  }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              >
                <option value="">All</option>
                <option value="NEW">NEW</option>
                <option value="LIKE_NEW">LIKE_NEW</option>
                <option value="GOOD">GOOD</option>
                <option value="FAIR">FAIR</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Min Price
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.minPrice}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, minPrice: event.target.value }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="e.g. 10"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Max Price
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="e.g. 30"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              From Date
              <input
                type="date"
                value={filters.fromDate}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, fromDate: event.target.value }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              To Date
              <input
                type="date"
                value={filters.toDate}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, toDate: event.target.value }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              />
            </label>

            <div className="flex items-end gap-2 lg:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Applying...' : 'Apply Filters'}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onResetFilters}
                className="rounded-md border border-slate-600 px-4 py-2 text-sm transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Total Active Listings</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-200">{stats.total_active}</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Avg Price (SELL/BOTH)</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-200">${stats.avg_price_sell.toFixed(2)}</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">SELL Listings</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-200">{stats.sell_count}</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">SWAP/BOTH Listings</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-200">{stats.swap_or_both_count}</p>
          </article>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-cyan-200">Report Rows</h2>
            <p className="text-sm text-slate-300">Rows: {rows.length}</p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-200">
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Ebook</th>
                  <th className="px-2 py-2">Course</th>
                  <th className="px-2 py-2">Seller</th>
                  <th className="px-2 py-2">Trade</th>
                  <th className="px-2 py-2">Condition</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">Posted Date</th>
                  <th className="px-2 py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.listing_id} className="border-b border-slate-800 align-top">
                    <td className="px-2 py-2 text-slate-300">{row.listing_id}</td>
                    <td className="px-2 py-2">
                      <p className="font-medium text-slate-100">{row.ebook_title}</p>
                      <p className="text-xs text-slate-400">{row.ebook_author}</p>
                    </td>
                    <td className="px-2 py-2 text-slate-300">
                      {row.course_code}
                      <p className="text-xs text-slate-400">{row.course_name}</p>
                    </td>
                    <td className="px-2 py-2 text-slate-300">
                      {row.seller_name}
                      <p className="text-xs text-slate-400">{row.seller_email}</p>
                    </td>
                    <td className="px-2 py-2 text-slate-300">{row.trade_type}</td>
                    <td className="px-2 py-2 text-slate-300">{row.book_condition}</td>
                    <td className="px-2 py-2 text-slate-300">{formatPrice(row.price)}</td>
                    <td className="px-2 py-2 text-slate-300">{formatDate(row.posted_at)}</td>
                    <td className="px-2 py-2 text-xs text-slate-400">{row.note || '-'}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className="px-2 py-4 text-slate-300" colSpan={9}>
                      No rows match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
