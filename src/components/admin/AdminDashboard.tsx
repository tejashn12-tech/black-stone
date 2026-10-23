import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserPlus,
  Award,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Globe,
  Bell,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Shield,
  Search,
  Plus,
  Clock,
  Menu,
  X,
  MessageSquare,
  Database,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGym } from '../../context/GymContext';
import { BSFLogo } from '../common/BSFLogo';
import { DashboardOverview } from './DashboardOverview';
import { DeskCommandPalette } from './DeskCommandPalette';
import { IndianFestivalsWishModal } from './IndianFestivalsWishModal';
import { getEffectiveMemberStatus } from '../../utils/memberStatus';

// Resilient lazy loader that retries tab module imports if temporary network or rebuild occurs
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  interval = 500
) {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      function attempt(remaining: number) {
        factory()
          .then(resolve)
          .catch((error) => {
            if (remaining > 0) {
              setTimeout(() => attempt(remaining - 1), interval);
            } else {
              reject(error);
            }
          });
      }
      attempt(retries);
    })
  );
}

// Lazy load heavy admin tabs to dramatically cut initial bundle and speed up initial render
const MemberManagement = lazyWithRetry(() => import('./MemberManagement').then(m => ({ default: m.MemberManagement })));
const PaymentManagement = lazyWithRetry(() => import('./PaymentManagement').then(m => ({ default: m.PaymentManagement })));
const EnquiryManagement = lazyWithRetry(() => import('./EnquiryManagement').then(m => ({ default: m.EnquiryManagement })));
const TrainerManagement = lazyWithRetry(() => import('./TrainerManagement').then(m => ({ default: m.TrainerManagement })));
const PackageManagement = lazyWithRetry(() => import('./PackageManagement').then(m => ({ default: m.PackageManagement })));
const SettingsPanel = lazyWithRetry(() => import('./SettingsPanel').then(m => ({ default: m.SettingsPanel })));
const DPDPComplianceHub = lazyWithRetry(() => import('./DPDPComplianceHub').then(m => ({ default: m.DPDPComplianceHub })));
const WhatsAppIntegrationPanel = lazyWithRetry(() => import('./WhatsAppIntegrationPanel').then(m => ({ default: m.WhatsAppIntegrationPanel })));

