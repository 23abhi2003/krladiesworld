'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Globe,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
} from '@heroui/react';
import {
  SareeIcon,
  BangleIcon,
  DressIcon,
  AccessoryIcon,
  GiftIcon,
} from '@/components/CategoryIcons';
import { useAuth } from '@/lib/Auth';
import { useLanguage } from '@/lib/LanguageContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenMobileDrawer?: () => void;
  collapsed?: boolean;
}

export function Header({
  onToggleSidebar,
  onOpenMobileDrawer,
  collapsed = false,
}: HeaderProps) {
  const { user, logout, isOwner } = useAuth();
  const { lang, setLang, toggleLang, t, isTelugu } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-kr-gold/30 bg-gradient-to-r from-kr-maroonDark via-kr-maroon to-kr-maroonDark text-white shadow-md">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 w-full">
        {/* Left: Mobile Menu / Collapse Toggle + Brand */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            aria-label="Open navigation menu"
            className="md:hidden p-2 rounded-lg text-kr-goldLight hover:bg-white/10 transition"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop sidebar toggle button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex p-2 rounded-lg text-kr-goldLight hover:bg-white/10 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>

          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden border-2 border-kr-gold bg-white shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="KR Ladies World Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-wider text-kr-gold group-hover:text-kr-goldLight transition-colors">
                  {isTelugu ? 'కేఆర్ లేడీస్ వరల్డ్' : 'KR LADIES WORLD'}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-kr-goldLight/80 flex items-center gap-1">
                <span>{t.chekkapallyVillage}</span>
                <span>•</span>
                <span className="font-mono">7661852180</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Category Highlights (desktop only) */}
        <div className="hidden xl:flex items-center gap-1">
          <div className="text-xs bg-kr-maroonDark/90 border border-kr-gold/40 text-kr-goldLight px-3.5 py-1.5 rounded-full font-medium shadow-inner flex items-center gap-3">
            <span className="flex items-center gap-1"><SareeIcon className="h-3.5 w-3.5 text-kr-gold" /> {t.sarees}</span>
            <span className="text-kr-gold/30">•</span>
            <span className="flex items-center gap-1"><BangleIcon className="h-3.5 w-3.5 text-kr-gold" /> {t.bangles}</span>
            <span className="text-kr-gold/30">•</span>
            <span className="flex items-center gap-1"><DressIcon className="h-3.5 w-3.5 text-kr-gold" /> {t.dresses}</span>
            <span className="text-kr-gold/30">•</span>
            <span className="flex items-center gap-1"><AccessoryIcon className="h-3.5 w-3.5 text-kr-gold" /> {t.accessories}</span>
            <span className="text-kr-gold/30">•</span>
            <span className="flex items-center gap-1"><GiftIcon className="h-3.5 w-3.5 text-kr-gold" /> {t.gifts}</span>
          </div>
        </div>

        {/* Right: Language Switcher, Quick Action & User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switch Button */}
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-kr-maroonDark/80 hover:bg-kr-maroonDark border border-kr-gold/50 text-kr-gold text-xs font-bold transition shadow-sm hover:scale-105 active:scale-95"
            title={isTelugu ? 'Switch to English' : 'తెలుగులోకి మార్చండి'}
            aria-label="Change Language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">
              {isTelugu ? '🇮🇳 తెలుగు (EN)' : '🇬🇧 EN (తెలుగు)'}
            </span>
            <span className="xs:hidden">
              {isTelugu ? 'తెలుగు' : 'EN'}
            </span>
          </button>

          {/* Quick Create Order Button */}
          <Button
            as={Link}
            href="/orders/new"
            size="sm"
            color="secondary"
            startContent={<PlusCircle className="h-4 w-4" />}
            className="bg-kr-gold hover:bg-kr-goldLight text-kr-maroonDark font-bold shadow-sm transition text-xs sm:text-sm px-2.5 sm:px-4"
          >
            <span className="hidden sm:inline">{t.navCreateOrder}</span>
            <span className="sm:hidden">{isTelugu ? '+ఆర్డర్' : 'New'}</span>
          </Button>

          {/* User Auth Profile Dropdown */}
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button
                  type="button"
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full bg-kr-maroonDark/80 hover:bg-kr-maroonDark border border-kr-gold/40 transition text-left"
                >
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-kr-gold text-kr-maroonDark font-bold flex items-center justify-center text-xs shadow-inner">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden md:flex flex-col text-left pr-1 leading-tight">
                    <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-kr-goldLight uppercase font-medium">
                      {isOwner ? `👑 ${t.owner}` : t.staff}
                    </span>
                  </div>
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat" className="text-gray-800">
                <DropdownItem key="profile" className="h-14 gap-2 border-b border-gray-100" textValue="Signed in">
                  <p className="text-xs text-gray-500">{t.signedInAs}</p>
                  <p className="font-bold text-kr-maroon text-sm flex items-center gap-1.5">
                    {user.name}
                    <Chip size="sm" color={isOwner ? 'secondary' : 'default'} className="text-[10px] h-4">
                      {isOwner ? t.owner : t.staff}
                    </Chip>
                  </p>
                </DropdownItem>
                <DropdownItem
                  key="orders"
                  as={Link}
                  href="/orders"
                  startContent={<UserIcon className="h-4 w-4 text-gray-500" />}
                  textValue={t.navOrdersRegister}
                >
                  {t.navOrdersRegister}
                </DropdownItem>
                <DropdownItem
                  key="receipts"
                  as={Link}
                  href="/daily-receipts"
                  startContent={<Sparkles className="h-4 w-4 text-gray-500" />}
                  textValue={t.navDailyAmount}
                >
                  {t.navDailyAmount}
                </DropdownItem>
                <DropdownItem
                  key="switch"
                  as={Link}
                  href="/login"
                  startContent={<ShieldCheck className="h-4 w-4 text-kr-gold" />}
                  textValue={t.switchAccount}
                >
                  {t.switchAccount}
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  className="text-danger"
                  startContent={<LogOut className="h-4 w-4" />}
                  onPress={logout}
                  textValue={t.signOut}
                >
                  {t.signOut}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              as={Link}
              href="/login"
              size="sm"
              variant="bordered"
              startContent={<LogIn className="h-4 w-4 text-kr-gold" />}
              className="border-kr-gold/50 text-white hover:bg-white/10 text-xs sm:text-sm font-semibold"
            >
              {t.signIn}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
export default Header;
