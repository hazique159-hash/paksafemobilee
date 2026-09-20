"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Stats {
  shopStatus: string;
  phoneCount: number;
  shopName: string;
  city: string;
}

export default function RetailerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/retailer/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  if (loading || status === "loading") {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1e1b4b] break-words">
          Welcome, {session?.user?.name || "Retailer"}
        </h1>
        <p className="text-gray-500 mt-1">Here is an overview of your shop</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Shop Status */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center items-start">
          <span className="text-sm text-gray-500 mb-1">Shop Status</span>
          {stats?.shopStatus === "Approved" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Approved
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Pending
            </span>
          )}
        </div>

        {/* My Phones */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center items-start">
          <span className="text-sm text-gray-500 mb-1">My Phones</span>
          <span className="text-2xl font-bold text-[#1e1b4b]">{stats?.phoneCount || 0}</span>
        </div>

        {/* Shop Name */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center items-start">
          <span className="text-sm text-gray-500 mb-1">Shop</span>
          <span className="text-lg font-semibold text-[#1e1b4b] truncate w-full">
            {stats?.shopName || "Not Set"}
          </span>
        </div>

        {/* City */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center items-start">
          <span className="text-sm text-gray-500 mb-1">City</span>
          <span className="text-lg font-semibold text-[#0d9488] truncate w-full">
            {stats?.city || "Not Set"}
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[#1e1b4b] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <Link href="/retailer/phones" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center group">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-100 transition-colors">
              <svg className="w-6 h-6 text-[#1e1b4b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-[#1e1b4b]">Manage Phones</h3>
            <p className="text-sm text-gray-500 mt-1">{stats?.phoneCount || 0} listed</p>
          </Link>

          <Link href="/retailer/phones/add" className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-teal-300 hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 flex flex-col items-center justify-center text-center group">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
              <svg className="w-6 h-6 text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-medium text-[#0d9488]">Add New Phone</h3>
          </Link>

          <Link href="/check-imei" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center group">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-medium text-[#1e1b4b]">Check IMEI</h3>
            <p className="text-sm text-gray-500 mt-1">Verify status</p>
          </Link>
          
          <Link href="/retailer/report-stolen" className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-red-300 hover:border-red-500 hover:bg-red-50 transition-all duration-200 flex flex-col items-center justify-center text-center group">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
              <svg className="w-6 h-6 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-medium text-[#ef4444]">Report Stolen</h3>
            <p className="text-sm text-gray-500 mt-1">Flag a device</p>
          </Link>

          <Link href="/retailer/profile" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center group">
             <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-100 transition-colors">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-medium text-[#1e1b4b]">Edit Profile</h3>
            <p className="text-sm text-gray-500 mt-1">Shop details</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
