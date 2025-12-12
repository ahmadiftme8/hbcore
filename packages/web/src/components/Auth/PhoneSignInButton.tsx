'use client';

import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useTurnstile } from '@/hooks/useTurnstile';
import { useTranslation } from '@/i18n/useTranslation';
import { logger } from '@/lib/utils/logger';
import { isValidOtpLength, isValidPhoneLength, normalizeIranPhone } from '@/lib/validation/phone';
import { authService } from '@/services/auth.service';
import { OtpInput } from './OtpInput';
import { PhoneInput } from './PhoneInput';
import './PhoneSignInButton.css';

type Step = 'phone' | 'otp';

export function PhoneSignInButton() {
  const { signInWithPhone } = useAuth();
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [rawPhoneInput, setRawPhoneInput] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleError } = useErrorHandler({
    defaultMessage: t.auth.errors.failedToSendOtp,
  });

  const turnstile = useTurnstile({
    enabled: step === 'phone',
    onError: setError,
    siteKeyNotConfiguredError: t.auth.turnstileSiteKeyNotConfigured,
    verificationFailedError: t.auth.errors.turnstileVerificationFailed,
    failedToLoadError: t.auth.errors.failedToLoadSecurity,
  });

  const handleRawInputChange = useCallback((rawValue: string) => {
    setRawPhoneInput(rawValue);
  }, []);

  const normalizedPhone = useMemo(() => {
    const phoneToNormalize = phone || rawPhoneInput;
    return normalizeIranPhone(phoneToNormalize);
  }, [phone, rawPhoneInput]);

  const handleRequestOTP = async () => {
    console.log('🔵 handleRequestOTP called', {
      normalizedPhone,
      turnstileToken: turnstile.token,
      phone,
      rawPhoneInput,
    });

    if (!normalizedPhone) {
      console.log('❌ No normalized phone');
      setError(t.auth.errors.invalidPhone);
      return;
    }

    if (!turnstile.token) {
      console.log('❌ No Turnstile token');
      setError(t.auth.errors.completeSecurityVerification);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Making OTP request:', {
        phone: normalizedPhone,
        turnstileToken: turnstile.token,
      });
      logger.info('Sending OTP request with phone:', phone, 'Normalized:', normalizedPhone);

      await authService.requestOtp(normalizedPhone, turnstile.token);
      console.log('✅ OTP request successful');
      setStep('otp');
    } catch (err) {
      console.error('❌ Request OTP failed:', err);
      logger.error('Request OTP failed:', err);
      const errorMessage = handleError(err);
      setError(errorMessage);
      turnstile.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !isValidOtpLength(otp)) {
      setError(t.auth.errors.invalidOtpCode);
      return;
    }

    if (!normalizedPhone) {
      setError(t.auth.errors.invalidPhone);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await signInWithPhone(normalizedPhone, otp);
    } catch (err) {
      logger.error('Verify OTP failed:', err);
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
    setError(null);
    turnstile.reset();
  };

  if (step === 'otp') {
    return (
      <div className="phone-signin-otp">
        <p className="phone-signin-instruction">{t.auth.enterOtpCode}</p>
        <OtpInput value={otp} onChange={setOtp} disabled={loading} />
        {error && <p className="phone-signin-error">{error}</p>}
        <div className="phone-signin-actions">
          <Button variant="outline" onClick={handleBack} disabled={loading}>
            {t.auth.back}
          </Button>
          <Button onClick={handleVerifyOTP} disabled={loading || !isValidOtpLength(otp)}>
            {loading ? t.auth.verifying : t.auth.verify}
          </Button>
        </div>
      </div>
    );
  }

  const isButtonDisabled = loading || !turnstile.token || !normalizedPhone || !isValidPhoneLength(normalizedPhone);

  return (
    <div className="phone-signin">
      <PhoneInput value={phone} onChange={setPhone} onRawInputChange={handleRawInputChange} disabled={loading} />
      <div ref={turnstile.containerRef} className="phone-signin-turnstile" />
      {error && <p className="phone-signin-error">{error}</p>}
      <Button onClick={handleRequestOTP} disabled={isButtonDisabled}>
        {loading ? t.auth.sending : t.auth.sendCode}
      </Button>
    </div>
  );
}
