'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from '@heroui/react';
import { Mic, MicOff, Sparkles, CheckCircle2, Volume2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { parseOrderSlipText, ParsedSlipResult } from '@/lib/slipParser';

interface SmartVoiceOrderModalProps {
  open: boolean;
  onClose: () => void;
  onOrderGenerated: (orderData: ParsedSlipResult) => void;
}

export function SmartVoiceOrderModal({
  open,
  onClose,
  onOrderGenerated,
}: SmartVoiceOrderModalProps) {
  const { t, isTelugu } = useLanguage();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedResult, setParsedResult] = useState<ParsedSlipResult | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!open) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setListening(false);
      setTranscript('');
      setParsedResult(null);
    }
  }, [open]);

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isTelugu
          ? 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సదుపాయం లేదు. దయచేసి Google Chrome లేదా Edge బ్రౌజర్ ఉపయోగించండి.'
          : 'Speech recognition is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = isTelugu ? 'te-IN' : 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event: any) => {
        let fullText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullText += event.results[i][0].transcript + ' ';
        }
        setTranscript(fullText.trim());
        const parsed = parseOrderSlipText(fullText.trim());
        setParsedResult(parsed);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setListening(false);
    }
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  const handleApply = () => {
    if (parsedResult) {
      onOrderGenerated(parsedResult);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="2xl"
      classNames={{
        base: 'bg-white border border-kr-gold/40 shadow-2xl rounded-2xl',
        header: 'border-b border-kr-blushBorder bg-kr-blush/80 px-6 py-4',
        footer: 'border-t border-kr-blushBorder bg-gray-50 px-6 py-3',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-kr-gold" />
            <div>
              <h2 className="font-serif font-bold text-kr-maroon text-lg">
                {t.voiceOrderAssistant}
              </h2>
              <p className="text-xs text-kr-textMuted font-normal">
                {t.speakOrderPrompt}
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="p-6 space-y-6">
          {/* Big Microphone Tap Button */}
          <div className="flex flex-col items-center justify-center py-4 space-y-4 text-center">
            <button
              type="button"
              onClick={listening ? stopVoice : startVoice}
              className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                listening
                  ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-200 scale-110'
                  : 'bg-kr-maroon hover:bg-kr-maroonDark text-white ring-4 ring-kr-gold/30 hover:scale-105'
              }`}
            >
              {listening ? (
                <Volume2 className="h-10 w-10 animate-bounce" />
              ) : (
                <Mic className="h-10 w-10 text-kr-gold" />
              )}
            </button>

            <div>
              <p className="text-sm font-bold text-gray-800">
                {listening ? t.listening : (isTelugu ? 'మైక్‌పై నొక్కి మాట్లాడండి' : 'Tap microphone to speak')}
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                {isTelugu
                  ? 'కస్టమర్ పేరు, ఫోన్ నంబర్, చీరలు లేదా డ్రెస్సుల సంఖ్య, ధర మరియు అడ్వాన్స్ స్పష్టంగా చెప్పండి.'
                  : 'Speak customer name, phone, item quantities, prices, and advance amount.'}
              </p>
            </div>
          </div>

          {/* Real-time Spoken Transcript Box */}
          {transcript && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-kr-maroon">
                {isTelugu ? 'మీరు చెప్పిన మాటలు (Transcript):' : 'Spoken Speech Transcript:'}
              </span>
              <p className="text-sm text-gray-800 italic font-medium leading-relaxed">
                &ldquo;{transcript}&rdquo;
              </p>
            </div>
          )}

          {/* Parsed Result Preview */}
          {parsedResult && (
            <div className="p-4 rounded-xl bg-kr-blush/60 border border-kr-blushBorder space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-kr-maroon flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-kr-gold" />
                  {t.recognizedDetails}
                </span>
                <Chip size="sm" color="success" variant="flat" className="text-[10px]">
                  {isTelugu ? 'గుర్తించబడింది' : 'Parsed'}
                </Chip>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">{t.customerDetails}:</span>{' '}
                  <strong className="text-gray-900">{parsedResult.customer_name}</strong>
                </div>
                <div>
                  <span className="text-gray-500">{t.phone}:</span>{' '}
                  <strong className="text-gray-900 font-mono">{parsedResult.customer_phone || '-'}</strong>
                </div>
                <div>
                  <span className="text-gray-500">{t.total}:</span>{' '}
                  <strong className="text-gray-900">₹{parsedResult.total_amount}</strong>
                </div>
                <div>
                  <span className="text-gray-500">{t.advanceReceived}:</span>{' '}
                  <strong className="text-green-700">₹{parsedResult.paid_amount}</strong>
                </div>
              </div>

              {parsedResult.items.length > 0 && (
                <div className="text-xs text-gray-600 border-t border-kr-blushBorder pt-2">
                  <span className="font-semibold">{t.recognizedItems}:</span>{' '}
                  {parsedResult.items.map((it) => `${it.quantity}x ${it.item_name} (₹${it.total_price})`).join(', ')}
                </div>
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter className="flex justify-between items-center">
          <Button variant="light" size="sm" onPress={onClose}>
            {t.cancel}
          </Button>

          {parsedResult && (
            <Button
              color="primary"
              size="md"
              startContent={<CheckCircle2 className="h-4 w-4" />}
              onPress={handleApply}
              className="bg-kr-maroon text-white font-bold shadow-md px-6"
            >
              {isTelugu ? 'ఆర్డర్ ఫారంలో నింపండి (Auto-Fill)' : 'Auto-Fill Order Form'}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default SmartVoiceOrderModal;
