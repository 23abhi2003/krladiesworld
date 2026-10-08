'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Input,
  Select,
  SelectItem,
  Button,
  Chip,
} from '@heroui/react';
import {
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Camera,
  Mic,
  Sparkles,
  FileText,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import { VoiceInputButton } from '@/components/VoiceInputButton';
import { OrderSlipScannerModal } from '@/components/OrderSlipScannerModal';
import { SmartVoiceOrderModal } from '@/components/SmartVoiceOrderModal';
import type { ParsedSlipResult } from '@/lib/slipParser';

interface OrderItem {
  item_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export function OrderWizard() {
  const router = useRouter();
  const { t, isTelugu } = useLanguage();

  const CATEGORIES = [
    { key: 'Sarees', label: t.sarees },
    { key: 'Bangles', label: t.bangles },
    { key: 'Dresses', label: t.dresses },
    { key: 'Accessories', label: t.accessories },
    { key: 'Gifts', label: t.gifts },
  ];

  const [step, setStep] = useState<1 | 2>(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [notes, setNotes] = useState('');

  // Modals for AI slip scanning and smart voice order
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const [items, setItems] = useState<OrderItem[]>([
    { item_name: '', category: 'Sarees', quantity: 1, unit_price: 0, total_price: 0 },
  ]);

  const updateItem = (index: number, field: keyof OrderItem, val: any) => {
    const next = [...items];
    const row = { ...next[index], [field]: val };
    if (field === 'quantity' || field === 'unit_price') {
      row.total_price = (Number(row.quantity) || 0) * (Number(row.unit_price) || 0);
    }
    next[index] = row;
    setItems(next);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      { item_name: '', category: 'Sarees', quantity: 1, unit_price: 0, total_price: 0 },
    ]);
  };

  const removeItemRow = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const totalAmount = items.reduce((sum, it) => sum + it.total_price, 0);
  const dueAmount = Math.max(0, totalAmount - paidAmount);
  const status = dueAmount === 0 ? 'paid' : 'due';

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Handle data auto-populated from slip image or voice assistant
  const handleAutoPopulateOrder = (parsed: ParsedSlipResult) => {
    if (parsed.customer_name) setCustomerName(parsed.customer_name);
    if (parsed.customer_phone) setCustomerPhone(parsed.customer_phone);
    if (parsed.paid_amount) setPaidAmount(parsed.paid_amount);
    if (parsed.payment_mode) setPaymentMode(parsed.payment_mode);
    if (parsed.notes) setNotes(parsed.notes);
    if (parsed.items && parsed.items.length > 0) {
      setItems(
        parsed.items.map((it) => ({
          item_name: it.item_name || 'Item',
          category: it.category || 'Sarees',
          quantity: it.quantity || 1,
          unit_price: it.unit_price || 0,
          total_price: it.total_price || 0,
        }))
      );
    }
    setStep(1);
  };

  const handleConfirmAndSave = async () => {
    setIsSaving(true);
    setSaveError('');
    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      order_date: orderDate,
      total_amount: totalAmount,
      paid_amount: paidAmount,
      payment_mode: paymentMode,
      notes,
      items,
    };

    try {
      const res = await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push('/orders');
        }, 700);
      } else {
        setSaveError(
          isTelugu
            ? 'ఆర్డర్ సేవ్ చేయడంలో లోపం. వివరాలు సరిచూసి మళ్లీ ప్రయత్నించండి.'
            : 'Failed to save order. Please check details and try again.'
        );
        setIsSaving(false);
      }
    } catch {
      setSaveError(
        isTelugu ? 'సర్వర్‌తో కనెక్ట్ చేయడంలో సమస్య.' : 'Error connecting to backend.'
      );
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Entry Buttons */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-kr-blushBorder pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-kr-maroon">
            {t.createOrderTitle}
          </h1>
          <p className="text-xs text-kr-textMuted">
            {t.createOrderSubtitle}
          </p>
        </div>

        {/* Quick Automation Actions: Slip Image Scanner & Voice Assistant */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Slip Image Upload & Scan Button */}
          <Button
            color="secondary"
            variant="flat"
            startContent={<Camera className="h-4 w-4 text-kr-maroon" />}
            onPress={() => setSlipModalOpen(true)}
            className="bg-kr-blush border border-kr-gold/50 text-kr-maroon font-bold text-xs sm:text-sm hover:bg-kr-gold/20 shadow-sm"
          >
            {t.uploadSlipBtn}
          </Button>

          {/* Voice Order Assistant Button */}
          <Button
            color="primary"
            variant="flat"
            startContent={<Mic className="h-4 w-4 text-kr-maroon" />}
            onPress={() => setVoiceModalOpen(true)}
            className="bg-amber-50 border border-kr-gold/50 text-kr-maroon font-bold text-xs sm:text-sm hover:bg-amber-100 shadow-sm"
          >
            {t.voiceOrderAssistant}
          </Button>

          <div className="hidden sm:flex gap-1.5 ml-auto">
            <Chip
              color={step === 1 ? 'primary' : 'default'}
              variant="flat"
              className="font-semibold text-xs"
            >
              {isTelugu ? 'దశ 1: వివరాలు' : 'Step 1: Order Details'}
            </Chip>
            <Chip
              color={step === 2 ? 'primary' : 'default'}
              variant="flat"
              className="font-semibold text-xs"
            >
              {isTelugu ? 'దశ 2: నిర్ధారణ' : 'Step 2: Confirmation'}
            </Chip>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <Card className="border border-kr-blushBorder shadow-none bg-white p-6">
          <div className="space-y-6">
            {/* Customer Information with Individual Voice Input Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={t.customerNameLabel}
                isRequired
                value={customerName}
                onValueChange={setCustomerName}
                variant="bordered"
                endContent={
                  <VoiceInputButton
                    onResult={(spoken) => setCustomerName((prev) => (prev ? `${prev} ${spoken}` : spoken))}
                    tooltipText={`${t.speakToEnter} (${t.customerNameLabel})`}
                  />
                }
              />
              <Input
                label={t.customerPhoneLabel}
                value={customerPhone}
                onValueChange={setCustomerPhone}
                variant="bordered"
                endContent={
                  <VoiceInputButton
                    isNumericOnly
                    onResult={(digits) => setCustomerPhone(digits)}
                    tooltipText={`${t.speakToEnter} (${t.customerPhoneLabel})`}
                  />
                }
              />
              <Input
                type="date"
                label={t.orderDateLabel}
                value={orderDate}
                onValueChange={setOrderDate}
                variant="bordered"
              />
            </div>

            {/* Items Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-kr-maroon text-sm uppercase tracking-wide">
                  {isTelugu ? 'ఆర్డర్ వస్తువులు (చీరలు, గాజులు, మొదలైనవి)' : 'Order Items (Sarees, Bangles, etc.)'}
                </h3>
                <Button
                  size="sm"
                  color="secondary"
                  startContent={<Plus className="h-3 w-3" />}
                  onPress={addItemRow}
                  className="bg-kr-gold text-white font-medium"
                >
                  {t.addItemRow}
                </Button>
              </div>

              {items.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 p-2.5 rounded-lg bg-kr-blush/60 border border-kr-blushBorder items-center"
                >
                  <div className="col-span-12 sm:col-span-4">
                    <Input
                      size="sm"
                      label={t.itemNameLabel}
                      value={row.item_name}
                      onValueChange={(val) => updateItem(idx, 'item_name', val)}
                      variant="bordered"
                      endContent={
                        <VoiceInputButton
                          size="sm"
                          onResult={(spoken) => updateItem(idx, 'item_name', spoken)}
                          tooltipText={`${t.speakToEnter} (${t.itemNameLabel})`}
                        />
                      }
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <Select
                      size="sm"
                      label={t.categoryLabel}
                      selectedKeys={[row.category]}
                      onChange={(e) => updateItem(idx, 'category', e.target.value)}
                      variant="bordered"
                    >
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.key}>{c.label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <Input
                      type="number"
                      size="sm"
                      label={t.quantityLabel}
                      min="1"
                      value={String(row.quantity)}
                      onValueChange={(val) => updateItem(idx, 'quantity', Number(val))}
                      variant="bordered"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <Input
                      type="number"
                      size="sm"
                      label={t.unitPriceLabel}
                      min="0"
                      value={String(row.unit_price)}
                      onValueChange={(val) => updateItem(idx, 'unit_price', Number(val))}
                      variant="bordered"
                      endContent={
                        <VoiceInputButton
                          size="sm"
                          isNumericOnly
                          onResult={(digits) => updateItem(idx, 'unit_price', Number(digits) || 0)}
                          tooltipText={`${t.speakToEnter} (${t.unitPriceLabel})`}
                        />
                      }
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-1 flex justify-end">
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => removeItemRow(idx)}
                      title={t.removeItem}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Advance & Payment Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-kr-blush border border-kr-blushBorder items-center">
              <Input
                type="number"
                label={isTelugu ? 'అడ్వాన్స్ ఇచ్చినది (₹)' : 'Paid / Advance Amount (₹)'}
                value={String(paidAmount)}
                onValueChange={(val) => setPaidAmount(Number(val))}
                variant="bordered"
                endContent={
                  <VoiceInputButton
                    isNumericOnly
                    onResult={(digits) => setPaidAmount(Number(digits) || 0)}
                    tooltipText={`${t.speakToEnter} (${t.advanceReceived})`}
                  />
                }
              />
              <Select
                label={t.paymentMode}
                selectedKeys={[paymentMode]}
                onChange={(e) => setPaymentMode(e.target.value)}
                variant="bordered"
              >
                <SelectItem key="Cash">{t.cash}</SelectItem>
                <SelectItem key="UPI">{t.onlineUpi}</SelectItem>
                <SelectItem key="Card">{isTelugu ? 'డెబిట్ / క్రెడిట్ కార్డ్' : 'Debit / Credit Card'}</SelectItem>
              </Select>
              <div className="text-right">
                <span className="text-xs text-kr-textMuted uppercase font-semibold">
                  {t.total} / {t.due}
                </span>
                <p className="text-lg font-bold text-kr-maroon">
                  ₹{totalAmount} <span className="text-sm font-normal text-kr-textMuted">| {t.due}:</span>{' '}
                  <span className="text-red-600">₹{dueAmount}</span>
                </p>
              </div>
            </div>

            {/* Optional Notes with Voice Input */}
            <div>
              <Input
                label={t.notesOptional}
                value={notes}
                onValueChange={setNotes}
                variant="bordered"
                endContent={
                  <VoiceInputButton
                    onResult={(spoken) => setNotes((prev) => (prev ? `${prev} ${spoken}` : spoken))}
                    tooltipText={`${t.speakToEnter} (${t.notes})`}
                  />
                }
              />
            </div>

            <div className="flex justify-end">
              <Button
                color="primary"
                endContent={<ArrowRight className="h-4 w-4" />}
                isDisabled={!customerName || items.length === 0 || totalAmount <= 0}
                onPress={() => setStep(2)}
                className="bg-kr-maroon text-white font-semibold"
              >
                {isTelugu ? 'నిర్ధారణకు వెళ్లండి' : 'Proceed to Confirmation'}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border border-kr-gold/50 shadow-sm bg-white p-6">
          <div className="space-y-6">
            <div className="border border-kr-gold/30 rounded-xl p-6 bg-amber-50/20">
              <div className="text-center pb-4 border-b border-kr-gold/30">
                <h2 className="font-serif text-2xl font-bold text-kr-maroon">
                  {isTelugu ? 'కేఆర్ లేడీస్ వరల్డ్' : 'KR LADIES WORLD'}
                </h2>
                <p className="text-xs text-kr-textMuted">
                  {t.chekkapallyVillage} • 7661852180
                </p>
                <p className="text-[11px] text-kr-gold font-semibold uppercase mt-0.5">
                  {isTelugu ? 'ఆర్డర్ ఇన్వాయిస్ ప్రివ్యూ' : 'Order Invoice Preview'}
                </p>
              </div>

              <div className="grid grid-cols-2 text-sm py-4 border-b border-kr-gold/30">
                <div>
                  <p>
                    <strong>{t.customerDetails}:</strong> {customerName}
                  </p>
                  <p>
                    <strong>{t.phone}:</strong> {customerPhone || '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    <strong>{t.date}:</strong> {orderDate}
                  </p>
                  <p>
                    <strong>{t.status}:</strong>{' '}
                    <span className={status === 'paid' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {status === 'paid' ? t.statusPaid : t.statusDue}
                    </span>
                  </p>
                </div>
              </div>

              <table className="w-full text-left text-sm my-4">
                <thead>
                  <tr className="border-b text-xs text-kr-maroon">
                    <th className="py-2">{t.itemNameLabel}</th>
                    <th className="py-2">{t.categoryLabel}</th>
                    <th className="py-2 text-center">{t.quantityLabel}</th>
                    <th className="py-2 text-right">{t.unitPriceLabel}</th>
                    <th className="py-2 text-right">{t.totalPriceLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 font-medium">{it.item_name}</td>
                      <td className="py-2 text-kr-textMuted">{it.category}</td>
                      <td className="py-2 text-center">{it.quantity}</td>
                      <td className="py-2 text-right">₹{it.unit_price}</td>
                      <td className="py-2 text-right font-semibold">₹{it.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right space-y-1 font-semibold text-sm pt-2">
                <p>
                  {t.totalBill}: ₹{totalAmount}
                </p>
                <p className="text-green-700">
                  {t.advanceReceived}: ₹{paidAmount} ({paymentMode === 'Cash' ? t.cash : t.onlineUpi})
                </p>
                <p className="text-red-600">
                  {t.remainingDue}: ₹{dueAmount}
                </p>
              </div>

              {notes && (
                <div className="text-xs text-gray-500 border-t border-kr-gold/20 pt-2 mt-2">
                  <strong>{t.notes}:</strong> {notes}
                </div>
              )}
            </div>

            {saveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 animate-bounce" />
                <span>{t.orderSuccessMsg}</span>
              </div>
            )}

            {saveError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs">
                {saveError}
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button
                variant="bordered"
                startContent={<ArrowLeft className="h-4 w-4" />}
                onPress={() => setStep(1)}
                isDisabled={isSaving}
              >
                {isTelugu ? 'సవరించండి (వెనుకకు)' : 'Back to Edit'}
              </Button>
              <Button
                color="primary"
                startContent={!isSaving && <CheckCircle2 className="h-4 w-4" />}
                isLoading={isSaving}
                onPress={handleConfirmAndSave}
                className="bg-kr-maroon text-white font-bold shadow-md"
              >
                {t.saveOrderBtn}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Slip Image Scanner Modal */}
      <OrderSlipScannerModal
        open={slipModalOpen}
        onClose={() => setSlipModalOpen(false)}
        onOrderGenerated={handleAutoPopulateOrder}
      />

      {/* Smart Voice Order Assistant Modal */}
      <SmartVoiceOrderModal
        open={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onOrderGenerated={handleAutoPopulateOrder}
      />
    </div>
  );
}
export default OrderWizard;
