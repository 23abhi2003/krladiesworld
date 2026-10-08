'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardBody,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from '@heroui/react';
import {
  ShoppingBag,
  PlusCircle,
  TrendingUp,
  Receipt,
  Phone,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  MapPin,
  Filter,
  X,
  Trash2,
  Camera,
} from 'lucide-react';
import { useAuth } from '@/lib/Auth';
import { useLanguage } from '@/lib/LanguageContext';
import { apiFetch } from '@/lib/api';
import DashboardSearch from '@/components/DashboardSearch';
import {
  SareeIcon,
  BangleIcon,
  DressIcon,
  AccessoryIcon,
  GiftIcon,
} from '@/components/CategoryIcons';
import type { Order, DashboardStats, DashboardFilter } from '@/lib/types';

export default function DashboardPage() {
  const { user, isOwner } = useAuth();
  const { t, isTelugu } = useLanguage();

  const [stats, setStats] = useState<DashboardStats>({
    ordersCount: 0,
    totalBilled: 0,
    totalDue: 0,
    todayReceived: 0,
    totalReceived: 0,
    totalInvestments: 0,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<DashboardFilter>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        apiFetch('/api/dashboard/stats').catch(() => null),
        apiFetch('/api/orders').catch(() => null),
      ]);

      if (statsRes && statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (ordersRes && ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteOrder = async (id: string) => {
    if (!id) return;
    setDeletingId(id);
    try {
      const res = await apiFetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        apiFetch('/api/dashboard/stats')
          .then((r) => r.ok && r.json())
          .then((d) => d && setStats(d))
          .catch(() => {});
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter & Search Logic
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by card selection
    if (activeFilter === 'dues') {
      result = result.filter((o) => (Number(o.due_amount) || 0) > 0 || o.status === 'due');
    } else if (activeFilter === 'billed') {
      result.sort((a, b) => (Number(b.total_amount) || 0) - (Number(a.total_amount) || 0));
    } else if (activeFilter === 'received') {
      result = result.filter((o) => (Number(o.paid_amount) || 0) > 0);
    }

    // Filter by text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.customer_name?.toLowerCase().includes(q) ||
          o.customer_phone?.includes(q) ||
          o.id?.toLowerCase().includes(q) ||
          o.notes?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, activeFilter, searchQuery]);

  const toggleFilter = (filterKey: Exclude<DashboardFilter, null>) => {
    setActiveFilter((prev) => (prev === filterKey ? null : filterKey));
  };

  const getWhatsAppLink = (phone?: string, name?: string, due?: number) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    const intlPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = isTelugu
      ? `నమస్కారం ${name || 'గారు'}, కేఆర్ లేడీస్ వరల్డ్, చెక్కపల్లి గ్రామం నుండి. ${
          due && due > 0 ? `మీ ఆర్డర్ బ్యాలెన్స్ ₹${due}. ` : ''
        }మా వద్ద షాపింగ్ చేసినందుకు ధన్యవాదాలు! ఫోన్: 7661852180`
      : `Namaste ${name || 'Madam/Sir'}, greetings from KR Ladies World, Chekkapally Village. ${
          due && due > 0 ? `Your pending balance for your KR Ladies World order is ₹${due}. ` : ''
        }Thank you for shopping with us! Phone: 7661852180`;
    return `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Brand Hero Section */}
      <section className="text-center py-6 sm:py-8 flex flex-col items-center bg-white rounded-3xl border border-kr-gold/30 shadow-md p-6 relative overflow-hidden">
        {/* Decorative corner flourishes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-kr-gold/20 via-kr-blush to-transparent pointer-events-none rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-kr-maroon/10 via-kr-blush to-transparent pointer-events-none rounded-tr-full" />

        {/* Circular high-res logo with gold frame */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-kr-gold shadow-2xl bg-white mb-4 shrink-0 transition-transform duration-300 hover:scale-105">
          <Image
            src="/logo.png"
            alt="KR Ladies World Logo"
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-kr-maroon tracking-wider">
          {isTelugu ? 'కేఆర్ లేడీస్ వరల్డ్' : 'KR LADIES WORLD'}
        </h1>

        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-kr-gold font-bold mt-2">
          {isTelugu
            ? 'చీరలు • గాజులు • డ్రెస్సులు • చెక్కపల్లి గ్రామం'
            : 'Sarees • Bangles • Dresses • Chekkapally Village'}
        </p>

        {/* Categories Badge Bar */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-2.5 max-w-2xl">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-kr-blush text-kr-maroon border border-kr-blushBorder shadow-xs flex items-center gap-1.5 hover:bg-kr-maroon hover:text-white transition">
            <SareeIcon className="h-4 w-4 text-kr-gold" />
            <span>{t.sarees}</span>
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-kr-blush text-kr-maroon border border-kr-blushBorder shadow-xs flex items-center gap-1.5 hover:bg-kr-maroon hover:text-white transition">
            <BangleIcon className="h-4 w-4 text-kr-gold" />
            <span>{t.bangles}</span>
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-kr-blush text-kr-maroon border border-kr-blushBorder shadow-xs flex items-center gap-1.5 hover:bg-kr-maroon hover:text-white transition">
            <DressIcon className="h-4 w-4 text-kr-gold" />
            <span>{t.dresses}</span>
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-kr-blush text-kr-maroon border border-kr-blushBorder shadow-xs flex items-center gap-1.5 hover:bg-kr-maroon hover:text-white transition">
            <AccessoryIcon className="h-4 w-4 text-kr-gold" />
            <span>{t.accessories}</span>
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-kr-blush text-kr-maroon border border-kr-blushBorder shadow-xs flex items-center gap-1.5 hover:bg-kr-maroon hover:text-white transition">
            <GiftIcon className="h-4 w-4 text-kr-gold" />
            <span>{t.gifts}</span>
          </span>
        </div>

        {/* Contact info badges */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
            <MapPin className="h-3.5 w-3.5 text-kr-maroon" />
            {t.chekkapallyVillage}
          </span>
          <a
            href="tel:7661852180"
            className="flex items-center gap-1.5 text-white bg-kr-maroon hover:bg-kr-maroonDark px-3 py-1 rounded-full font-semibold transition shadow-sm"
          >
            <Phone className="h-3.5 w-3.5 text-kr-gold" />
            7661852180
          </a>
        </div>
      </section>

      {/* 2. Financial KPI Metric Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-kr-maroon">
              {isTelugu ? 'వ్యాపార గణాంకాలు' : 'Financial Overview'}
            </h2>
            <p className="text-xs text-gray-500">
              {isTelugu
                ? 'ఏ కార్డ్ పైనయినా నొక్కి ఆర్డర్లను ఫిల్టర్ చేయవచ్చు'
                : 'Click any card to filter recent orders below'}
            </p>
          </div>
          {activeFilter && (
            <Button
              size="sm"
              variant="flat"
              color="danger"
              startContent={<X className="h-3.5 w-3.5" />}
              onClick={() => setActiveFilter(null)}
              className="text-xs h-7"
            >
              {t.clearFilter}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Total Orders Card */}
          <Card
            isPressable
            onClick={() => setActiveFilter(null)}
            className={`border transition shadow-xs hover:shadow-md ${
              activeFilter === null
                ? 'border-kr-maroon bg-white ring-2 ring-kr-maroon/20'
                : 'border-kr-blushBorder bg-white'
            }`}
          >
            <CardBody className="p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">{t.dashTotalOrders}</span>
                <ShoppingBag className="h-4 w-4 text-kr-maroon" />
              </div>
              <p className="text-2xl font-bold font-serif text-kr-maroon mt-1">
                {stats.ordersCount || orders.length}
              </p>
              <span className="text-[10px] text-gray-400 mt-0.5">{isTelugu ? 'మొత్తం రికార్డులు' : 'Lifetime orders'}</span>
            </CardBody>
          </Card>

          {/* Total Billed Card */}
          <Card
            isPressable
            onClick={() => toggleFilter('billed')}
            className={`border transition shadow-xs hover:shadow-md ${
              activeFilter === 'billed'
                ? 'border-kr-gold bg-amber-50/40 ring-2 ring-kr-gold/30'
                : 'border-kr-blushBorder bg-white'
            }`}
          >
            <CardBody className="p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">{t.dashTotalBilled}</span>
                <Sparkles className="h-4 w-4 text-kr-gold" />
              </div>
              <p className="text-2xl font-bold font-serif text-gray-900 mt-1">
                ₹{Number(stats.totalBilled || 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-gray-400 mt-0.5">{isTelugu ? 'మొత్తం అమ్మకాల విలువ' : 'Gross sales booked'}</span>
            </CardBody>
          </Card>

          {/* Total Dues Card (High Priority) */}
          <Card
            isPressable
            onClick={() => toggleFilter('dues')}
            className={`border transition shadow-xs hover:shadow-md ${
              activeFilter === 'dues'
                ? 'border-red-600 bg-red-50 ring-2 ring-red-400'
                : 'border-red-200 bg-red-50/40 hover:border-red-400'
            }`}
          >
            <CardBody className="p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-red-700 font-bold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {t.dashPendingBalance}
                </span>
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                  {t.due}
                </span>
              </div>
              <p className="text-2xl font-bold font-serif text-red-700 mt-1">
                ₹{Number(stats.totalDue || 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-red-600 mt-0.5">
                {activeFilter === 'dues'
                  ? isTelugu ? 'ఫిల్టర్ చేయబడింది' : 'Filtered below'
                  : isTelugu ? 'బాకీలు చూడటానికి నొక్కండి' : 'Click to filter dues'}
              </span>
            </CardBody>
          </Card>

          {/* Today's Received Collection */}
          <Card
            isPressable
            onClick={() => toggleFilter('received')}
            className={`border transition shadow-xs hover:shadow-md ${
              activeFilter === 'received'
                ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-400'
                : 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400'
            }`}
          >
            <CardBody className="p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-semibold">{t.dashTodayReceived}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold font-serif text-emerald-700 mt-1">
                ₹{Number(stats.todayReceived || 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-600 mt-0.5">{isTelugu ? 'ఈరోజు వసూలు' : 'Daily counter collection'}</span>
            </CardBody>
          </Card>

          {/* Store Investments (Owner only) */}
          {isOwner ? (
            <Card
              as={Link}
              href="/investments"
              isPressable
              className="border border-kr-blushBorder bg-white shadow-xs hover:shadow-md transition text-left"
            >
              <CardBody className="p-3.5 sm:p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">{t.dashTotalInvestments}</span>
                  <TrendingUp className="h-4 w-4 text-kr-maroon" />
                </div>
                <p className="text-2xl font-bold font-serif text-kr-maroon mt-1">
                  ₹{Number(stats.totalInvestments || 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-gray-400 mt-0.5">{isTelugu ? 'సరుకు & ఇతర ఖర్చులు' : 'Stock & expenses'}</span>
              </CardBody>
            </Card>
          ) : (
            <Card className="border border-kr-blushBorder bg-white shadow-xs">
              <CardBody className="p-3.5 sm:p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">{t.dashTotalInvestments}</span>
                  <TrendingUp className="h-4 w-4 text-kr-maroon" />
                </div>
                <p className="text-2xl font-bold font-serif text-kr-maroon mt-1">
                  ₹{Number(stats.totalInvestments || 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-gray-400 mt-0.5">{isTelugu ? 'సరుకు & ఇతర ఖర్చులు' : 'Stock & expenses'}</span>
              </CardBody>
            </Card>
          )}
        </div>
      </section>

      {/* 4. Live Search & Filter Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-lg">
            <DashboardSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t.searchPlaceholder}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              as={Link}
              href="/orders/new"
              variant="flat"
              color="secondary"
              startContent={<Camera className="h-4 w-4 text-kr-maroon" />}
              className="bg-kr-blush border border-kr-gold/50 text-kr-maroon font-bold shadow-xs text-xs sm:text-sm"
            >
              {t.uploadSlipBtn}
            </Button>
            <Button
              as={Link}
              href="/orders/new"
              color="primary"
              startContent={<PlusCircle className="h-4 w-4" />}
              className="bg-kr-maroon text-white font-semibold shadow-sm w-full sm:w-auto"
            >
              {t.dashCreateNewOrder}
            </Button>
          </div>
        </div>

        {/* Active Filter Notification Banner */}
        {activeFilter && (
          <div className="flex items-center justify-between bg-amber-50 border border-kr-gold/40 px-4 py-2 rounded-xl text-xs text-kr-maroon font-medium">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-kr-gold" />
              <span>
                {t.filterActive}{' '}
                <strong className="uppercase font-bold">
                  {activeFilter === 'dues' ? t.tabDue : activeFilter}
                </strong>{' '}
                ({filteredOrders.length} {t.ordersCount})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              className="text-red-700 font-bold hover:underline"
            >
              {t.clearFilter}
            </button>
          </div>
        )}

        {/* 5. Orders Table with Call & WhatsApp quick actions */}
        <Card className="border border-kr-blushBorder bg-white shadow-sm overflow-hidden">
          <div className="p-4 bg-kr-blush/60 border-b border-kr-blushBorder flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-kr-maroon text-base">
                {t.dashRecentOrders}
              </h3>
              <p className="text-xs text-gray-500">
                {isTelugu
                  ? 'కాల్ మరియు వాట్సాప్ సదుపాయంతో తాజా ఆర్డర్లు'
                  : 'Live bookings with instant WhatsApp & Call quick actions'}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-kr-blushBorder text-gray-700">
              {filteredOrders.length} {t.ordersCount}
            </span>
          </div>

          <Table aria-label="Customer Orders" className="text-sm">
            <TableHeader>
              <TableColumn>{t.orderNumber}</TableColumn>
              <TableColumn>{t.date}</TableColumn>
              <TableColumn>{t.customerDetails}</TableColumn>
              <TableColumn className="text-right">{t.total}</TableColumn>
              <TableColumn className="text-right">{t.paid}</TableColumn>
              <TableColumn className="text-right">{t.due}</TableColumn>
              <TableColumn className="text-center">{t.status}</TableColumn>
              <TableColumn className="text-center">{t.actions}</TableColumn>
            </TableHeader>
            <TableBody emptyContent={t.dashNoOrdersYet}>
              {filteredOrders.slice(0, 15).map((order) => {
                const due = Number(order.due_amount || 0);
                const isPaid = due <= 0;

                return (
                  <TableRow key={order.id} className="hover:bg-kr-blush/40 transition">
                    <TableCell className="font-mono font-bold text-kr-maroon text-xs">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                      {order.order_date}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{order.customer_name}</p>
                        {order.customer_phone ? (
                          <p className="text-xs text-gray-500 font-mono">{order.customer_phone}</p>
                        ) : (
                          <span className="text-[10px] text-gray-400">{isTelugu ? 'ఫోన్ లేదు' : 'No phone'}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-gray-900">
                      ₹{Number(order.total_amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-emerald-700 font-semibold">
                      ₹{Number(order.paid_amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {due > 0 ? (
                        <span className="text-red-600">₹{due.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">₹0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Chip
                        size="sm"
                        color={isPaid ? 'success' : 'danger'}
                        variant="flat"
                        className="text-xs font-semibold"
                      >
                        {isPaid ? t.statusPaid : t.statusDue}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {order.customer_phone && (
                          <>
                            {/* Call Button */}
                            <Tooltip content={t.call}>
                              <a
                                href={`tel:${order.customer_phone}`}
                                className="p-1.5 rounded-lg bg-gray-100 hover:bg-kr-maroon hover:text-white text-gray-700 transition"
                                aria-label="Call customer"
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>
                            </Tooltip>

                            {/* WhatsApp Button */}
                            <Tooltip content={t.whatsapp}>
                              <a
                                href={getWhatsAppLink(order.customer_phone, order.customer_name, due)}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition"
                                aria-label="Send WhatsApp"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            </Tooltip>
                          </>
                        )}

                        {/* Delete Order Button */}
                        <Tooltip content={t.delete}>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            isLoading={deletingId === order.id}
                            onPress={() => handleDeleteOrder(order.id)}
                            className="text-red-500 hover:text-red-700 p-1.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredOrders.length > 15 && (
            <div className="p-3 text-center border-t border-kr-blushBorder bg-gray-50 text-xs">
              <Link href="/orders" className="text-kr-maroon font-bold hover:underline">
                {t.dashViewAllOrders} ({filteredOrders.length}) &rarr;
              </Link>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
