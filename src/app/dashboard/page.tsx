'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "NORMAL" | "IMPORTANT" | "URGENT";
  isPinned: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ reportsCount: 0, totalChecked: 0 });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        try {
          const [statsRes, annRes] = await Promise.all([
            fetch('/api/user/stats'),
            fetch('/api/announcements?limit=3'),
          ]);

          if (statsRes.ok) {
            const data = await statsRes.json();
            setStats(data);
          }

          if (annRes.ok) {
            const data = await annRes.json();
            setAnnouncements(data);
          }
        } catch (error) {
          console.error('Failed to fetch dashboard data', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1e1b4b] mb-2 break-words">
          Welcome, {session?.user?.name || 'User'}!
        </h1>
        <p className="text-gray-500">
          Manage your account, IMEI checks, and view important safety notices.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 mb-1">My Reports</p>
          <p className="text-3xl font-bold text-[#0d9488]">{stats.reportsCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 mb-1">Total Checked</p>
          <p className="text-3xl font-bold text-[#1e1b4b]">{stats.totalChecked}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1e1b4b] mb-4 px-1">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/check-imei"
            className="group flex items-center p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-teal-100"
          >
            <div className="w-11 h-11 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="ml-3.5">
              <h3 className="font-semibold text-gray-900 text-sm">Check IMEI</h3>
              <p className="text-xs text-gray-500">Verify device status</p>
            </div>
          </Link>

          <Link
            href="/dashboard/report"
            className="group flex items-center p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-red-100"
          >
            <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3.5">
              <h3 className="font-semibold text-gray-900 text-sm">Report Stolen Phone</h3>
              <p className="text-xs text-gray-500">Add to stolen database</p>
            </div>
          </Link>

          <Link
            href="/retailers"
            className="group flex items-center p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-indigo-100"
          >
            <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-3.5">
              <h3 className="font-semibold text-gray-900 text-sm">Find Retailers</h3>
              <p className="text-xs text-gray-500">Trusted local shops</p>
            </div>
          </Link>

          <Link
            href="/dashboard/my-reports"
            className="group flex items-center p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-emerald-100"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="ml-3.5">
              <h3 className="font-semibold text-gray-900 text-sm">My Reports</h3>
              <p className="text-xs text-gray-500">Submitted IMEI records</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
