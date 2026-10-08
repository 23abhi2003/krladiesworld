'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  TrendingUp,
  BarChart3,
  PlusCircle,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Tooltip } from '@heroui/react';
import { useAuth } from '@/lib/Auth';
import { useLanguage } from '@/lib/LanguageContext';

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { isOwner } = useAuth();
  const { t, isTelugu } = useLanguage();

  const NAV_ITEMS = [
    { name: t.navDashboard, href: '/', icon: LayoutDashboard },
    { name: t.navCreateOrder, href: '/orders/new', icon: PlusCircle },
    { name: t.navOrdersRegister, href: '/orders', icon: ShoppingBag },
    { name: t.navDailyAmount, href: '/daily-receipts', icon: Receipt },
    { name: t.navInvestments, href: '/investments', icon: TrendingUp, ownerOnly: true },
    { name: t.navAnalytics, href: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-kr-blushBorder bg-white min-h-[calc(100vh-4rem)] transition-all duration-200 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation items */}
      <nav className={`py-4 flex-1 space-y-1.5 ${collapsed ? 'px-2' : 'px-3'}`}>
        {NAV_ITEMS.map((item) => {
          if (item.ownerOnly && !isOwner) return null;
          const Icon = item.icon;
          const isActive = pathname === item.href;

          const linkContent = (
            <Link
              href={item.href}
              className={`flex items-center gap-3 rounded-xl transition-all duration-150 ${
                collapsed ? 'justify-center py-3 px-2' : 'px-3.5 py-2.5'
              } ${
                isActive
                  ? 'bg-kr-maroon text-white font-semibold shadow-md shadow-kr-maroon/20'
                  : 'text-gray-700 hover:bg-kr-blush hover:text-kr-maroon'
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isActive ? 'text-kr-gold' : 'text-gray-500 group-hover:text-kr-maroon'
                }`}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm">{item.name}</span>
                  {item.ownerOnly && (
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-kr-gold/20 text-kr-gold">
                      {t.ownerOnly}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip
                key={item.href}
                content={item.name + (item.ownerOnly ? ` (${t.ownerOnly})` : '')}
                placement="right"
                delay={100}
              >
                <div>{linkContent}</div>
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </nav>

      {/* Footer Info / Badge */}
      <div
        className={`p-3 border-t border-kr-blushBorder bg-kr-blush/60 text-kr-textMuted ${
          collapsed ? 'text-center' : ''
        }`}
      >
        {collapsed ? (
          <div className="flex flex-col items-center justify-center py-1">
            <Sparkles className="h-4 w-4 text-kr-gold mb-1" />
            <span className="text-[9px] font-bold text-kr-maroon">KR</span>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-kr-maroon">
              <Sparkles className="h-3.5 w-3.5 text-kr-gold" />
              <span>{isTelugu ? 'కేఆర్ లేడీస్ వరల్డ్' : 'KR Ladies World'}</span>
            </div>
            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-kr-maroon shrink-0" />
              <span>{t.chekkapallyVillage}</span>
            </p>
            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              <Phone className="h-3 w-3 text-kr-maroon shrink-0" />
              <span>7661852180</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
export default Sidebar;
