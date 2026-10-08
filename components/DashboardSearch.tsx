'use client';

import React from 'react';
import { Input } from '@heroui/react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { VoiceInputButton } from '@/components/VoiceInputButton';

interface DashboardSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function DashboardSearch({
  value,
  onChange,
  placeholder,
}: DashboardSearchProps) {
  const { t } = useLanguage();
  const searchPlaceholder = placeholder || t.searchPlaceholder;

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onValueChange={onChange}
        placeholder={searchPlaceholder}
        startContent={<Search className="h-4 w-4 text-gray-400 shrink-0" />}
        endContent={
          <div className="flex items-center gap-1">
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <VoiceInputButton
              onResult={(text) => onChange(text)}
              size="sm"
            />
          </div>
        }
        variant="bordered"
        size="md"
        className="w-full bg-white shadow-sm"
        classNames={{
          inputWrapper: 'border-kr-blushBorder hover:border-kr-gold focus-within:border-kr-maroon bg-white h-11',
          input: 'text-sm placeholder:text-gray-400',
        }}
      />
    </div>
  );
}
export default DashboardSearch;
