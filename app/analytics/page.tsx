'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@heroui/react';
import { apiFetch } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function AnalyticsPage() {
  const { t, isTelugu } = useLanguage();
  const [data, setData] = useState({ receipts: [], investments: [] });

  useEffect(() => {
    apiFetch('/api/analytics')
      .then((res) => (res.ok ? res.json() : { receipts: [], investments: [] }))
      .then((json) => setData(json))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-kr-maroon">
          {t.analyticsTitle}
        </h1>
        <p className="text-xs text-kr-textMuted">
          {t.analyticsSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-kr-blushBorder shadow-none bg-white p-5">
          <h3 className="font-serif font-semibold text-kr-maroon mb-4">
            {t.analyticsDailyHistory}
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.receipts.length === 0 ? (
              <p className="text-sm text-gray-500">{t.noAnalyticsData}</p>
            ) : (
              data.receipts.map((r: any, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-kr-blushBorder pb-2">
                  <span className="text-kr-textMuted">{r.date}</span>
                  <span className="font-bold text-green-700">₹{r.received_amount}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="border border-kr-blushBorder shadow-none bg-white p-5">
          <h3 className="font-serif font-semibold text-kr-maroon mb-4">
            {t.analyticsInvHistory}
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.investments.length === 0 ? (
              <p className="text-sm text-gray-500">{t.noAnalyticsData}</p>
            ) : (
              data.investments.map((r: any, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-kr-blushBorder pb-2">
                  <span className="text-kr-textMuted">{r.date}</span>
                  <span className="font-bold text-kr-maroon">₹{r.invested_amount}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
