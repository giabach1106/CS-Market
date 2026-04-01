'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Course, Ebook, Listing, Student } from '@/lib/types';

type ListingFormState = {
  courseId: string;
  ebookId: string;
  sellerStudentId: string;
  tradeType: 'SELL' | 'SWAP' | 'BOTH';
  bookCondition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
  price: string;
  status: 'ACTIVE' | 'RESERVED' | 'CLOSED';
  note: string;
};

const DEFAULT_FORM: ListingFormState = {
  courseId: '',
  ebookId: '',
  sellerStudentId: '',
  tradeType: 'SELL',
  bookCondition: 'GOOD',
  price: '',
  status: 'ACTIVE',
  note: '',
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
  return new Date(value).toLocaleString();
}

export default function ListingsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);

  const [form, setForm] = useState<ListingFormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isSwapOnly = form.tradeType === 'SWAP';

  const selectedEbook = useMemo(
    () => ebooks.find((ebook) => String(ebook.ebook_id) === form.ebookId),
    [ebooks, form.ebookId]
  );

  const loadListings = async () => {
    const data = await fetchJson<{ listings: Listing[] }>('/api/listings');
    setListings(data.listings);
  };

  const loadBaseData = async () => {
    setIsBootstrapping(true);
    setErrorMessage('');

    try {
      const [studentsRes, coursesRes, listingsRes] = await Promise.all([
        fetchJson<{ students: Student[] }>('/api/meta/students'),
        fetchJson<{ courses: Course[] }>('/api/meta/courses'),
        fetchJson<{ listings: Listing[] }>('/api/listings'),
      ]);

      setStudents(studentsRes.students);
      setCourses(coursesRes.courses);
      setListings(listingsRes.listings);

      setForm((prev) => ({
        ...prev,
        sellerStudentId: prev.sellerStudentId || String(studentsRes.students[0]?.student_id || ''),
        courseId: prev.courseId || String(coursesRes.courses[0]?.course_id || ''),
      }));
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to load initial data.');
    } finally {
      setIsBootstrapping(false);
    }
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    if (!form.courseId) {
      setEbooks([]);
      setForm((prev) => ({ ...prev, ebookId: '' }));
      return;
    }

    let isCancelled = false;

    const loadEbooksByCourse = async () => {
      try {
        const data = await fetchJson<{ ebooks: Ebook[] }>(`/api/meta/ebooks?courseId=${form.courseId}`);
        if (isCancelled) {
          return;
        }

        setEbooks(data.ebooks);
        setForm((prev) => {
          const hasCurrentEbook = data.ebooks.some((ebook) => String(ebook.ebook_id) === prev.ebookId);
          return {
            ...prev,
            ebookId: hasCurrentEbook ? prev.ebookId : String(data.ebooks[0]?.ebook_id || ''),
          };
        });
      } catch (error: any) {
        if (!isCancelled) {
          setErrorMessage(error.message || 'Failed to load ebooks.');
        }
      }
    };

    loadEbooksByCourse();

    return () => {
      isCancelled = true;
    };
  }, [form.courseId]);

  const resetForm = () => {
    setEditingId(null);
    setSuccessMessage('');
    setErrorMessage('');
    setForm((prev) => ({
      ...DEFAULT_FORM,
      sellerStudentId: prev.sellerStudentId || String(students[0]?.student_id || ''),
      courseId: prev.courseId || String(courses[0]?.course_id || ''),
    }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const payload = {
        ebookId: Number(form.ebookId),
        sellerStudentId: Number(form.sellerStudentId),
        tradeType: form.tradeType,
        bookCondition: form.bookCondition,
        price: form.price === '' ? null : Number(form.price),
        status: form.status,
        note: form.note.trim(),
      };

      const response = await fetch(editingId ? `/api/listings/${editingId}` : '/api/listings', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save listing.');
      }

      await loadListings();
      setSuccessMessage(editingId ? 'Listing updated successfully.' : 'Listing created successfully.');
      setEditingId(null);
      setForm((prev) => ({
        ...DEFAULT_FORM,
        sellerStudentId: prev.sellerStudentId || String(students[0]?.student_id || ''),
        courseId: prev.courseId || String(courses[0]?.course_id || ''),
      }));
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to save listing.');
    } finally {
      setIsSaving(false);
    }
  };

  const onEdit = (listing: Listing) => {
    setEditingId(listing.listing_id);
    setSuccessMessage('');
    setErrorMessage('');
    setForm({
      courseId: String(listing.course_id),
      ebookId: String(listing.ebook_id),
      sellerStudentId: String(listing.seller_student_id),
      tradeType: listing.trade_type,
      bookCondition: listing.book_condition,
      price: listing.price === null ? '' : String(Number(listing.price)),
      status: listing.status,
      note: listing.note || '',
    });
  };

  const onDelete = async (listingId: number) => {
    const accepted = window.confirm('Delete this listing? This action cannot be undone.');
    if (!accepted) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsDeleting(listingId);

    try {
      const response = await fetch(`/api/listings/${listingId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete listing.');
      }

      await loadListings();
      if (editingId === listingId) {
        resetForm();
      }
      setSuccessMessage('Listing deleted successfully.');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to delete listing.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isBootstrapping) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
        <p>Loading listings workspace...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-8">
        <header className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Requirement 1</p>
              <h1 className="text-3xl font-bold text-white">Manage Listings (CRUD)</h1>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400"
              >
                Home
              </Link>
              <Link
                href="/report"
                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400"
              >
                Report
              </Link>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            Students, courses, and ebooks in these dropdowns are loaded dynamically from PostgreSQL.
          </p>
        </header>

        {(errorMessage || successMessage) && (
          <section
            className={`rounded-lg border p-3 text-sm ${
              errorMessage
                ? 'border-rose-700 bg-rose-950/40 text-rose-200'
                : 'border-emerald-700 bg-emerald-950/40 text-emerald-200'
            }`}
          >
            {errorMessage || successMessage}
          </section>
        )}

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold text-cyan-200">
            {editingId ? `Edit Listing #${editingId}` : 'Create New Listing'}
          </h2>

          <form className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={onSubmit}>
            <label className="flex flex-col gap-1 text-sm">
              Course
              <select
                value={form.courseId}
                onChange={(event) => setForm((prev) => ({ ...prev, courseId: event.target.value }))}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                required
              >
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_code} - {course.course_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Ebook
              <select
                value={form.ebookId}
                onChange={(event) => setForm((prev) => ({ ...prev, ebookId: event.target.value }))}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                required
              >
                {ebooks.map((ebook) => (
                  <option key={ebook.ebook_id} value={ebook.ebook_id}>
                    {ebook.title} ({ebook.edition})
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Seller (Student)
              <select
                value={form.sellerStudentId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, sellerStudentId: event.target.value }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                required
              >
                {students.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Trade Type
              <select
                value={form.tradeType}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    tradeType: event.target.value as ListingFormState['tradeType'],
                    price: event.target.value === 'SWAP' ? '' : prev.price,
                  }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              >
                <option value="SELL">SELL</option>
                <option value="SWAP">SWAP</option>
                <option value="BOTH">BOTH</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Book Condition
              <select
                value={form.bookCondition}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    bookCondition: event.target.value as ListingFormState['bookCondition'],
                  }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              >
                <option value="NEW">NEW</option>
                <option value="LIKE_NEW">LIKE_NEW</option>
                <option value="GOOD">GOOD</option>
                <option value="FAIR">FAIR</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Status
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as ListingFormState['status'],
                  }))
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="RESERVED">RESERVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2 lg:col-span-1">
              Price (USD)
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                disabled={isSwapOnly}
                placeholder={isSwapOnly ? 'Must be empty for SWAP' : 'e.g. 25.00'}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2 lg:col-span-2">
              Note
              <textarea
                value={form.note}
                onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                placeholder="Optional note about condition, preferred swap, etc."
                rows={3}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : editingId ? 'Update Listing' : 'Create Listing'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-slate-600 px-4 py-2 text-sm transition hover:border-slate-400"
              >
                Reset
              </button>
              {selectedEbook && (
                <p className="text-sm text-slate-300">
                  Selected ebook: <span className="font-semibold text-cyan-200">{selectedEbook.title}</span>{' '}
                  by {selectedEbook.author}
                </p>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-cyan-200">Listings Table</h2>
            <button
              type="button"
              onClick={loadListings}
              className="rounded-md border border-slate-600 px-3 py-2 text-xs uppercase tracking-wide transition hover:border-cyan-400"
            >
              Refresh
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-300">Current rows: {listings.length}</p>

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
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Posted At</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.listing_id} className="border-b border-slate-800 align-top">
                    <td className="px-2 py-2 text-slate-300">{listing.listing_id}</td>
                    <td className="px-2 py-2">
                      <p className="font-medium text-slate-100">{listing.ebook_title}</p>
                      <p className="text-xs text-slate-400">{listing.ebook_author}</p>
                    </td>
                    <td className="px-2 py-2 text-slate-300">
                      {listing.course_code}
                      <p className="text-xs text-slate-400">{listing.course_name}</p>
                    </td>
                    <td className="px-2 py-2 text-slate-300">
                      {listing.seller_name}
                      <p className="text-xs text-slate-400">{listing.seller_email}</p>
                    </td>
                    <td className="px-2 py-2 text-slate-300">{listing.trade_type}</td>
                    <td className="px-2 py-2 text-slate-300">{listing.book_condition}</td>
                    <td className="px-2 py-2 text-slate-300">{formatPrice(listing.price)}</td>
                    <td className="px-2 py-2 text-slate-300">{listing.status}</td>
                    <td className="px-2 py-2 text-xs text-slate-400">{formatDate(listing.posted_at)}</td>
                    <td className="px-2 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(listing)}
                          className="rounded border border-slate-600 px-2 py-1 text-xs transition hover:border-cyan-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(listing.listing_id)}
                          disabled={isDeleting === listing.listing_id}
                          className="rounded border border-rose-600 px-2 py-1 text-xs text-rose-200 transition hover:border-rose-400 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isDeleting === listing.listing_id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                      {listing.note && <p className="mt-1 max-w-xs text-xs text-slate-400">{listing.note}</p>}
                    </td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr>
                    <td className="px-2 py-4 text-slate-300" colSpan={10}>
                      No listings found.
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
