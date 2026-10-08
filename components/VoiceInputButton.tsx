'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface VoiceInputButtonProps {
  onResult: (transcript: string) => void;
  isNumericOnly?: boolean;
  tooltipText?: string;
  size?: 'sm' | 'md';
  className?: string;
}

// Convert spoken Telugu and English digit words to Arabic numbers
function parseSpokenNumbers(text: string): string {
  const teluguDigitMap: Record<string, string> = {
    'సున్నా': '0', 'సున్న': '0', 'జీరో': '0', 'zero': '0',
    'ఒకటి': '1', 'ఒక': '1', 'వన్': '1', 'one': '1',
    'రెండు': '2', 'టూ': '2', 'two': '2',
    'మూడు': '3', 'త్రీ': '3', 'three': '3',
    'నాలుగు': '4', 'ఫోర్': '4', 'four': '4',
    'ఐదు': '5', 'ఫైవ్': '5', 'five': '5',
    'ఆరు': '6', 'సిక్స్': '6', 'six': '6',
    'ఏడు': '7', 'సెవెన్': '7', 'seven': '7',
    'ఎనిమిది': '8', 'ఎయిట్': '8', 'eight': '8',
    'తొమ్మిది': '9', 'నైన్': '9', 'nine': '9',
  };

  let cleaned = text.toLowerCase().trim();
  for (const [word, digit] of Object.entries(teluguDigitMap)) {
    const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
    cleaned = cleaned.replace(regex, digit);
  }

  // Remove spaces between consecutive digits
  cleaned = cleaned.replace(/(\d)\s+(\d)/g, '$1$2');
  return cleaned;
}

export function VoiceInputButton({
  onResult,
  isNumericOnly = false,
  tooltipText,
  size = 'sm',
  className = '',
}: VoiceInputButtonProps) {
  const { isTelugu, t } = useLanguage();
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isTelugu
          ? 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సదుపాయం లేదు. దయచేసి Google Chrome లేదా Edge బ్రౌజర్ ఉపయోగించండి.'
          : 'Voice recognition is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = isTelugu ? 'te-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          let final = transcript.trim();
          if (isNumericOnly) {
            final = parseSpokenNumbers(final).replace(/[^0-9]/g, '');
          }
          onResult(final);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  const toggle = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const tooltipLabel =
    tooltipText || (listening ? t.listening : `${t.voiceInput} (${isTelugu ? 'తెలుగు' : 'English'})`);

  return (
    <Tooltip content={tooltipLabel} placement="top">
      <Button
        type="button"
        isIconOnly
        size={size}
        variant={listening ? 'solid' : 'light'}
        color={listening ? 'danger' : 'default'}
        onPress={toggle}
        className={`relative transition-all shrink-0 ${
          listening
            ? 'bg-red-600 text-white animate-pulse shadow-md scale-105'
            : 'text-gray-500 hover:text-kr-maroon hover:bg-kr-blush'
        } ${className}`}
        aria-label={tooltipLabel}
      >
        {listening ? (
          <span className="flex items-center justify-center">
            <Volume2 className="h-4 w-4 animate-bounce text-white" />
          </span>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
    </Tooltip>
  );
}
export default VoiceInputButton;
