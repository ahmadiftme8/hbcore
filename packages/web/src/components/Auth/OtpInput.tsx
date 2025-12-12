'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import './OtpInput.css';

// Persian digits mapping for display
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const WESTERN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function toPersianDigits(text: string): string {
  return text.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[parseInt(digit, 10)]);
}

function toWesternDigits(text: string): string {
  return text.replace(/[۰-۹]/g, (digit) => {
    const index = PERSIAN_DIGITS.indexOf(digit);
    return index !== -1 ? WESTERN_DIGITS[index] : digit;
  });
}

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  length?: number;
}

export function OtpInput({ value, onChange, disabled, length = 6 }: OtpInputProps) {
  // Store digits in Latin format (for data), display in Persian
  const [digits, setDigits] = useState<string[]>(() => {
    const initial = toWesternDigits(value).split('').slice(0, length);
    return Array.from({ length }, (_, i) => initial[i] || '');
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Generate stable keys for OTP inputs (positions are fixed, never reorder)
  const inputKeys = useMemo(() => {
    return Array.from({ length }, (_, i) => `otp-${i}`);
  }, [length]);

  // Sync with external value changes
  useEffect(() => {
    const westernValue = toWesternDigits(value);
    const newDigits = Array.from({ length }, (_, i) => westernValue[i] || '');
    setDigits(newDigits);
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    // Convert Persian digits to Latin, then extract only digits
    const westernValue = toWesternDigits(newValue);
    const digit = westernValue.replace(/\D/g, '').slice(0, 1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Update parent value with Latin digits
    onChange(newDigits.join(''));

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = toWesternDigits(e.clipboardData.getData('text'));
    const digitsOnly = pasted.replace(/\D/g, '').slice(0, length);
    const newDigits = Array.from({ length }, (_, i) => digitsOnly[i] || '');
    setDigits(newDigits);
    onChange(newDigits.join(''));

    // Focus the next empty input or the last one
    const nextEmptyIndex = newDigits.findIndex((d) => !d);
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleCopy = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    // Copy the Latin digit, not the Persian display
    const latinDigit = digits[index] || '';
    e.clipboardData.setData('text/plain', latinDigit);
  };

  return (
    <div className="otp-input-container">
      {Array.from({ length }, (_, i) => (
        <Input
          key={inputKeys[i]}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={toPersianDigits(digits[i] || '')}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onCopy={(e) => handleCopy(i, e)}
          disabled={disabled}
          className="otp-input otp-input-persian"
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}
