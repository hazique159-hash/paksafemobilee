'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'USER' | 'RETAILER'>('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    shopAddress: '',
    city: 'Karachi',
  });

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-500">Join PakSafe to secure your devices</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${role === 'USER' ? 'bg-white shadow-sm text-[#1e1b4b]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRole('USER')}
            type="button"
          >
            User
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${role === 'RETAILER' ? 'bg-white shadow-sm text-[#1e1b4b]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRole('RETAILER')}
            type="button"
          >
            Retailer
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200 min-h-[44px]" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200 min-h-[44px]" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200 min-h-[44px]" placeholder="03001234567" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200 min-h-[44px]" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200 min-h-[44px]" placeholder="••••••••" />
          </div>

          {role === 'RETAILER' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input type="text" name="shopName" required value={formData.shopName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200 min-h-[44px]" placeholder="My Mobile Shop" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Address</label>
                <input type="text" name="shopAddress" required value={formData.shopAddress} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200 min-h-[44px]" placeholder="123 Main St, Market Area" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:border-[#0d9488] outline-none transition-all duration-200 min-h-[44px] bg-white">
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e1b4b] text-white py-3 rounded-xl font-medium hover:bg-[#312e81] focus:ring-4 focus:ring-[#1e1b4b]/20 disabled:opacity-70 transition-all duration-200 flex justify-center items-center mt-6 min-h-[44px]"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#0d9488] hover:text-[#14b8a6] transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