// Isolated live clock component to prevent forcing full AdminDashboard re-renders every 1000ms
const LiveClock: React.FC = React.memo(() => {
  const [timeStr, setTimeStr] = useState(() => {
    try {
      return new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return 'Live';
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="text-zinc-300 font-semibold">{timeStr}</span>;
});

interface AdminDashboardProps {
  onBackToPublicSite: () => void;
}

export type AdminTab =
  | 'overview'
  | 'members'
  | 'payments'
  | 'enquiries'
  | 'whatsapp'
  | 'dpdp'
  | 'trainers'
  | 'packages'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToPublicSite
}) => {
  const {
    members,
    enquiries,
    payments,
    trainers,
    packages,
    festivals,
    sendFestivalWishesToAll,
    dataSubjectRequests,
    whatsAppSession,
    logout,
    syncAllToFirestore,
    isQuotaExhausted,
    reconnectFirestore
  } = useGym();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [syncResultNotice, setSyncResultNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Indian Festivals Automation & Broadcast State
  const [isFestivalModalOpen, setIsFestivalModalOpen] = useState(false);
  const [selectedFestivalModalId, setSelectedFestivalModalId] = useState<string | undefined>(undefined);
  const [isBroadcastingFestival, setIsBroadcastingFestival] = useState(false);
  const [festivalBroadcastNotice, setFestivalBroadcastNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    try {
      if (isQuotaExhausted) {
        const reconnected = await reconnectFirestore();
        if (!reconnected) {
          setSyncResultNotice({
            type: 'error',
            message: 'Firestore daily write quota is still resting. Changes are safely saved locally!'
          });
          setTimeout(() => setSyncResultNotice(null), 6000);
          setIsManualSyncing(false);
          return;
        }
      }
      const res = await syncAllToFirestore();
      if (res.success) {
        setSyncResultNotice({
          type: 'success',
          message: `Saved & verified ${res.count} records in database.`
        });
        setTimeout(() => setSyncResultNotice(null), 5000);
      } else {
        setSyncResultNotice({
          type: 'error',
          message: res.error || 'Failed to complete cloud sync.'
        });
        setTimeout(() => setSyncResultNotice(null), 6000);
      }
    } catch (err: any) {
      setSyncResultNotice({
        type: 'error',
        message: err?.message || 'Failed to sync to database.'
      });
      setTimeout(() => setSyncResultNotice(null), 6000);
    } finally {
      setIsManualSyncing(false);
    }
  };

  // Global Command Search
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Keyboard Shortcuts for Everyday High Usage:
  // - Ctrl+K / Cmd+K / Slash -> Command Palette
  // - Shift+N -> Members tab
  // - Shift+P -> Payments tab
  // - Shift+L -> Leads tab
  // - Shift+W -> WhatsApp tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT';

      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // If user is typing in an input, don't hijack simple single-key shortcuts
      if (isInput) return;

      if (e.key === '/') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.shiftKey && e.key.toUpperCase() === 'N') {
        e.preventDefault();
        setActiveTab('members');
      } else if (e.shiftKey && e.key.toUpperCase() === 'P') {
        e.preventDefault();
        setActiveTab('payments');
      } else if (e.shiftKey && e.key.toUpperCase() === 'L') {
        e.preventDefault();
        setActiveTab('enquiries');
      } else if (e.shiftKey && e.key.toUpperCase() === 'W') {
        e.preventDefault();
        setActiveTab('whatsapp');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const todayBirthdays = React.useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const targetMMDD = `${mm}-${dd}`;

    return members.filter(m => {
      const rawDob = m.dob || (m as any).dateOfBirth || (m as any).birthDate;
      if (!rawDob || typeof rawDob !== 'string') return false;
      const parts = rawDob.trim().split(/[-/.]/);
      if (parts.length === 3) {
        let mStr = '';
        let dStr = '';
        if (parts[0].length === 4) {
          mStr = parts[1].padStart(2, '0');
          dStr = parts[2].padStart(2, '0');
        } else if (parts[2].length === 4) {
          dStr = parts[0].padStart(2, '0');
          mStr = parts[1].padStart(2, '0');
        } else {
          mStr = parts[1].padStart(2, '0');
          dStr = parts[2].padStart(2, '0');
        }
        return `${mStr}-${dStr}` === targetMMDD;
      }
      return false;
    });
  }, [members]);

  // Today's Indian Festivals & Upcoming Indian Festivals
  const todayFestivals = React.useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const targetMMDD = `${mm}-${dd}`;
    return festivals.filter(f => f.enabled !== false && f.monthDay === targetMMDD);
  }, [festivals]);

  const upcomingFestivals = React.useMemo(() => {
    const now = new Date();
    return festivals
      .filter(f => f.enabled !== false)
      .map(f => {
        const [fM, fD] = (f.monthDay || '01-01').split('-').map(Number);
        const year = now.getFullYear();
        let target = new Date(year, fM - 1, fD);
        if (target.getTime() < now.getTime() - 24 * 60 * 60 * 1000) {
          target = new Date(year + 1, fM - 1, fD);
        }
        const diffMs = target.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return { ...f, daysUntil: diffDays };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [festivals]);

  const expiringCount = members.filter(m => getEffectiveMemberStatus(m) === 'expiring_soon').length;
  const newLeadsCount = enquiries.filter(e => e.status === 'New Lead' || e.status === 'Follow-up Required').length;
  const pendingDSRCount = dataSubjectRequests.filter(d => d.status === 'pending' || d.status === 'in_progress').length;

  const navItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'members' as AdminTab,
      label: 'Members Directory',
      icon: Users,
      badge: expiringCount > 0 ? `${expiringCount} Alerts` : `${members.length}`,
      badgeColor: expiringCount > 0 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-zinc-800 text-zinc-400'
    },
    {
      id: 'payments' as AdminTab,
      label: 'Billing & Payments',
      icon: CreditCard,
      badge: `${payments.length}`
    },
    {
      id: 'enquiries' as AdminTab,
      label: 'Leads & Enquiries',
      icon: UserPlus,
      badge: newLeadsCount > 0 ? `${newLeadsCount} New` : null,
      badgeColor: 'bg-orange-400 text-black font-extrabold'
    },
    {
      id: 'dpdp' as AdminTab,
      label: 'DPDP Privacy Hub',
      icon: Shield,
      badge: pendingDSRCount > 0 ? `${pendingDSRCount} DSR` : 'Compliant',
      badgeColor: pendingDSRCount > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400'
    },
    {
      id: 'whatsapp' as AdminTab,
      label: 'WhatsApp Gateway',
      icon: MessageSquare,
      badge: todayBirthdays.length > 0
        ? `🎂 ${todayBirthdays.length} Birthday${todayBirthdays.length > 1 ? 's' : ''}`
        : todayFestivals.length > 0
        ? `🪔 ${todayFestivals[0].name.split('(')[0].trim()}`
        : whatsAppSession.status === 'connected'
        ? 'Active'
        : whatsAppSession.status === 'connecting'
        ? 'Connecting'
        : null,
      badgeColor: todayBirthdays.length > 0
        ? 'bg-amber-400 text-black font-black'
        : todayFestivals.length > 0
        ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-black font-black'
        : whatsAppSession.status === 'connected'
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
    },
    {
      id: 'trainers' as AdminTab,
      label: 'Trainers & Coaches',
      icon: Award,
      badge: null
    },
    {
      id: 'packages' as AdminTab,
      label: 'Plans & Pricing',
      icon: Package,
      badge: null
    },
    {
      id: 'settings' as AdminTab,
      label: 'Club Settings & UPI',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row pb-16 md:pb-0" id="bsf-admin-master-dashboard">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-full md:w-72 bg-zinc-900/90 border-r border-zinc-800/80 p-5 flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0 backdrop-blur-sm hidden md:flex">
        
        <div className="space-y-5">
          {/* Brand Logo & Switcher */}
          <div className="flex items-center justify-between">
            <BSFLogo size="sm" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-400/10 border border-orange-400/20 text-orange-400 text-[10px] font-black uppercase font-mono">
              <ShieldCheck className="w-3 h-3" />
              <span>ADMIN</span>
            </div>
          </div>

          {/* Quick Search Shortcut */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full py-2 px-3 bg-zinc-950/90 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-medium transition flex items-center justify-between border border-zinc-800/80 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-orange-400" />
              <span>Quick Search & Jump</span>
            </span>
            <kbd className="text-[10px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* Navigation items */}
          <nav className="space-y-1 font-sans-body">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition ${
                    isActive
                      ? 'bg-orange-400 text-black shadow-md shadow-orange-400/20 font-extrabold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono ${item.badgeColor || 'bg-zinc-800 text-zinc-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-2 font-sans-body">
          <div className="flex items-center justify-between px-2 text-[10px] text-zinc-500 font-mono">
            <span>Server Time</span>
            <LiveClock />
          </div>

          <button
            onClick={onBackToPublicSite}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition border border-zinc-800/80"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>Public Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          <button
            onClick={() => {
              logout();
              onBackToPublicSite();
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>

      </aside>

      {/* Top Mobile Bar */}
      <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-3.5 flex items-center justify-between sticky top-0 z-30">
        <BSFLogo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700"
            title="Search"
          >
            <Search className="w-4 h-4 text-orange-400" />
          </button>
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700"
            title="Menu"
          >
            {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 space-y-2 sticky top-[57px] z-30">
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs ${
                    isActive ? 'bg-orange-400 text-black font-extrabold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-zinc-800 text-zinc-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Workspace Area */}
      <main id="bsf-admin-main-content" className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen bg-zinc-950/95 scroll-smooth">
        
        {/* Real-time Database Persistence Bar */}
        <div className="mb-6 bg-zinc-900/90 border border-zinc-800 backdrop-blur-md rounded-2xl p-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/60 text-orange-400 shrink-0">
              <Database className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                {isQuotaExhausted ? (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                ) : (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </>
                )}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white tracking-wide">
                  {isQuotaExhausted ? 'LOCAL STORAGE MODE' : 'FIRESTORE DATABASE'}
                </span>
                {isQuotaExhausted ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Quota Protection Active
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Auto-Save Active
                  </span>
                )}
                <span className="text-[10px] text-zinc-500 font-mono hidden md:inline">
                  {isQuotaExhausted
                    ? '• All member & payment edits are securely preserved locally & offline'
                    : '• All additions, edits & changes are saved directly to database'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans-body">
                {trainers.length} Trainers • {members.length} Members • {packages.length} Membership Plans
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {syncResultNotice && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${
                syncResultNotice.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {syncResultNotice.message}
              </span>
            )}
            <button
              onClick={handleManualSync}
              disabled={isManualSyncing}
              title={isQuotaExhausted ? "Attempt to reconnect to Firestore" : "Force verify and save all records to the Firestore database"}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-800 disabled:opacity-50 text-zinc-200 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition border border-zinc-700 flex items-center gap-1.5 shadow-sm"
            >
              {isManualSyncing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                  <span>{isQuotaExhausted ? 'Reconnecting...' : 'Saving to DB...'}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
                  <span>{isQuotaExhausted ? 'Test Reconnect' : 'Sync All to DB'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Daily Birthday Notification Banner in main#bsf-admin-main-content */}
        {todayBirthdays.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-zinc-900 border border-amber-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0 border border-amber-500/30">
                🎂
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">
                    TODAY'S BIRTHDAYS ({todayBirthdays.length})
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Auto-Wish Active (Without Fail)
                  </span>
                </div>
                <p className="text-xs text-zinc-200 font-medium mt-0.5">
                  Celebrating today: <span className="font-bold text-white">{todayBirthdays.map(m => m.fullName).join(', ')}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-2"
            >
              <span>View WhatsApp Automation</span>
            </button>
          </div>
        )}

        {/* Today's Indian Festival Celebration Banner in main#bsf-admin-main-content */}
        {todayFestivals.length > 0 ? (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-orange-950/40 to-zinc-900 border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 via-orange-500/20 to-red-500/20 text-amber-300 flex items-center justify-center text-2xl shrink-0 border border-amber-500/40 shadow-inner">
                🪔
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">
                    TODAY'S INDIAN FESTIVAL: {todayFestivals[0].name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Auto-Wish Active For Everyone (Without Fail)
                  </span>
                </div>
                <p className="text-xs text-zinc-200 font-medium mt-1">
                  Festive wish template ready. Automated background delivery active for all <span className="font-bold text-white">{members.filter(m => (m.status as string) !== 'inactive' && (m.whatsapp || m.phone)).length} active members</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                disabled={isBroadcastingFestival}
                onClick={async () => {
                  setIsBroadcastingFestival(true);
                  try {
                    const res = await sendFestivalWishesToAll(todayFestivals[0].id);
                    if (res.success) {
                      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                      setFestivalBroadcastNotice({
                        type: 'success',
                        message: `Festive wishes for ${todayFestivals[0].name} dispatched to everyone without fail! (Sent: ${res.sent}, Skipped/Duplicate: ${res.duplicate})`
                      });
                      setTimeout(() => setFestivalBroadcastNotice(null), 8000);
                    } else {
                      setFestivalBroadcastNotice({
                        type: 'error',
                        message: res.error || 'Failed to dispatch festival wishes.'
                      });
                    }
                  } catch (err: any) {
                    setFestivalBroadcastNotice({
                      type: 'error',
                      message: err?.message || 'Error dispatching wishes.'
                    });
                  } finally {
                    setIsBroadcastingFestival(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-black font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {isBroadcastingFestival ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Broadcasting to Everyone...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Wish to Everyone Now</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedFestivalModalId(todayFestivals[0].id);
                  setIsFestivalModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>All Indian Festivals (35+)</span>
              </button>
            </div>
          </div>
        ) : (
          /* When today is not an active festival, display the Indian Festivals Auto-Wish Bar */
          upcomingFestivals.length > 0 && (
            <div className="mb-6 px-4 py-3 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-amber-950/20 border border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🪔</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">
                      All Indian Festivals Wish Automation:
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active For Everyone Without Fail
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Next upcoming festival: <strong className="text-amber-300">{upcomingFestivals[0].name}</strong> ({upcomingFestivals[0].dateString}) in <span className="font-mono text-zinc-200">{upcomingFestivals[0].daysUntil} days</span>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFestivalModalId(upcomingFestivals[0]?.id);
                  setIsFestivalModalOpen(true);
                }}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Manage Indian Festivals &amp; Wishes ({festivals.length})</span>
              </button>
            </div>
          )
        )}

        {/* Festival Broadcast Feedback Notice */}
        {festivalBroadcastNotice && (
          <div className={`mb-6 p-4 rounded-xl text-xs flex items-center justify-between border ${
            festivalBroadcastNotice.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{festivalBroadcastNotice.message}</span>
            </div>
            <button
              onClick={() => setFestivalBroadcastNotice(null)}
              className="text-xs underline hover:no-underline font-semibold ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Sub-Component based on active tab with Suspense code-splitting */}
        <Suspense fallback={
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-semibold">
            <Loader2 className="w-7 h-7 animate-spin text-orange-400" />
            <span>Loading workspace module...</span>
          </div>
        }>
          {activeTab === 'overview' && (
            <DashboardOverview
              onNavigate={(tab) => setActiveTab(tab as AdminTab)}
              onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
            />
          )}

          {activeTab === 'members' && (
            <MemberManagement />
          )}

          {activeTab === 'payments' && (
            <PaymentManagement />
          )}

          {activeTab === 'enquiries' && (
            <EnquiryManagement />
          )}

          {activeTab === 'dpdp' && (
            <DPDPComplianceHub />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppIntegrationPanel />
          )}

          {activeTab === 'trainers' && (
            <TrainerManagement />
          )}

          {activeTab === 'packages' && (
            <PackageManagement />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel />
          )}
        </Suspense>

      </main>

      {/* Mobile Sticky Bottom Fast Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activeTab === 'overview' ? 'text-orange-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activeTab === 'members' ? 'text-orange-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Members</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activeTab === 'payments' ? 'text-orange-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Fees</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activeTab === 'enquiries' ? 'text-orange-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Leads</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activeTab === 'whatsapp' ? 'text-emerald-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activeTab === 'settings' ? 'text-orange-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Global Command Center (Cmd+K / Ctrl+K / /) */}
      <DeskCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
      />

      {/* Indian Festivals Automated Wish Center Modal */}
      <IndianFestivalsWishModal
        isOpen={isFestivalModalOpen}
        onClose={() => setIsFestivalModalOpen(false)}
        initialSelectedFestivalId={selectedFestivalModalId}
      />

    </div>
  );
};
