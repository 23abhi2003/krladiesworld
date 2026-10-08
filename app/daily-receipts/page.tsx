'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  Input,
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
} from '@heroui/react';
import {
  Calendar,
  PlusCircle,
  TrendingUp,
  Receipt,
  X,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import { VoiceInputButton } from '@/components/VoiceInputButton';
import type { DailyPayment } from '@/lib/types';

interface DayGroup {
  date: string;
  totalAmount: number;
  entriesCount: number;
  entries: DailyPayment[];
  notes: string[];
}

export default function DailyAmountPage() {
  const { t, isTelugu } = useLanguage();
  const todayStr = new Date().toISOString().split('T')[0];

  const [dateFilter, setDateFilter] = useState('');
  const [data, setData] = useState<DailyPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingDate, setDeletingDate] = useState<string | null>(null);

  // Form states to record total daily collection
  const [entryDate, setEntryDate] = useState(todayStr);
  const [totalDayAmount, setTotalDayAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [noteOrDesc, setNoteOrDesc] = useState('Total daily collection across customers');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const url = dateFilter
        ? `/api/daily-payments?date=${dateFilter}`
        : '/api/daily-payments';
      const res = await apiFetch(url);
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load daily payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [dateFilter]);

  // Handle saving the total amount for the date
  const handleSaveDailyTotal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totalDayAmount || Number(totalDayAmount) <= 0) return;

    setIsSaving(true);
    try {
      const res = await apiFetch('/api/daily-payments', {
        method: 'POST',
        body: JSON.stringify({
          payment_date: entryDate,
          amount: Number(totalDayAmount),
          payment_mode: paymentMode,
          customer_name: 'All Customers (Daily Total)',
          notes: noteOrDesc.trim() || 'Total daily collection',
        }),
      });

      if (res.ok) {
        setTotalDayAmount('');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchPayments();
      }
    } catch (err) {
      console.error('Failed to save daily total:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDay = async (dateStr: string) => {
    if (!dateStr) return;
    setDeletingDate(dateStr);
    try {
      const res = await apiFetch(`/api/daily-payments/${dateStr}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchPayments();
      }
    } catch (err) {
      console.error('Failed to delete day collection:', err);
    } finally {
      setDeletingDate(null);
    }
  };

  // Group transactions by date to show total amount per day across all customers
  const dayGroups = useMemo<DayGroup[]>(() => {
    const map = new Map<string, DayGroup>();

    data.forEach((item) => {
      const d = item.payment_date || todayStr;
      if (!map.has(d)) {
        map.set(d, {
          date: d,
          totalAmount: 0,
          entriesCount: 0,
          entries: [],
          notes: [],
        });
      }
      const g = map.get(d)!;
      g.totalAmount += Number(item.amount) || 0;
      g.entriesCount += 1;
      g.entries.push(item);
      if (item.notes && !g.notes.includes(item.notes)) {
        g.notes.push(item.notes);
      }
    });

    // Sort descending by date
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [data, todayStr]);

  // Overall calculations
  const totalLifetimeAmount = useMemo(
    () => data.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [data]
  );

  const todayTotalAmount = useMemo(() => {
    const todayGroup = dayGroups.find((g) => g.date === todayStr);
    return todayGroup ? todayGroup.totalAmount : 0;
  }, [dayGroups, todayStr]);

  const formatDateDisplay = (dateString: string) => {
    try {
      const d = new Date(dateString + 'T00:00:00');
      const isToday = dateString === todayStr;
      const formatted = d.toLocaleDateString(isTelugu ? 'te-IN' : 'en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        weekday: 'short',
      });
      return { formatted, isToday };
    } catch {
      return { formatted: dateString, isToday: false };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kr-maroon">
            {t.dailyTitle}
          </h1>
          <p className="text-xs text-kr-textMuted mt-0.5">
            {t.dailySubtitle}
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            type="date"
            size="sm"
            label={isTelugu ? 'తేదీ ఫిల్టర్' : 'Filter Date'}
            value={dateFilter}
            onValueChange={setDateFilter}
            variant="bordered"
            className="w-full sm:w-48 bg-white"
          />
          {dateFilter && (
            <Button
              size="sm"
              variant="flat"
              color="danger"
              startContent={<X className="h-3.5 w-3.5" />}
              onPress={() => setDateFilter('')}
              className="text-xs h-10"
            >
              {t.cancel}
            </Button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 shadow-xs">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">{isTelugu ? 'ఈరోజు మొత్తం వసూలు' : "Today's Total Collection"}</span>
              <Calendar className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-700 mt-1">
              ₹{todayTotalAmount.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-600 mt-0.5">
              {t.date}: {todayStr}
            </span>
          </CardBody>
        </Card>

        <Card className="border border-kr-gold/30 bg-gradient-to-br from-white to-amber-50/40 shadow-xs">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800">{isTelugu ? 'నమోదైన రోజుల సంఖ్య' : 'Recorded Days Count'}</span>
              <Receipt className="h-4 w-4 text-kr-gold" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mt-1">
              {dayGroups.length} <span className="text-sm font-normal text-gray-500">{isTelugu ? 'రోజులు' : 'days'}</span>
            </p>
            <span className="text-[10px] text-gray-500 mt-0.5">
              {isTelugu ? 'మొత్తం లావాదేవీలు:' : 'Total transaction entries:'} {data.length}
            </span>
          </CardBody>
        </Card>

        <Card className="border border-kr-blushBorder bg-gradient-to-br from-white to-rose-50/30 shadow-xs">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-kr-maroon">{isTelugu ? 'మొత్తం వసూలైన మొత్తం' : 'Total Overall Received'}</span>
              <TrendingUp className="h-4 w-4 text-kr-maroon" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-kr-maroon mt-1">
              ₹{totalLifetimeAmount.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-gray-500 mt-0.5">
              {dateFilter ? `${dateFilter}` : isTelugu ? 'అన్ని రోజుల సంచిత మొత్తం' : 'Cumulative collection across all days'}
            </span>
          </CardBody>
        </Card>
      </div>

      {/* Main Entry Card: Add Total Amount For A Date */}
      <Card className="border border-kr-gold/40 shadow-md bg-white overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-kr-maroon via-kr-gold to-kr-maroonDark" />
        <CardBody className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-bold text-kr-maroon flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-kr-gold" />
                {t.recordDailyAmount}
              </h2>
              <p className="text-xs text-gray-500">
                {t.recordDailyDesc}
              </p>
            </div>
            {saveSuccess && (
              <Chip
                color="success"
                variant="flat"
                startContent={<CheckCircle2 className="h-3.5 w-3.5" />}
                className="text-xs font-semibold animate-pulse"
              >
                {t.dailySavedSuccess}
              </Chip>
            )}
          </div>

          <form onSubmit={handleSaveDailyTotal} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Input
                type="date"
                label={t.selectDate}
                value={entryDate}
                onValueChange={setEntryDate}
                size="md"
                variant="bordered"
                isRequired
              />
            </div>

            <div>
              <Input
                type="number"
                label={t.dayTotalAmount}
                value={totalDayAmount}
                onValueChange={setTotalDayAmount}
                size="md"
                variant="bordered"
                min="1"
                step="any"
                isRequired
                endContent={
                  <VoiceInputButton
                    isNumericOnly
                    onResult={(digits) => setTotalDayAmount(digits)}
                    tooltipText={`${t.speakToEnter} (${t.dayTotalAmount})`}
                  />
                }
              />
            </div>

            <div>
              <Select
                label={t.dayPaymentType}
                selectedKeys={[paymentMode]}
                onChange={(e) => setPaymentMode(e.target.value)}
                size="md"
                variant="bordered"
              >
                <SelectItem key="Cash">{t.cash}</SelectItem>
                <SelectItem key="UPI">{t.onlineUpi}</SelectItem>
                <SelectItem key="Mixed">{isTelugu ? 'మిశ్రమ (నగదు + ఆన్‌లైన్)' : 'Mixed (Cash + UPI)'}</SelectItem>
                <SelectItem key="Card">{isTelugu ? 'కార్డు' : 'Card'}</SelectItem>
              </Select>
            </div>

            <div>
              <Button
                type="submit"
                color="primary"
                isLoading={isSaving}
                className="w-full bg-kr-maroon hover:bg-kr-maroonDark text-white font-bold h-12 shadow-sm transition"
                startContent={!isSaving && <PlusCircle className="h-4 w-4 text-kr-gold" />}
              >
                {t.saveDailyAmountBtn}
              </Button>
            </div>
          </form>

          <div className="pt-2">
            <Input
              label={t.dayNote}
              value={noteOrDesc}
              onValueChange={setNoteOrDesc}
              size="sm"
              variant="bordered"
              className="w-full"
              endContent={
                <VoiceInputButton
                  onResult={(spoken) => setNoteOrDesc((prev) => (prev ? `${prev} ${spoken}` : spoken))}
                  tooltipText={`${t.speakToEnter} (${t.dayNote})`}
                />
              }
            />
          </div>
        </CardBody>
      </Card>

      {/* Per-Day Total Table */}
      <Card className="border border-kr-blushBorder shadow-sm bg-white overflow-hidden">
        <div className="p-4 bg-kr-blush/60 border-b border-kr-blushBorder flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-serif font-bold text-kr-maroon text-base">
              {t.dailyHistory}
            </h3>
            <p className="text-xs text-gray-500">
              {isTelugu ? 'రోజూ వచ్చిన మొత్తం కలెక్షన్ వివరాలు' : 'Aggregated total amount received across all customers per day'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-kr-gold/40 text-kr-maroon shadow-xs">
              {isTelugu ? 'మొత్తం నమోదైనది' : 'Total Recorded'}: ₹{totalLifetimeAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <Table aria-label="Daily Amount Table" className="text-sm">
          <TableHeader>
            <TableColumn>{t.date}</TableColumn>
            <TableColumn>{isTelugu ? 'వారం / రోజు' : 'DAY OF WEEK'}</TableColumn>
            <TableColumn>{isTelugu ? 'వివరాలు' : 'ENTRIES / DETAILS'}</TableColumn>
            <TableColumn className="text-right">{isTelugu ? 'రోజు మొత్తం అమౌంట్' : 'TOTAL AMOUNT FOR DAY'}</TableColumn>
            <TableColumn className="text-center">{t.actions}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={t.noDailyRecords}>
            {dayGroups.map((group) => {
              const { formatted, isToday } = formatDateDisplay(group.date);

              return (
                <TableRow key={group.date} className="hover:bg-kr-blush/30 transition border-b border-gray-100">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 text-sm">
                        {group.date}
                      </span>
                      {isToday && (
                        <Chip size="sm" color="success" variant="flat" className="text-[10px] font-bold">
                          {t.today}
                        </Chip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 font-medium">
                    {formatted}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-700 font-medium">
                          {group.entriesCount} {group.entriesCount === 1 ? (isTelugu ? 'నమోదు' : 'entry') : (isTelugu ? 'నమోదులు' : 'entries')}
                        </span>
                      </div>
                      {group.notes.length > 0 && (
                        <p className="text-[11px] text-gray-500 line-clamp-1 italic">
                          {group.notes.join(' • ')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-serif font-bold text-lg text-emerald-700">
                      ₹{group.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip content={t.delete}>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        isLoading={deletingDate === group.date}
                        onPress={() => handleDeleteDay(group.date)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Tooltip>
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
