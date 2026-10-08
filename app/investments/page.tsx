'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
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
  Tooltip,
} from '@heroui/react';
import { Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import { VoiceInputButton } from '@/components/VoiceInputButton';

export default function InvestmentsPage() {
  const { t, isTelugu } = useLanguage();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Stock Purchase');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchInv = async () => {
    try {
      const res = await apiFetch('/api/investments');
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
        setTotal(json.totalInvested || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchInv();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    await apiFetch('/api/investments', {
      method: 'POST',
      body: JSON.stringify({
        investment_date: date,
        category,
        amount: Number(amount),
        description: desc,
      }),
    });
    setAmount('');
    setDesc('');
    fetchInv();
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    setDeletingId(id);
    try {
      const res = await apiFetch(`/api/investments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchInv();
      }
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="text-xs text-kr-maroon hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> {t.navDashboard}
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kr-maroon">
            {t.invTitle}
          </h1>
          <p className="text-xs text-kr-textMuted">
            {t.invSubtitle}
          </p>
        </div>
        <div className="text-lg font-bold text-kr-maroon bg-white px-4 py-2 rounded-xl border border-kr-blushBorder shadow-xs">
          {isTelugu ? 'మొత్తం ఖర్చులు:' : 'Total Invested:'} ₹{total.toLocaleString('en-IN')}
        </div>
      </div>

      <Card className="p-4 sm:p-5 border border-kr-blushBorder shadow-xs bg-white">
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
          <Input
            type="date"
            label={t.date}
            value={date}
            onValueChange={setDate}
            size="sm"
            variant="bordered"
            isRequired
          />
          <Select
            label={t.expenseCategory}
            selectedKeys={[category]}
            onChange={(e) => setCategory(e.target.value)}
            size="sm"
            variant="bordered"
          >
            <SelectItem key="Stock Purchase">{isTelugu ? 'సరుకు కొనుగోలు (చీరలు/డ్రెస్సులు)' : 'Stock (Sarees/Dresses)'}</SelectItem>
            <SelectItem key="Rent">{isTelugu ? 'దుకాణం అద్దె' : 'Shop Rent'}</SelectItem>
            <SelectItem key="Packaging">{isTelugu ? 'బాక్సులు మరియు బ్యాగులు' : 'Boxes & Bags'}</SelectItem>
            <SelectItem key="Transport">{isTelugu ? 'రవాణా / ఛార్జీలు' : 'Transport / Logistics'}</SelectItem>
            <SelectItem key="Electricity">{isTelugu ? 'కరెంట్ బిల్లు' : 'Electricity Bill'}</SelectItem>
            <SelectItem key="Other">{isTelugu ? 'ఇతర ఖర్చులు' : 'Other Maintenance'}</SelectItem>
          </Select>
          <Input
            type="number"
            label={t.expenseAmount}
            value={amount}
            onValueChange={setAmount}
            size="sm"
            variant="bordered"
            min="1"
            isRequired
            endContent={
              <VoiceInputButton
                isNumericOnly
                onResult={(digits) => setAmount(digits)}
                tooltipText={`${t.speakToEnter} (${t.expenseAmount})`}
              />
            }
          />
          <Input
            label={t.expenseDesc}
            value={desc}
            onValueChange={setDesc}
            size="sm"
            variant="bordered"
            endContent={
              <VoiceInputButton
                onResult={(spoken) => setDesc((prev) => (prev ? `${prev} ${spoken}` : spoken))}
                tooltipText={`${t.speakToEnter} (${t.expenseDesc})`}
              />
            }
          />
          <Button
            type="submit"
            color="primary"
            className="bg-kr-maroon hover:bg-kr-maroonDark text-white font-semibold h-10 shadow-xs"
          >
            + {t.saveExpenseBtn}
          </Button>
        </form>
      </Card>

      <Card className="border border-kr-blushBorder shadow-xs bg-white overflow-hidden">
        <Table aria-label="Investments Table" className="text-sm">
          <TableHeader>
            <TableColumn>{t.date}</TableColumn>
            <TableColumn>{isTelugu ? 'వర్గం' : 'CATEGORY'}</TableColumn>
            <TableColumn>{isTelugu ? 'వివరాలు' : 'DESCRIPTION'}</TableColumn>
            <TableColumn className="text-right">{t.total}</TableColumn>
            <TableColumn className="text-center">{t.actions}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={t.noInvestmentsYet}>
            {data.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.investment_date}</TableCell>
                <TableCell className="font-semibold text-kr-maroon">{r.category}</TableCell>
                <TableCell>{r.description || '-'}</TableCell>
                <TableCell className="text-right font-bold text-slate-800">
                  ₹{Number(r.amount || 0).toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="text-center">
                  <Tooltip content={t.delete}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      isLoading={deletingId === r.id}
                      onPress={() => handleDelete(r.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
