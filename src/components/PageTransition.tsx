'use client';

import { usePathname } from 'next/navigation';

// Replays a soft fade + lift animation on every route change, giving the app
// a smoother, native-like feel between pages. Keying on the pathname remounts
// the wrapper so the CSS animation runs again on navigation.
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}
