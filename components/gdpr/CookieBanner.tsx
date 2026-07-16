'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings } from 'lucide-react';
import { useCookieConsent } from '@/lib/cookie-consent-context';

export function CookieBanner() {
  const { showBanner, acceptAll, rejectNonEssential, savePreferences } = useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false, preferences: false });

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-[#050505] text-white border-t-2 border-[#265954] shadow-2xl"
        >
          {!showPreferences ? (
            <div className="px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-10">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#265954] mb-1 font-semibold">Cookie Preferences</p>
                <p className="text-sm text-white/70 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyse site traffic, and personalise content.
                  Your consent helps us improve our service.{' '}
                  <a href="/privacy-policy" className="text-[#265954] hover:text-white transition-colors underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors px-3 py-2 border border-white/20 hover:border-white/40"
                >
                  <Settings size={12} />
                  Manage
                </button>
                <button
                  onClick={rejectNonEssential}
                  className="text-[10px] uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors px-4 py-2 border border-white/30 hover:border-white/60"
                >
                  Reject All
                </button>
                <button
                  onClick={acceptAll}
                  className="text-[10px] uppercase tracking-[0.18em] bg-[#265954] hover:bg-[#3B8A82] text-white px-5 py-2 transition-colors font-semibold rounded-md"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 md:px-10 py-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#265954] font-semibold">Manage Cookie Preferences</p>
                <button onClick={() => setShowPreferences(false)} className="text-white/50 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Necessary */}
                <div className="p-4 border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white font-semibold">Necessary</span>
                    <span className="text-[10px] text-[#265954]">Always On</span>
                  </div>
                  <p className="text-xs text-white/50">Essential for the website to function. Cannot be disabled.</p>
                </div>
                {/* Analytics */}
                <div className="p-4 border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white font-semibold">Analytics</span>
                    <button
                      onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
                      className={`w-9 h-5 rounded-full transition-colors relative ${prefs.analytics ? 'bg-[#265954]' : 'bg-white/20'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${prefs.analytics ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-white/50">Helps us understand how visitors use our site (Google Analytics, PostHog).</p>
                </div>
                {/* Marketing */}
                <div className="p-4 border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white font-semibold">Marketing</span>
                    <button
                      onClick={() => setPrefs((p) => ({ ...p, marketing: !p.marketing }))}
                      className={`w-9 h-5 rounded-full transition-colors relative ${prefs.marketing ? 'bg-[#265954]' : 'bg-white/20'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${prefs.marketing ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-white/50">Used for retargeting and personalised advertising (Meta Pixel).</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => savePreferences(prefs)}
                  className="text-[10px] uppercase tracking-[0.18em] bg-[#265954] hover:bg-[#3B8A82] text-white px-5 py-2 transition-colors font-semibold rounded-md"
                >
                  Save Preferences
                </button>
                <button
                  onClick={acceptAll}
                  className="text-[10px] uppercase tracking-[0.18em] bg-white/10 hover:bg-white/20 text-white px-5 py-2 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
