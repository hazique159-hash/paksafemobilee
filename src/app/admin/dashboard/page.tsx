"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
      <h1 className="text-2xl md:text-3xl font-bold text-[#1e1b4b]">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#1e1b4b] mt-1">{stats?.totalUsers || 0}</p>
          </div>
          <div className="h-11 w-11 bg-blue-50 rounded-xl flex items-center justify-center text-[#1e1b4b]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        {/* Total Retailers */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Retailers</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#1e1b4b] mt-1">{stats?.totalRetailers || 0}</p>
          </div>
          <div className="h-11 w-11 bg-teal-50 rounded-xl flex items-center justify-center text-[#0d9488]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between bg-orange-50/30">
          <div>
            <p className="text-xs text-orange-600 font-medium">Pending Approvals</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">{stats?.pendingRetailers || 0}</p>
          </div>
          <div className="h-11 w-11 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Total Stolen IMEIs */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-red-500 font-medium">Stolen Reports</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">{stats?.totalStolenIMEIs || 0}</p>
          </div>
          <div className="h-11 w-11 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-600 font-medium">Announcements</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-700 mt-1">{stats?.totalAnnouncements || 0}</p>
          </div>
          <div className="h-11 w-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base font-bold text-[#1e1b4b]">Live Announcements</h2>
            <Link href="/admin/announcements" className="text-xs font-semibold text-[#0d9488] hover:underline">Manage</Link>
          </div>
          <div className="p-0">
            {stats?.recentAnnouncements?.map((item: any) => (
              <div key={item.id} className="p-4 border-b border-gray-50 flex flex-col gap-1 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900 text-sm truncate">{item.title}</p>
                  {item.priority === "URGENT" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Urgent</span>
                  )}
                  {item.priority === "IMPORTANT" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Important</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Audience: {item.target}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {(!stats?.recentAnnouncements || stats.recentAnnouncements.length === 0) && (
              <div className="p-6 text-center text-gray-500 text-sm">
                No announcements yet.
                <div className="mt-2">
                  <Link href="/admin/announcements" className="text-xs text-[#0d9488] font-semibold hover:underline">Create One</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base font-bold text-[#1e1b4b]">Recent Users</h2>
            <Link href="/admin/users" className="text-xs font-semibold text-[#0d9488] hover:underline">View All</Link>
          </div>
          <div className="p-0">
            {stats?.recentUsers?.map((user: any) => (
              <div key={user.id} className="p-4 border-b border-gray-50 flex items-center justify-between last:border-0 hover:bg-gray-50 transition-colors">
                <div className="truncate mr-2">
                  <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
              <p className="p-6 text-center text-gray-500 text-sm">No recent users found.</p>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base font-bold text-[#1e1b4b]">Recent Stolen Reports</h2>
            <Link href="/admin/stolen-imeis" className="text-xs font-semibold text-[#0d9488] hover:underline">View All</Link>
          </div>
          <div className="p-0">
            {stats?.recentReports?.map((report: any) => (
              <div key={report.id} className="p-4 border-b border-gray-50 flex items-center justify-between last:border-0 hover:bg-gray-50 transition-colors">
                <div className="truncate mr-2">
                  <p className="font-medium text-gray-900 text-sm">{report.brand} {report.model}</p>
                  <p className="text-xs text-gray-500 font-mono">IMEI: {report.imei}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {(!stats?.recentReports || stats.recentReports.length === 0) && (
              <p className="p-6 text-center text-gray-500 text-sm">No recent reports found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
