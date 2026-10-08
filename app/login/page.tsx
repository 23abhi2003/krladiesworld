'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { Lock, Phone, Sparkles, ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import { useAuth } from '@/lib/Auth';
import { useLanguage } from '@/lib/LanguageContext';
import { VoiceInputButton } from '@/components/VoiceInputButton';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { lang, setLang, t, isTelugu } = useLanguage();

  const [phoneOrUser, setPhoneOrUser] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const successLogin = login(phoneOrUser, pin);
    if (successLogin) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 500);
    } else {
      setError(t.loginInvalid);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-3">
          <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-3 border-kr-gold shadow-xl bg-white">
            <Image
              src="/logo.png"
              alt="KR Ladies World Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kr-maroon tracking-wide">
              {isTelugu ? 'కేఆర్ లేడీస్ వరల్డ్' : 'KR LADIES WORLD'}
            </h1>
            <p className="text-xs uppercase tracking-widest text-kr-gold font-semibold mt-0.5">
              {t.shopSubtitle}
            </p>
          </div>
        </div>

        {/* Main Login Card */}
        <Card className="border border-kr-blushBorder bg-white shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-kr-maroon via-kr-gold to-kr-maroonDark" />
          <CardBody className="p-6 sm:p-8 space-y-5">
            {/* Language Selection Bar (Prominent for Mother) */}
            <div className="bg-kr-blush/80 border border-kr-gold/40 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-kr-maroon">
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-kr-gold" />
                  {t.loginLanguageOption}
                </span>
                <span className="text-[10px] text-gray-500 font-normal">
                  {isTelugu ? 'తెలుగు ఎంచుకున్నారు' : 'English Selected'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLang('te')}
                  className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    isTelugu
                      ? 'bg-kr-maroon text-white border-2 border-kr-gold shadow-md scale-[1.02]'
                      : 'bg-white text-gray-700 border border-kr-blushBorder hover:bg-white/90 hover:text-kr-maroon'
                  }`}
                >
                  <span className="text-base">🇮🇳</span>
                  <span>తెలుగు (Telugu)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    !isTelugu
                      ? 'bg-kr-maroon text-white border-2 border-kr-gold shadow-md scale-[1.02]'
                      : 'bg-white text-gray-700 border border-kr-blushBorder hover:bg-white/90 hover:text-kr-maroon'
                  }`}
                >
                  <span className="text-base">🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <h2 className="text-lg font-serif font-bold text-gray-900">
                {t.loginWelcome}
              </h2>
              <span className="text-[11px] bg-kr-blush text-kr-maroon border border-kr-blushBorder px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-kr-gold" />
                {t.storePortal}
              </span>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto animate-bounce" />
                <p className="font-bold text-lg text-gray-900">{t.loginSuccess}</p>
                <p className="text-xs text-gray-500">{t.loginRedirecting}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Input
                    label={t.loginPhoneLabel}
                    value={phoneOrUser}
                    onValueChange={setPhoneOrUser}
                    startContent={<Phone className="h-4 w-4 text-gray-400" />}
                    endContent={
                      <VoiceInputButton
                        isNumericOnly
                        onResult={(digits) => setPhoneOrUser(digits)}
                        tooltipText={`${t.speakToEnter} (${t.loginPhoneLabel})`}
                      />
                    }
                    variant="bordered"
                    size="md"
                    isRequired
                  />
                </div>

                <div className="space-y-1">
                  <Input
                    type="password"
                    label={t.loginPinLabel}
                    value={pin}
                    onValueChange={setPin}
                    startContent={<Lock className="h-4 w-4 text-gray-400" />}
                    variant="bordered"
                    size="md"
                    isRequired
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  color="primary"
                  className="w-full bg-kr-maroon text-white font-bold h-11 shadow-md hover:bg-kr-maroonDark transition mt-2"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  {t.loginBtn}
                </Button>
              </form>
            )}
          </CardBody>
        </Card>

        {/* Footer contact */}
        <p className="text-center text-xs text-kr-textMuted">
          {isTelugu ? 'కేఆర్ లేడీస్ వరల్డ్' : 'KR Ladies World'} &bull; {t.chekkapallyVillage} &bull; 7661852180
        </p>
      </div>
    </div>
  );
}
