'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function RetailerReportStolenPage() {
  const { data: session } = useSession();
  
  const [formData, setFormData] = useState({
    imei: '',
    brand: '',
    model: '',
    description: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [userProfile, setUserProfile] = useState<{ name: string; phone: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setUserProfile(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/imei/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Report submitted successfully.');
        setFormData({ imei: '', brand: '', model: '', description: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to submit report.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  const displayPhone = userProfile?.phone || (session?.user as any)?.phone || '';
  const displayEmail = userProfile?.email || session?.user?.email || '';

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 mt-6 sm:mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Report Submitted</h2>
          <p className="text-gray-600">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => setStatus('idle')}
              className="w-full sm:w-auto px-6 py-3 bg-[#0d9488] text-white rounded-xl hover:bg-[#14b8a6] transition-colors font-medium min-h-[44px]"
            >
              Report Another
            </button>
            <Link
              href="/retailer/dashboard"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium min-h-[44px] flex items-center justify-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <Link href="/retailer/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1e1b4b]">Report Stolen Phone</h1>
        </div>

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="imei" className="block text-sm font-medium text-slate-700 mb-1.5">
              IMEI Number (15 digits) *
            </label>
            <input
              type="text"
              id="imei"
              name="imei"
              required
              maxLength={15}
              pattern="\d{15}"
              inputMode="numeric"
              title="IMEI must be exactly 15 digits"
              value={formData.imei}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all text-base min-h-[44px]"
              placeholder="Enter 15-digit IMEI"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-slate-700 mb-1.5">
                Brand *
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all text-base min-h-[44px]"
                placeholder="e.g. Samsung"
              />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-slate-700 mb-1.5">
                Model *
              </label>
              <input
                type="text"
                id="model"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all text-base min-h-[44px]"
                placeholder="e.g. Galaxy S23"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all resize-none text-base"
              placeholder="Any details about the theft or distinguishing features..."
            ></textarea>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reporter Information
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              This contact information will be shown to users and retailers when checking this IMEI.
            </p>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="font-medium text-slate-500">Email:</span>
                <span className="font-semibold">{displayEmail || 'Loading...'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-slate-500">Phone:</span>
                <span className="font-semibold text-[#0d9488]">{displayPhone || 'Loading...'}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3.5 px-4 bg-[#1e1b4b] hover:bg-[#312e81] text-white font-semibold rounded-xl transition-colors outline-none focus:ring-4 focus:ring-[#1e1b4b]/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 min-h-[48px] shadow-sm"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Report...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
