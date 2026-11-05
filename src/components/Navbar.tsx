'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { createPortal } from 'react-dom';

const ShieldIcon = () => (
  <svg className="w-8 h-8 text-[#0d9488]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const HamburgerIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Define links based on role
  const getNavLinks = () => {
    const unauthLinks = [
      { name: 'Check IMEI', path: '/check-imei' },
      { name: 'Find Retailers', path: '/retailers' },
    ];

    if (status === 'loading') return unauthLinks;

    if (!session?.user) {
      return [
        ...unauthLinks,
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
      ];
    }

    const role = (session.user as any)?.role;

    switch (role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin/dashboard' },
          { name: 'Users', path: '/admin/users' },
          { name: 'Retailers', path: '/admin/retailers' },
          { name: 'Stolen IMEIs', path: '/admin/stolen-imeis' },
        ];
      case 'RETAILER':
        return [
          { name: 'Dashboard', path: '/retailer/dashboard' },
          { name: 'My Phones', path: '/retailer/phones' },
          { name: 'Report Stolen', path: '/retailer/report-stolen' },
          { name: 'Check IMEI', path: '/check-imei' },
        ];
      case 'USER':
      default:
        return [
          { name: 'Check IMEI', path: '/check-imei' },
          { name: 'Find Retailers', path: '/retailers' },
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Report Stolen', path: '/dashboard/report' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <ShieldIcon />
              <span className="text-xl font-bold text-[#1e1b4b] tracking-tight">
                PakSafe<span className="text-[#0d9488]">Mobiles</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#1e1b4b]/10 text-[#1e1b4b] font-semibold'
                        : 'text-slate-600 hover:text-[#1e1b4b] hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {session && (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 ml-2 cursor-pointer"
                >
                  Logout
                </button>
              )}
            </nav>

            {/* Mobile menu hamburger button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="p-2.5 rounded-xl text-slate-700 hover:text-[#1e1b4b] hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Render Mobile Drawer & Backdrop in Portal to escape any header stacking/blur context */}
      {mounted &&
        createPortal(
          <div className={`fixed inset-0 z-[9999] md:hidden ${isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
            {/* Backdrop */}
            <div
              className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div
              className={`fixed top-0 bottom-0 right-0 w-full sm:w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                  <ShieldIcon />
                  <span className="font-bold text-[#1e1b4b] text-base">PakSafeMobiles</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-500 hover:text-[#1e1b4b] rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* User badge if logged in */}
              {session?.user && (
                <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Logged in as</p>
                  <p className="font-bold text-[#1e1b4b] truncate text-sm mt-0.5">{session.user.name || 'User'}</p>
                  <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-[#0d9488]">
                    {(session.user as any).role || 'USER'}
                  </span>
                </div>
              )}

              {/* Nav links */}
              <div className="flex-1 py-4 px-4 overflow-y-auto flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-[#1e1b4b] text-white font-semibold shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                {session ? (
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-center py-3 rounded-xl text-base font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 cursor-pointer"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-[#1e1b4b] border border-slate-300 hover:bg-slate-100 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0d9488] hover:bg-[#14b8a6] transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
