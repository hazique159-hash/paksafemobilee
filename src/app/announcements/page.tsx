"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Announcement {
  id: string;
  title: string;
  content: string;
  target: "ALL" | "RETAILERS" | "USERS";
  priority: "NORMAL" | "IMPORTANT" | "URGENT";
  isActive: boolean;
  isPinned: boolean;
  author?: {
    id: string;
    name: string;
    role: string;
  } | null;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [targetFilter, setTargetFilter] = useState("ALL");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const userRole = (session?.user as any)?.role;

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (priorityFilter !== "ALL") params.append("priority", priorityFilter);
      if (targetFilter !== "ALL") params.append("target", targetFilter);

      const res = await fetch(`/api/announcements?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data || []);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnnouncements();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, priorityFilter, targetFilter]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1e1b4b] via-indigo-950 to-[#0d9488] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-teal-300 mb-4 border border-white/10">
              <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              PakSafe Official Bulletins
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Announcements & Safety Notices
            </h1>
            <p className="mt-3 text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed">
              Stay up-to-date with official security alerts, retailer policies, IMEI verification guidelines, and platform updates.
            </p>

            {userRole === "ADMIN" && (
              <div className="mt-6">
                <Link
                  href="/admin/announcements"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#1e1b4b] font-semibold text-sm hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 text-[#0d9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Manage / Post Announcements (Admin)
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search announcements by keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              />
              <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">🚨 Urgent Only</option>
                <option value="IMPORTANT">⚠️ Important Only</option>
                <option value="NORMAL">ℹ️ General Updates</option>
              </select>

              {userRole === "ADMIN" && (
                <select
                  value={targetFilter}
                  onChange={(e) => setTargetFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                >
                  <option value="ALL">All Audiences</option>
                  <option value="RETAILERS">Retailers Only</option>
                  <option value="USERS">Users Only</option>
                </select>
              )}
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-50 text-xs font-medium text-gray-600">
            <span className="text-gray-400">Filter by:</span>
            <button
              onClick={() => {
                setPriorityFilter("ALL");
                setTargetFilter("ALL");
                setSearch("");
              }}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                priorityFilter === "ALL" && targetFilter === "ALL" && !search
                  ? "bg-[#1e1b4b] text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              All Notices
            </button>
            <button
              onClick={() => setPriorityFilter("URGENT")}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                priorityFilter === "URGENT"
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Urgent Alerts
            </button>
            <button
              onClick={() => setPriorityFilter("IMPORTANT")}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                priorityFilter === "IMPORTANT"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              Important
            </button>
            <button
              onClick={() => setPriorityFilter("NORMAL")}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                priorityFilter === "NORMAL"
                  ? "bg-teal-600 text-white"
                  : "bg-teal-50 text-teal-800 hover:bg-teal-100"
              }`}
            >
              Platform Updates
            </button>
          </div>
        </div>

        {/* Announcement List */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0d9488] mx-auto mb-3"></div>
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1e1b4b]">No Announcements Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              There are currently no announcements matching your filters. Check back later for official notices.
            </p>
            {(search || priorityFilter !== "ALL" || targetFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearch("");
                  setPriorityFilter("ALL");
                  setTargetFilter("ALL");
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {announcements.map((item) => {
              const isUrgent = item.priority === "URGENT";
              const isImportant = item.priority === "IMPORTANT";

              return (
                <article
                  key={item.id}
                  className={`bg-white rounded-3xl p-6 sm:p-7 shadow-sm border transition-all duration-200 hover:shadow-md ${
                    item.isPinned
                      ? "border-amber-300 ring-1 ring-amber-200 bg-gradient-to-br from-amber-50/20 via-white to-white"
                      : isUrgent
                      ? "border-red-200 bg-gradient-to-br from-red-50/15 via-white to-white"
                      : "border-gray-100"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Badges & Meta */}
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Pinned badge */}
                        {item.isPinned && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 shadow-xs">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                            Pinned Notice
                          </span>
                        )}

                        {/* Priority badge */}
                        {isUrgent ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-800 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-red-600"></span>
                            URGENT SECURITY ALERT
                          </span>
                        ) : isImportant ? (
                          <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                            IMPORTANT NOTICE
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-[#0d9488]">
                            Platform Update
                          </span>
                        )}

                        {/* Target badge */}
                        {item.target === "RETAILERS" && (
                          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                            🏬 Retailers Only
                          </span>
                        )}
                        {item.target === "USERS" && (
                          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                            👤 Users Only
                          </span>
                        )}
                        {item.target === "ALL" && (
                          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                            🌐 All Users & Retailers
                          </span>
                        )}
                      </div>

                      <time className="text-xs text-gray-400 font-medium">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1e1b4b] tracking-tight">
                      {item.title}
                    </h2>

                    {/* Content Preview / Full */}
                    <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                      {item.content}
                    </p>

                    {/* Footer */}
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#1e1b4b] text-white flex items-center justify-center font-bold text-[10px]">
                          PS
                        </div>
                        <span className="font-medium text-gray-600">
                          {item.author?.name ? `${item.author.name} (PakSafe Admin)` : "PakSafe Administration"}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedAnnouncement(item)}
                        className="text-[#0d9488] font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        View Details
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Detailed Modal */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {selectedAnnouncement.isPinned && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Pinned
                      </span>
                    )}
                    {selectedAnnouncement.priority === "URGENT" && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                        Urgent Alert
                      </span>
                    )}
                    {selectedAnnouncement.priority === "IMPORTANT" && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                        Important
                      </span>
                    )}
                    {selectedAnnouncement.priority === "NORMAL" && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0d9488]">
                        General Info
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      Audience: {selectedAnnouncement.target === "ALL" ? "Everyone" : selectedAnnouncement.target}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e1b4b]">
                    {selectedAnnouncement.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Published on {new Date(selectedAnnouncement.createdAt).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="py-6 border-b border-gray-100">
                <div className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="text-xs text-gray-500">
                  Issued by: {selectedAnnouncement.author?.name || "PakSafe Official"}
                </span>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#1e1b4b] text-white font-semibold text-sm hover:bg-indigo-900 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
