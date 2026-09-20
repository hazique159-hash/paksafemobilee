"use client";

import { useState, useEffect } from "react";

function ToggleSwitch({ isOn, onToggle, isLoading }: { isOn: boolean; onToggle: () => void; isLoading: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2 ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      } ${isOn ? "bg-green-500" : "bg-gray-300"}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isOn ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function ManageRetailers() {
  const [retailers, setRetailers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loadingToggles, setLoadingToggles] = useState<{ [key: string]: boolean }>({});

  const fetchRetailers = () => {
    setLoading(true);
    const params = new URLSearchParams({ search, status: statusFilter });
    fetch(`/api/admin/retailers?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setRetailers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRetailers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  const toggleStatus = async (id: string, field: "isApproved" | "isActive", currentValue: boolean) => {
    setLoadingToggles((prev) => ({ ...prev, [`${id}-${field}`]: true }));
    try {
      const res = await fetch(`/api/admin/retailers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      if (res.ok) {
        const updated = await res.json();
        setRetailers((prev) =>
          prev.map((r) => (r.id === id ? { ...r, [field]: updated[field] } : r))
        );
      } else {
        alert(`Failed to update ${field}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
    setLoadingToggles((prev) => ({ ...prev, [`${id}-${field}`]: false }));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e1b4b]">Manage Retailers</h1>
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0d9488] bg-white text-gray-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Approval</option>
            <option value="Approved">Approved & Active</option>
            <option value="Locked">Locked</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search shop or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading retailers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {retailers.map((retailer) => (
            <div
              key={retailer.id}
              className={`bg-white rounded-2xl shadow-sm border p-5 flex flex-col ${
                !retailer.isApproved ? "border-orange-300 bg-orange-50/10" : "border-gray-100"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{retailer.shopName || "Unnamed Shop"}</h3>
                  <p className="text-sm text-gray-500">{retailer.name}</p>
                </div>
                {!retailer.isApproved && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                    Pending
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-6 flex-grow">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {retailer.email}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {retailer.city || "No city"}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  {retailer._count?.PhoneListing || 0} phones listed
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">Approval Status</span>
                    <span className="text-xs text-gray-500">Can login and use platform</span>
                  </div>
                  <ToggleSwitch
                    isOn={retailer.isApproved}
                    onToggle={() => toggleStatus(retailer.id, "isApproved", retailer.isApproved)}
                    isLoading={!!loadingToggles[`${retailer.id}-isApproved`]}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">Account Active</span>
                    <span className="text-xs text-gray-500">Lock/unlock account</span>
                  </div>
                  <ToggleSwitch
                    isOn={retailer.isActive}
                    onToggle={() => toggleStatus(retailer.id, "isActive", retailer.isActive)}
                    isLoading={!!loadingToggles[`${retailer.id}-isActive`]}
                  />
                </div>
              </div>
            </div>
          ))}
          {retailers.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No retailers found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
