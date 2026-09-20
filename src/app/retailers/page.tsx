"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Retailer = {
  id: string;
  name: string;
  shopName: string;
  shopAddress: string;
  city: string;
  shopImage: string | null;
  phone: string;
  email: string;
  _count?: {
    phoneListings?: number;
  };
};

export default function RetailersPage() {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Hyderabad", "Sialkot"];

  const fetchRetailers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (city) params.append("city", city);
      
      const res = await fetch(`/api/retailers?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setRetailers(data.retailers || []);
      }
    } catch (error) {
      console.error("Error fetching retailers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRetailers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, city]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e1b4b] tracking-tight">
            Verified Retailers
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse verified mobile shops and available devices.
          </p>
        </div>

        {/* Search and Filters Matching UI screenshot */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
          <div>
            <input
              type="text"
              placeholder="Search shop name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none text-slate-800 text-base"
            />
          </div>
          
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none bg-white text-slate-700 text-base appearance-none cursor-pointer"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 animate-pulse space-y-4">
                <div className="h-44 bg-slate-200 rounded-2xl"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : retailers.length > 0 ? (
          <div className="space-y-6">
            {retailers.map((retailer) => (
              <div
                key={retailer.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Image Banner with Verified Badge */}
                <div className="h-48 sm:h-56 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                  {retailer.shopImage ? (
                    <img
                      src={retailer.shopImage}
                      alt={retailer.shopName || "Shop"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                      <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-xs text-slate-400 mt-2 font-medium">{retailer.shopName}</span>
                    </div>
                  )}

                  {/* Verified Badge */}
                  <div className="absolute top-3.5 right-3.5 bg-[#10b981] text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>VERIFIED</span>
                  </div>
                </div>

                {/* Card Info Matching xx.jpeg */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="text-xl font-extrabold text-[#1e1b4b]">
                    {retailer.shopName || retailer.name}
                  </h3>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium text-slate-700">{retailer.city}, {retailer.shopAddress}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#0d9488] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="font-semibold text-slate-900">{retailer.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#0d9488] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-slate-600 truncate">{retailer.email}</span>
                    </div>
                  </div>

                  {/* Card Bottom: Listed count + View Shop */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>{retailer._count?.phoneListings ?? 0} Listed</span>
                    </div>

                    <Link
                      href={`/retailers/${retailer.id}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-[#1e1b4b] hover:text-[#0d9488] transition-colors"
                    >
                      <span>View Shop</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-200">
            <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-base font-bold text-slate-800">No retailers found</h3>
            <p className="mt-1 text-xs text-slate-500">Try selecting a different city or clearing your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
