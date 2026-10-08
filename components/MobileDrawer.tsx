'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Receipt,
  TrendingUp,
  BarChart3,
  X,
  LogIn,
  LogOut,
  Phone,
  MapPin,
  Globe,
} from 'lucide-react';
import { Button, Chip } from '@heroui/react';
import { useAuth } from '@/lib/Auth';
import { useLanguage } from '@/lib/LanguageContext';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { user, logout, isOwner } = useAuth();
  const { setLang, toggleLang, t, isTelugu } = useLanguage();

  const NAV_ITEMS = [
    { name: t.navDashboard, href: '/', icon: LayoutDashboard },
    { name: t.navCreateOrder, href: '/orders/new', icon: PlusCircle },
    { name: t.navOrdersRegister, href: '/orders', icon: ShoppingBag },
    { name: t.navDailyAmount, href: '/daily-receipts', icon: Receipt },
    { name: t.navInvestments, href: '/investments', icon: TrendingUp, ownerOnly: true },
    { name: t.navAnalytics, href: '/analytics', icon: BarChart3 },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col z-10 border-r border-kr-gold/30">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-kr-maroonDark to-kr-maroon text-white flex items-center justify-between border-b border-kr-gold/30">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-kr-gold shrink-0 bg-white shadow-sm">
              <Image
                src="/logo.png"
                alt="KR Ladies World Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-kr-gold tracking-wide leading-tight">
                {isTelugu ? 'కేఆర్ లేడీస్ వరల్డ్' : 'KR LADIES WORLD'}
              </h2>
              <p className="text-[10px] text-kr-goldLight/80">{t.chekkapallyVillage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-kr-goldLight hover:bg-white/10 transition"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Language Selection in Drawer */}
        <div className="p-3 bg-kr-blush border-b border-kr-blushBorder flex items-center justify-between">
          <span className="text-xs font-semibold text-kr-maroon flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-kr-gold" />
            {t.selectLanguage}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLang('te')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                isTelugu
                  ? 'bg-kr-maroon text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              తెలుగు
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                !isTelugu
                  ? 'bg-kr-maroon text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* User Status Bar */}
        <div className="px-4 py-3 bg-white border-b border-kr-blushBorder flex items-center justify-between">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-kr-maroon text-kr-gold flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 leading-none">{user.name}</p>
                <Chip size="sm" variant="flat" color={isOwner ? 'secondary' : 'default'} className="mt-1 text-[10px] h-4">
                  {user.role === 'owner' ? t.owner : t.staff}
                </Chip>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-gray-500">Not logged in</span>
              <Button
                as={Link}
                href="/login"
                onClick={onClose}
                size="sm"
                color="primary"
                className="bg-kr-maroon text-white text-xs h-7"
                startContent={<LogIn className="h-3.5 w-3.5" />}
              >
                {t.signIn}
              </Button>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          {NAV_ITEMS.map((item) => {
            if (item.ownerOnly && !isOwner) return null;
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-kr-maroon text-white shadow-sm'
                    : 'text-gray-700 hover:bg-kr-blush hover:text-kr-maroon'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-kr-gold' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Contact info & Logout */}
        <div className="p-4 border-t border-kr-blushBorder bg-kr-blush/40 space-y-3">
          <div className="space-y-1 text-xs text-kr-textMuted">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-kr-maroon shrink-0" />
              <span>{t.chekkapallyVillage}</span>
            </div>
            <a href="tel:7661852180" className="flex items-center gap-2 text-kr-maroon font-medium hover:underline">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>7661852180</span>
            </a>
          </div>

          {user && (
            <Button
              onClick={() => {
                logout();
                onClose();
              }}
              size="sm"
              variant="flat"
              color="danger"
              className="w-full text-xs font-semibold justify-center"
              startContent={<LogOut className="h-3.5 w-3.5" />}
            >
              {t.signOut} ({user.role === 'owner' ? t.owner : t.staff})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export default MobileDrawer;
