"use client";

import { useState, useEffect } from "react";

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
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalCount: number;
  activeCount: number;
  pinnedCount: number;
  retailersCount: number;
  usersCount: number;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCount: 0,
    activeCount: 0,
    pinnedCount: 0,
    retailersCount: 0,
    usersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [targetFilter, setTargetFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    target: "ALL" as "ALL" | "RETAILERS" | "USERS",
    priority: "NORMAL" as "NORMAL" | "IMPORTANT" | "URGENT",
    isPinned: false,
    isActive: true,
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (targetFilter !== "ALL") params.append("target", targetFilter);
      if (priorityFilter !== "ALL") params.append("priority", priorityFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/admin/announcements?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
        if (data.stats) setStats(data.stats);
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
  }, [search, targetFilter, priorityFilter, statusFilter]);

  const showToast = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const handleOpenCreate = () => {
    setFormData({
      title: "",
      content: "",
      target: "ALL",
      priority: "NORMAL",
      isPinned: false,
      isActive: true,
    });
    setEditingAnnouncement(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setFormData({
      title: item.title,
      content: item.content,
      target: item.target,
      priority: item.priority,
      isPinned: item.isPinned,
      isActive: item.isActive,
    });
    setEditingAnnouncement(item);
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please provide both title and content.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAnnouncement) {
        // Update
        const res = await fetch(`/api/admin/announcements/${editingAnnouncement.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          showToast("Announcement updated successfully!");
          setIsCreateModalOpen(false);
          fetchAnnouncements();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to update announcement");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          showToast("Announcement published successfully!");
          setIsCreateModalOpen(false);
          fetchAnnouncements();
        } else {
          const err = await res.json();
          alert(err.error || "Failed to create announcement");
        }
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/announcements/${deletingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Announcement deleted successfully.");
        setDeletingId(null);
        fetchAnnouncements();
      } else {
        alert("Failed to delete announcement.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePin = async (item: Announcement) => {
    try {
      const res = await fetch(`/api/admin/announcements/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !item.isPinned }),
      });
      if (res.ok) {
        showToast(item.isPinned ? "Announcement unpinned" : "Announcement pinned to top");
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (item: Announcement) => {
    try {
      const res = await fetch(`/api/admin/announcements/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) {
        showToast(item.isActive ? "Announcement deactivated" : "Announcement activated");
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1b4b] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-teal-500/30 animate-bounce">
          <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-semibold">{actionSuccessMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e1b4b] flex items-center gap-2">
            <svg className="w-8 h-8 text-[#0d9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Announcements Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Broadcast updates, security alerts, and instructions to retailers and users
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-medium shadow-md shadow-teal-700/20 transition-all duration-200 cursor-pointer text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Announcement
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Broadcasts</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#1e1b4b] mt-1">{stats.totalCount}</p>
          </div>
          <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active & Live</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">{stats.activeCount}</p>
          </div>
          <div className="h-11 w-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Pinned Notices</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">{stats.pinnedCount}</p>
          </div>
          <div className="h-11 w-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Retailer / User Targeted</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#0d9488] mt-1">
              {stats.retailersCount} / {stats.usersCount}
            </p>
          </div>
          <div className="h-11 w-11 bg-teal-50 rounded-xl flex items-center justify-center text-[#0d9488]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search announcements by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Target Filter */}
          <select
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
          >
            <option value="ALL">Audience: All</option>
            <option value="ALL">Everyone (Users & Retailers)</option>
            <option value="RETAILERS">Retailers Only</option>
            <option value="USERS">Users Only</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
          >
            <option value="ALL">Priority: All</option>
            <option value="NORMAL">Normal</option>
            <option value="IMPORTANT">Important</option>
            <option value="URGENT">Urgent / Alert</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
          >
            <option value="ALL">Status: All</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0d9488] mx-auto mb-3"></div>
          Loading announcements...
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">No Announcements Found</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            {search || targetFilter !== "ALL" || priorityFilter !== "ALL" || statusFilter !== "ALL"
              ? "No announcements match your search criteria. Try resetting filters."
              : "You haven't posted any announcements yet. Create one to keep retailers and users notified."}
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
          >
            Create First Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => {
            const isUrgent = item.priority === "URGENT";
            const isImportant = item.priority === "IMPORTANT";

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${
                  item.isPinned
                    ? "border-amber-300 ring-1 ring-amber-200/60 bg-gradient-to-r from-amber-50/20 via-white to-white"
                    : isUrgent
                    ? "border-red-200"
                    : "border-gray-100"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Content & Badges */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Pinned badge */}
                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          Pinned
                        </span>
                      )}

                      {/* Priority badge */}
                      {isUrgent ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          Urgent Notice
                        </span>
                      ) : isImportant ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                          Important
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          General
                        </span>
                      )}

                      {/* Target audience badge */}
                      {item.target === "ALL" && (
                        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                          👥 Everyone (Users & Retailers)
                        </span>
                      )}
                      {item.target === "RETAILERS" && (
                        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
                          🏬 Retailers Only
                        </span>
                      )}
                      {item.target === "USERS" && (
                        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                          👤 Users Only
                        </span>
                      )}

                      {/* Active / Inactive Status */}
                      {item.isActive ? (
                        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                          Active & Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                          Draft / Inactive
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg md:text-xl font-bold text-[#1e1b4b]">
                      {item.title}
                    </h2>

                    <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                      <span>Posted: {new Date(item.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
                      {item.author && <span>By: {item.author.name} (Admin)</span>}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 shrink-0">
                    {/* Pin/Unpin button */}
                    <button
                      onClick={() => handleTogglePin(item)}
                      title={item.isPinned ? "Unpin announcement" : "Pin announcement to top"}
                      className={`p-2.5 rounded-xl border text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        item.isPinned
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <svg className="w-4 h-4" fill={item.isPinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="hidden sm:inline">{item.isPinned ? "Unpin" : "Pin"}</span>
                    </button>

                    {/* Active toggle button */}
                    <button
                      onClick={() => handleToggleActive(item)}
                      title={item.isActive ? "Hide / Deactivate" : "Publish / Activate"}
                      className={`p-2.5 rounded-xl border text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        item.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="hidden sm:inline">{item.isActive ? "Live" : "Draft"}</span>
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2.5 rounded-xl border border-gray-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex items-center gap-1.5 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-2.5 rounded-xl border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center gap-1.5 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Announcement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#1e1b4b] flex items-center gap-2">
                <svg className="w-6 h-6 text-[#0d9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Announcement Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Security Update: New Verification Policy for Mobile Retailers"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488] text-sm"
                />
              </div>

              {/* Target & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Target Audience <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488] text-sm bg-white"
                  >
                    <option value="ALL">👥 Everyone (Users & Retailers)</option>
                    <option value="RETAILERS">🏬 Retailers Only</option>
                    <option value="USERS">👤 General Users Only</option>
                  </select>
                </div>

                {/* Priority Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488] text-sm bg-white"
                  >
                    <option value="NORMAL">Normal / Informational</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="URGENT">🚨 Urgent / Security Alert</option>
                  </select>
                </div>
              </div>

              {/* Content / Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Announcement Message / Body <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Write full announcement details here. You can include paragraphs, guidelines, links, or contact instructions..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488] text-sm leading-relaxed"
                ></textarea>
              </div>

              {/* Toggles */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="w-4 h-4 text-[#0d9488] rounded border-gray-300 focus:ring-[#0d9488]"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#1e1b4b]">Pin Announcement</span>
                    <p className="text-xs text-gray-500">Keep highlighted at the top of the feed</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#0d9488] rounded border-gray-300 focus:ring-[#0d9488]"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#1e1b4b]">Active (Live)</span>
                    <p className="text-xs text-gray-500">Immediately visible to targeted audience</p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0d9488] text-white hover:bg-[#0f766e] transition-colors text-sm font-semibold flex items-center gap-2 shadow-md shadow-teal-700/20"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : editingAnnouncement ? (
                    "Update Announcement"
                  ) : (
                    "Publish Announcement"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Announcement?</h3>
            <p className="text-center text-gray-600 text-sm mb-6">
              Are you sure you want to permanently remove this announcement? This action cannot be undone and it will no longer be visible to users or retailers.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-semibold flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
