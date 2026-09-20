import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
          <div className="bg-teal-500/10 p-4 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Verify & Protect Your Mobile Device
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mb-10">
            Pakistan's trusted platform for IMEI verification and stolen phone recovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/check-imei" 
              className="inline-flex justify-center items-center px-8 py-3 rounded-xl bg-teal-500 text-white font-medium hover:bg-teal-600 transition-all duration-200 shadow-lg shadow-teal-500/30"
            >
              Check IMEI
            </Link>
            <Link 
              href="/retailers" 
              className="inline-flex justify-center items-center px-8 py-3 rounded-xl bg-transparent border-2 border-white/20 text-white font-medium hover:bg-white/10 transition-all duration-200"
            >
              Find Retailers
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why choose PakSafeMobiles?</h2>
            <p className="mt-4 text-slate-600">Comprehensive protection for your mobile devices.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">IMEI Verification</h3>
              <p className="text-slate-600">Instantly check if a device has been reported stolen before you buy it.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Report Stolen Phone</h3>
              <p className="text-slate-600">Register your stolen device's IMEI to prevent unauthorized resale.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Verified Retailers</h3>
              <p className="text-slate-600">Find trusted mobile retailers near you for safe and secure purchases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-4 text-slate-600">Three simple steps to ensure a safe mobile purchase.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
            
            <div className="bg-white p-6 w-full md:w-1/3 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-indigo-600/20">1</div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Search IMEI</h4>
              <p className="text-sm text-slate-600">Dial *#06# on the phone to get the 15-digit IMEI number.</p>
            </div>
            
            <div className="bg-white p-6 w-full md:w-1/3 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-indigo-600/20">2</div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Get Results</h4>
              <p className="text-sm text-slate-600">Enter the IMEI in our portal to instantly check its status.</p>
            </div>
            
            <div className="bg-white p-6 w-full md:w-1/3 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-teal-500/20">3</div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Stay Safe</h4>
              <p className="text-sm text-slate-600">Buy with confidence knowing the device is completely clean.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Trusted by thousands across Pakistan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-teal-400 mb-2">50K+</div>
              <div className="text-indigo-200">IMEIs Checked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-400 mb-2">10K+</div>
              <div className="text-indigo-200">Stolen Reports</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-400 mb-2">500+</div>
              <div className="text-indigo-200">Verified Retailers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-400 mb-2">24/7</div>
              <div className="text-indigo-200">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
