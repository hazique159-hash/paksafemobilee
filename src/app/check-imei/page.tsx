"use client";

import { useState } from "react";

export default function CheckIMEIPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const query = searchQuery.trim();
    if (!query) {
      setError("Please enter an IMEI number or Serial Number.");
      return;
    }

    if (query.length < 3) {
      setError("Please enter a valid IMEI or Serial Number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/imei/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to check status");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("An error occurred while checking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200/60 text-[#1e1b4b] mb-4">
            <svg className="w-8 h-8 text-[#1e1b4b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e1b4b] tracking-tight">
            IMEI & Serial Verification Portal
          </h1>
          <p className="mt-2 text-slate-600 text-sm max-w-xs mx-auto">
            Search an IMEI or serial number to check whether the device has been reported stolen or lost.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter 15-digit IMEI or Serial Number"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#1e1b4b]/80 focus:ring-4 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b] outline-none transition-all text-center text-lg font-bold text-[#1e1b4b] tracking-wider min-h-[52px] uppercase placeholder:normal-case placeholder:font-normal placeholder:text-base placeholder:tracking-normal"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-white bg-[#1e1b4b] hover:bg-[#312e81] focus:outline-none focus:ring-4 focus:ring-[#1e1b4b]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[48px] shadow-md active:scale-[0.99] cursor-pointer flex justify-center items-center text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Status"
              )}
            </button>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100 text-center font-medium">
                {error}
              </div>
            )}

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500 mt-4">
              <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>To find your IMEI, dial <strong className="text-slate-700">*#06#</strong> on your phone. You can also search by Serial Number found in Settings &gt; About or on the original box.</span>
            </div>
          </form>
        </div>
      </div>

      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            {result.status === "CLEAN" ? (
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-emerald-600 mb-1">STATUS: CLEAN</h3>
                <p className="text-xs text-slate-500 mb-4 font-medium tracking-wide">Search: {result.searchedQuery || searchQuery}</p>
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-sm font-medium mb-6">
                  This device has not been reported stolen or lost.
                </div>
                <button 
                  onClick={() => setResult(null)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6">
                {/* Modal Header Matching WhatsApp screenshot */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full border-2 border-rose-500 text-rose-500 shrink-0">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-rose-600 tracking-tight">STATUS: STOLEN</h3>
                      <p className="text-xs text-slate-500 font-semibold">Search: {result.searchedQuery || searchQuery}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setResult(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Warning message card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700 mb-5">
                  <p className="font-extrabold text-slate-900 text-sm pb-1 border-b border-slate-200">
                    WARNING: This device is reported as stolen
                  </p>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-600">Brand:</span>
                    <span className="font-semibold text-slate-900">{result.record.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-600">Model:</span>
                    <span className="font-semibold text-slate-900">{result.record.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-600">IMEI:</span>
                    <span className="font-semibold font-mono text-slate-900">{result.record.imei}</span>
                  </div>
                  {result.record.serialNumber && (
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-600">Serial No:</span>
                      <span className="font-semibold font-mono text-slate-900">{result.record.serialNumber}</span>
                    </div>
                  )}
                  {result.record.reportedBy?.name && (
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-600">Reported By:</span>
                      <span className="font-semibold text-slate-900">{result.record.reportedBy.name}</span>
                    </div>
                  )}
                  {result.record.reporterPhone && (
                    <div className="flex justify-between items-center text-rose-600 font-bold">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Reporter Phone:
                      </span>
                      <span>{result.record.reporterPhone}</span>
                    </div>
                  )}
                  {result.record.reporterEmail && (
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-600 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Reporter Email:
                      </span>
                      <span className="font-medium text-slate-900 truncate max-w-[150px]">{result.record.reporterEmail}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-500">
                    <span>Record Date:</span>
                    <span>{new Date(result.record.reportDate).toISOString().split('T')[0]}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setResult(null)}
                  className="w-full py-3 bg-[#1e1b4b] hover:bg-[#312e81] text-white font-bold rounded-xl transition-colors text-sm shadow-sm"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
