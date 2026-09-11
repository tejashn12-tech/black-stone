import React, { useState, useEffect } from 'react';
import {
  Cookie,
  Shield,
  Check,
  X,
  Settings,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { safeLocalStorageGet, STORAGE_KEYS } from '../../utils/storage';

interface CookieConsentBannerProps {
  onOpenPrivacyNotice?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenPrivacyNotice
}) => {
  const { cookiePreferences, updateCookiePreferences } = useGym();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(cookiePreferences.analytics);
  const [marketingEnabled, setMarketingEnabled] = useState(cookiePreferences.marketing);

  useEffect(() => {
    // Check if user has previously set consent
    const stored = safeLocalStorageGet(STORAGE_KEYS.COOKIE_PREFERENCES);
    if (!stored) {
      // Show after 1.5s delay for smooth initial load
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    updateCookiePreferences({
      essential: true,
      analytics: true,
      marketing: true
    });
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    updateCookiePreferences({
      essential: true,
      analytics: false,
      marketing: false
    });
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    updateCookiePreferences({
      essential: true,
      analytics: analyticsEnabled,
      marketing: marketingEnabled
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Privacy & Cookie Preferences" className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded-2xl shadow-2xl p-5 space-y-4 text-zinc-300">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">DPDP Privacy & Tracker Consent</h3>
              <p className="text-[11px] text-zinc-400">We respect your data rights under DPDP Act 2023 (India)</p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed">
          Black Stone Fitness uses essential local storage to keep your member session active. Non-essential performance and analytics trackers are <strong className="text-white">disabled by default</strong> and require your explicit opt-in consent.
        </p>

        {/* Customization Accordion */}
        {isCustomizing && (
          <div className="space-y-3 pt-2 border-t border-zinc-800 animate-in fade-in duration-200">
            
            {/* Essential */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Essential Storage & Auth</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded">Always Active</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">Required for staff logins, member digital ID verification, and cloud synchronization.</p>
              </div>
              <input
                type="checkbox"
                disabled
                checked
                className="w-4 h-4 accent-orange-500 opacity-60 cursor-not-allowed"
              />
            </div>

            {/* Analytics */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Performance & Workout Metrics</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">Anonymous workout calculator usage and exercise performance logs.</p>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer rounded"
              />
            </div>

            {/* Marketing */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Promotional Communications</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">Seasonal membership discounts and festival celebration announcements.</p>
              </div>
              <input
                type="checkbox"
                checked={marketingEnabled}
                onChange={(e) => setMarketingEnabled(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer rounded"
              />
            </div>

          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="text-xs text-zinc-400 hover:text-orange-400 transition flex items-center gap-1 font-medium"
            >
              <Settings className="w-3 h-3" />
              <span>{isCustomizing ? 'Hide Options' : 'Preferences'}</span>
            </button>
            {onOpenPrivacyNotice && (
              <button
                onClick={onOpenPrivacyNotice}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition"
              >
                • Privacy Notice
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isCustomizing ? (
              <button
                onClick={handleSaveCustom}
                className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs transition"
              >
                Save Preferences
              </button>
            ) : (
              <>
                <button
                  onClick={handleRejectNonEssential}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs transition"
                >
                  Accept All
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </aside>
  );
};
