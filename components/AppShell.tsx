'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Spinner } from '@heroui/react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { useAuth } from '@/lib/Auth';
import { useLanguage } from '@/lib/LanguageContext';

const SIDEBAR_COLLAPSED_KEY = 'kr_sidebar_collapsed';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t, isTelugu } = useLanguage();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored === 'true') {
        setCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Protect all non-login routes: If user is not logged in, immediately redirect to /login
  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // If on /login page, show the login view directly without sidebar/header
  if (pathname === '/login') {
    return <div className="min-h-screen bg-kr-blush">{children}</div>;
  }

  // If still checking authentication, show a branded loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-kr-blush flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="primary" />
        <p className="font-serif text-sm font-semibold text-kr-maroon tracking-wider">
          {isTelugu ? 'కేఆర్ లేడీస్ వరల్డ్' : 'KR LADIES WORLD'}
        </p>
      </div>
    );
  }

  // If not logged in, do not render dashboard while redirecting to /login
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-kr-blush text-gray-900 font-sans">
      <Header
        onToggleSidebar={toggleCollapsed}
        onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        collapsed={collapsed}
      />

      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <Sidebar collapsed={collapsed} />
        <MobileDrawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full min-w-0">
            {children}
          </main>

          <footer className="w-full border-t border-kr-blushBorder bg-white/70 py-4 text-center text-xs text-kr-textMuted px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="font-serif text-kr-maroon font-semibold">
                {isTelugu ? 'కేఆర్ లేడీస్ వరల్డ్' : 'KR LADIES WORLD'} &middot; {t.sarees}
              </p>
              <p className="text-gray-500">
                {t.chekkapallyVillage} &middot; {t.phone}: <span className="font-mono text-kr-maroon">7661852180</span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
export default AppShell;
