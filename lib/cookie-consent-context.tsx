'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { CookieConsent } from '@/lib/types';

const CONSENT_KEY = 'igs_cookie_consent';

interface CookieConsentContextValue {
  consent: CookieConsent | null;
  showBanner: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (prefs: Omit<CookieConsent, 'necessary' | 'consentGiven' | 'timestamp'>) => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      setConsent(JSON.parse(stored));
    } else {
      setShowBanner(true);
    }
  }, []);

  const save = useCallback((newConsent: CookieConsent) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
    setShowBanner(false);
    // Future: initialise analytics, marketing pixels here based on consent
  }, []);

  const acceptAll = useCallback(() => {
    save({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      consentGiven: true,
      timestamp: new Date().toISOString(),
    });
  }, [save]);

  const rejectNonEssential = useCallback(() => {
    save({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      consentGiven: true,
      timestamp: new Date().toISOString(),
    });
  }, [save]);

  const savePreferences = useCallback(
    (prefs: Omit<CookieConsent, 'necessary' | 'consentGiven' | 'timestamp'>) => {
      save({ ...prefs, necessary: true, consentGiven: true, timestamp: new Date().toISOString() });
    },
    [save]
  );

  return (
    <CookieConsentContext.Provider value={{ consent, showBanner, acceptAll, rejectNonEssential, savePreferences }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return ctx;
}
