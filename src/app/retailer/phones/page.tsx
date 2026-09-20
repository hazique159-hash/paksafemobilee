"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Phone {
  id: string;
  brand: string;
  model: string;
  price: number;
  color: string;
  condition: string;
  status: string;
  image?: string;
}

export default function RetailerPhones() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPhones = async () => {
    try {
      const res = await fetch("/api/retailer/phones");
      if (res.ok) {
        const data = await res.json();
        setPhones(data);
      }
    } catch (error) {
      console.error("Error fetching phones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "AVAILABLE" ? "SOLD" : "AVAILABLE";
    try {
      const res = await fetch(`/api/retailer/phones/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setPhones(phones.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/retailer/phones/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPhones(phones.filter((p) => p.id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting phone:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0d9488]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Header Card Matching UI */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-300 flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e1b4b] tracking-tight leading-tight">
            My Phone<br />Listings
          </h1>
        </div>
        <Link
          href="/retailer/phones/add"
          className="bg-[#1e1b4b] hover:bg-[#312e81] text-white px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl font-bold text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 text-center min-w-[100px] sm:min-w-[130px]"
        >
          <span className="text-xl sm:text-lg font-bold leading-none">+</span>
          <span>Add Phone</span>
        </Link>
      </div>

      {phones.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0d9488]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#1e1b4b] mb-1">No phone listings yet</h3>
          <p className="text-slate-500 mb-6 text-sm">Start listing phones available in your shop to attract buyers.</p>
          <Link
            href="/retailer/phones/add"
            className="inline-flex items-center gap-2 bg-[#0d9488] hover:bg-[#14b8a6] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            <span>+ Add Your First Phone</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-300 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-5 py-4 border-b border-slate-200 text-sm font-bold text-slate-700 bg-slate-50/50">
            <div className="col-span-4 sm:col-span-4">Device</div>
            <div className="col-span-4 sm:col-span-3 text-left">Price</div>
            <div className="col-span-2 sm:col-span-3 text-center sm:text-left">Status</div>
            <div className="col-span-2 sm:col-span-2 text-right">Actions</div>
          </div>

          {/* Table / List Rows */}
          <div className="divide-y divide-slate-200">
            {phones.map((phone) => (
              <div
                key={phone.id}
                className="grid grid-cols-12 px-5 py-4 items-center hover:bg-slate-50/80 transition-colors gap-1"
              >
                {/* Device */}
                <div className="col-span-4 sm:col-span-4 pr-1">
                  <div className="font-bold text-[#1e1b4b] text-sm sm:text-base leading-snug">
                    {phone.brand}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-700">
                    {phone.model}
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-4 sm:col-span-3 pr-1">
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">Rs.</div>
                  <div className="text-sm sm:text-base font-bold text-[#0d9488] leading-tight">
                    {phone.price.toLocaleString()}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 sm:col-span-3 flex sm:justify-start justify-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold ${
                      phone.status === "AVAILABLE"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {phone.status.toLowerCase()}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-1.5 sm:gap-3">
                  <button
                    onClick={() => handleToggleStatus(phone.id, phone.status)}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title={phone.status === "AVAILABLE" ? "Mark as Sold" : "Mark as Available"}
                    aria-label="Toggle Status"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <Link
                    href={`/retailer/phones/edit/${phone.id}`}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Phone"
                    aria-label="Edit Phone"
                  >
                    <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Link>

                  <button
                    onClick={() => setDeleteId(phone.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Listing"
                    aria-label="Delete Listing"
                  >
                    <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1e1b4b] text-center mb-2">Delete Listing?</h3>
            <p className="text-slate-500 text-center mb-6 text-sm">
              Are you sure you want to delete this phone? This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="w-full py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors text-sm shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
