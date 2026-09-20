'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all filled
    if (newOtp.every((digit) => digit !== '') && !newOtp.includes('')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode: string) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      if (data.role === 'RETAILER') {
        setSuccessMsg('Email verified! Your account is pending admin approval. You will be notified once approved.');
        setTimeout(() => router.push('/login'), 5000);
      } else {
        setSuccessMsg('Email verified successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setError(null);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to resend OTP');
      
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError('Could not resend OTP. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mb-6">
          <svg className="h-8 w-8 text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
        <p className="text-gray-500 mb-8">
          We've sent a 6-digit verification code to<br />
          <span className="font-medium text-gray-900">{email}</span>
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-left">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-[#10b981] rounded-md text-left">
            <p className="text-sm text-green-800">{successMsg}</p>
          </div>
        )}

        <div className="flex justify-between gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200"
              disabled={loading || !!successMsg}
            />
          ))}
        </div>

        <button
          onClick={() => handleVerify(otp.join(''))}
          disabled={loading || otp.join('').length !== 6 || !!successMsg}
          className="w-full bg-[#1e1b4b] text-white py-3 rounded-xl font-medium hover:bg-[#312e81] focus:ring-4 focus:ring-[#1e1b4b]/20 disabled:opacity-70 transition-all duration-200 flex justify-center items-center min-h-[44px] mb-6"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Verify Email'
          )}
        </button>

        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={countdown > 0 || loading || !!successMsg}
            className="font-medium text-[#0d9488] hover:text-[#14b8a6] disabled:text-gray-400 transition-colors"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e1b4b]"></div>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
