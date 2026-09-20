'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        if (res.error === 'EMAIL_NOT_VERIFIED') {
          setError('Please verify your email first.');
        } else if (res.error === 'RETAILER_NOT_APPROVED') {
          setShowPendingModal(true);
        } else if (res.error === 'ACCOUNT_LOCKED') {
          setShowLockedModal(true);
        } else {
          setError('Invalid email or password');
        }
        setLoading(false);
        return;
      }

      const session = await getSession();
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (session?.user?.role === 'RETAILER') {
        router.push('/retailer/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-8">
      {showLockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-lg transition-all duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Account Locked</h3>
            <p className="text-gray-600 mb-6">Your account has been locked by the admin. Please contact admin for assistance.</p>
            <button
              onClick={() => setShowLockedModal(false)}
              className="w-full bg-[#1e1b4b] text-white py-3 rounded-xl font-medium hover:bg-[#312e81] transition-all duration-200 min-h-[44px]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showPendingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-lg transition-all duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 mb-4">
              <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Account Pending Approval</h3>
            <p className="text-gray-600 mb-6">Your account has been submitted for admin verification. You will receive an email notification once your account is approved. Please wait for admin approval.</p>
            <button
              onClick={() => setShowPendingModal(false)}
              className="w-full bg-[#1e1b4b] text-white py-3 rounded-xl font-medium hover:bg-[#312e81] transition-all duration-200 min-h-[44px]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#1e1b4b] p-3 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-center">Log in to your PakSafe account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
            {error === 'Please verify your email first.' && (
              <Link href={`/verify-otp?email=${encodeURIComponent(email)}`} className="text-sm font-medium text-red-700 underline mt-1 inline-block">
                Verify Email Now
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200 min-h-[44px]"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200 min-h-[44px]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e1b4b] text-white py-3 rounded-xl font-medium hover:bg-[#312e81] focus:ring-4 focus:ring-[#1e1b4b]/20 disabled:opacity-70 transition-all duration-200 flex justify-center items-center min-h-[44px]"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-[#0d9488] hover:text-[#14b8a6] transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
