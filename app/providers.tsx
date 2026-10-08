'use client';
import React from 'react';
import { HeroUIProvider } from '@heroui/react';
import { AuthProvider } from '@/lib/Auth';
import { LanguageProvider } from '@/lib/LanguageContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </HeroUIProvider>
  );
}
