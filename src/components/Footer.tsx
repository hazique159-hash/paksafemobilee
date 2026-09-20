import Link from 'next/link';

const ShieldIcon = () => (
  <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ShieldIcon />
              <span className="text-xl font-bold text-primary tracking-tight">PakSafe<span className="text-accent">Mobiles</span></span>
            </Link>
            <p className="text-sm text-slate-500 text-center md:text-left max-w-sm">
              Protecting Pakistan's mobile ecosystem with reliable IMEI verification and retailer networks.
            </p>
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <Link href="/check-imei" className="hover:text-primary transition-colors">Check IMEI</Link>
            <Link href="/retailers" className="hover:text-primary transition-colors">Find Retailers</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
          <p>&copy; {currentYear} PakSafeMobiles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
