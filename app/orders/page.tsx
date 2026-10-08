'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Tooltip,
  Tabs,
  Tab,
} from '@heroui/react';
import Link from 'next/link';
import { PlusCircle, Phone, MessageCircle, ArrowLeft, Trash2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import DashboardSearch from '@/components/DashboardSearch';
import type { Order } from '@/lib/types';

export default function OrdersPage() {
  const { t, isTelugu } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'due' | 'paid'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOrders = () => {
    apiFetch('/api/orders')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setOrders(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
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
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (selectedTab === 'due') {
      result = result.filter((o) => (Number(o.due_amount) || 0) > 0 || o.status === 'due');
    } else if (selectedTab === 'paid') {
      result = result.filter((o) => (Number(o.due_amount) || 0) <= 0 || o.status === 'paid');
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.customer_name?.toLowerCase().includes(q) ||
          o.customer_phone?.includes(q) ||
          o.id?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, selectedTab, search]);

  const getWhatsAppLink = (phone?: string, name?: string, due?: number) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    const intlPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = isTelugu
      ? `నమస్కారం ${name || 'గారు'}, కేఆర్ లేడీస్ వరల్డ్, చెక్కపల్లి గ్రామం నుండి. ${
          due && due > 0 ? `మీ ఆర్డర్ బ్యాలెన్స్ ₹${due}. ` : ''
        }మా వద్ద షాపింగ్ చేసినందుకు ధన్యవాదాలు! ఫోన్: 7661852180`
      : `Namaste ${name || 'Madam/Sir'}, greetings from KR Ladies World, Chekkapally Village. ${
          due && due > 0 ? `Your pending balance for your order is ₹${due}. ` : ''
        }Thank you for shopping with us! Phone: 7661852180`;
    return `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="text-xs text-kr-maroon hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> {t.navDashboard}
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kr-maroon">
            {t.ordersTitle}
          </h1>
          <p className="text-xs text-kr-textMuted">
            {t.ordersSubtitle}
          </p>
        </div>

        <Button
          as={Link}
          href="/orders/new"
          color="primary"
          startContent={<PlusCircle className="h-4 w-4" />}
          className="bg-kr-maroon text-white font-semibold shadow-sm"
        >
          {t.navCreateOrder}
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(k) => setSelectedTab(k as any)}
          color="primary"
          variant="bordered"
          size="sm"
          classNames={{
            tabList: 'bg-white border-kr-blushBorder',
            cursor: 'bg-kr-maroon text-white',
          }}
        >
          <Tab key="all" title={`${t.tabAll} (${orders.length})`} />
          <Tab
            key="due"
            title={`${t.tabDue} (${orders.filter((o) => (Number(o.due_amount) || 0) > 0).length})`}
          />
          <Tab
            key="paid"
            title={`${t.tabPaid} (${orders.filter((o) => (Number(o.due_amount) || 0) <= 0).length})`}
          />
        </Tabs>

        <div className="w-full sm:w-72">
          <DashboardSearch
            value={search}
            onChange={setSearch}
            placeholder={t.searchPlaceholder}
          />
        </div>
      </div>

      <Card className="border border-kr-blushBorder shadow-sm bg-white overflow-hidden">
        <Table aria-label="Orders Table" className="text-sm">
          <TableHeader>
            <TableColumn>{t.orderNumber}</TableColumn>
            <TableColumn>{t.date}</TableColumn>
            <TableColumn>{t.customerDetails}</TableColumn>
            <TableColumn>{t.phone}</TableColumn>
            <TableColumn className="text-right">{t.total}</TableColumn>
            <TableColumn className="text-right">{t.paid}</TableColumn>
            <TableColumn className="text-right">{t.due}</TableColumn>
            <TableColumn className="text-center">{t.status}</TableColumn>
            <TableColumn className="text-center">{t.actions}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={t.noMatchingOrders}>
            {filteredOrders.map((ord) => {
              const due = Number(ord.due_amount || 0);
              const isPaid = due <= 0;

              return (
                <TableRow key={ord.id} className="hover:bg-kr-blush/40 transition">
                  <TableCell className="font-mono font-bold text-kr-maroon text-xs">
                    {ord.id}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                    {ord.order_date}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">{ord.customer_name}</TableCell>
                  <TableCell className="font-mono text-xs">{ord.customer_phone || '-'}</TableCell>
                  <TableCell className="text-right font-bold">
                    ₹{Number(ord.total_amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-emerald-700 font-semibold">
                    ₹{Number(ord.paid_amount || 0).toLocaleString()}
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
                      {ord.customer_phone && (
                        <>
                          {/* Call Button */}
                          <Tooltip content={t.call}>
                            <a
                              href={`tel:${ord.customer_phone}`}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-kr-maroon hover:text-white text-gray-700 transition"
                              aria-label="Call customer"
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                          </Tooltip>

                          {/* WhatsApp Button */}
                          <Tooltip content={t.whatsapp}>
                            <a
                              href={getWhatsAppLink(ord.customer_phone, ord.customer_name, due)}
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
                          isLoading={deletingId === ord.id}
                          onPress={() => handleDeleteOrder(ord.id)}
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
      </Card>
    </div>
  );
}
