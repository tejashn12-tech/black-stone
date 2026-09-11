import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useGym } from '../../context/GymContext';
import { Member } from '../../types';
import { getEffectiveMemberStatus } from '../../utils/memberStatus';
import {
  Search,
  Users,
  CreditCard,
  UserPlus,
  ArrowRight,
  X,
  Phone,
  RefreshCw,
  CornerDownLeft,
  ShieldAlert,
  AlertCircle,
  Package,
  Settings,
  Shield,
  MessageSquare
} from 'lucide-react';

interface DeskCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenNewMember?: () => void;
  onOpenNewPayment?: (member?: Member) => void;
  onOpenRenewMember?: (member: Member) => void;
}

export const DeskCommandPalette: React.FC<DeskCommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenNewMember,
  onOpenNewPayment,
  onOpenRenewMember
}) => {
  const { members, enquiries } = useGym();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  // Global Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Matching Members
  const matchingMembers = useMemo(() => {
    if (!query.trim()) {
      return members
        .filter(m => {
          const st = getEffectiveMemberStatus(m);
          return st === 'expiring_soon' || st === 'expired' || (m.pendingAmount && m.pendingAmount > 0);
        })
        .slice(0, 6);
    }

    const q = query.toLowerCase().trim();
    return members
      .filter(m => {
        const matchesName = m.fullName.toLowerCase().includes(q);
        const matchesPhone = (m.phone || '').includes(q) || (m.whatsapp || '').includes(q);
        const matchesCode = (m.memberCode || '').toLowerCase().includes(q);
        const matchesPackage = (m.packageName || '').toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesCode || matchesPackage;
      })
      .slice(0, 10);
  }, [members, query]);

  // Quick Action Shortcuts
  const quickActions = useMemo(() => {
    const actions = [
      {
        id: 'act-new-member',
        title: 'New Member Admission Form',
        category: 'Admissions',
        icon: UserPlus,
        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        shortcut: 'Shift+N',
        action: () => {
          onClose();
          onNavigateTab('members');
          onOpenNewMember?.();
        }
      },
      {
        id: 'act-record-payment',
        title: 'Record Fee Payment / Issue Receipt',
        category: 'Billing',
        icon: CreditCard,
        color: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
        shortcut: 'Shift+P',
        action: () => {
          onClose();
          onNavigateTab('payments');
          onOpenNewPayment?.();
        }
      },
      {
        id: 'act-members',
        title: 'Open Full Members Directory',
        category: 'Navigation',
        icon: Users,
        color: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
        shortcut: 'G+M',
        action: () => {
          onClose();
          onNavigateTab('members');
        }
      },
      {
        id: 'act-enquiries',
        title: 'Enquiry & Leads CRM',
        category: 'Leads',
        icon: UserPlus,
        color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
        shortcut: 'Shift+L',
        action: () => {
          onClose();
          onNavigateTab('enquiries');
        }
      },
      {
        id: 'act-dpdp',
        title: 'DPDP Privacy & Consent Hub',
        category: 'Compliance',
        icon: Shield,
        color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        shortcut: 'G+D',
        action: () => {
          onClose();
          onNavigateTab('dpdp');
        }
      },
      {
        id: 'act-whatsapp',
        title: 'WhatsApp Gateway & QR Code Scan',
        category: 'Integration',
        icon: MessageSquare,
        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        shortcut: 'Shift+W',
        action: () => {
          onClose();
          onNavigateTab('whatsapp');
        }
      },
      {
        id: 'act-packages',
        title: 'Membership Plans & Pricing',
        category: 'Configuration',
        icon: Package,
        color: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
        shortcut: 'G+P',
        action: () => {
          onClose();
          onNavigateTab('packages');
        }
      },
      {
        id: 'act-settings',
        title: 'Club Settings & UPI QR',
        category: 'Configuration',
        icon: Settings,
        color: 'text-zinc-300 bg-zinc-800 border-zinc-700',
        shortcut: 'G+S',
        action: () => {
          onClose();
          onNavigateTab('settings');
        }
      }
    ];

    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  }, [query, onClose, onNavigateTab, onOpenNewMember, onOpenNewPayment]);

  // Combined List for keyboard index navigation
  const allItems = useMemo(() => {
    return [
      ...matchingMembers.map(m => ({ type: 'member' as const, data: m })),
      ...quickActions.map(a => ({ type: 'action' as const, data: a }))
    ];
  }, [matchingMembers, quickActions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = allItems[selectedIndex];
      if (!current) return;
      if (current.type === 'action') {
        current.data.action();
      } else if (current.type === 'member') {
        onClose();
        onNavigateTab('members');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/90 sticky top-0 z-10">
          <div className="w-9 h-9 rounded-xl bg-orange-400/10 border border-orange-400/20 flex items-center justify-center text-orange-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search member by name, phone, code or jump to any module..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base font-sans-body focus:outline-none"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-[10px] text-zinc-400 font-mono">
            <span>ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto divide-y divide-zinc-800/60 p-2 font-sans-body">
          {/* Matching Members Section */}
          {matchingMembers.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Members ({matchingMembers.length})</span>
                <span className="text-[10px] text-zinc-500 font-normal">Click or Enter to select</span>
              </div>

              <div className="space-y-1 mt-1">
                {matchingMembers.map((m, idx) => {
                  const isSelected = selectedIndex === idx;
                  const hasDues = (m.pendingAmount || 0) > 0;
                  const isExpired = m.status === 'expired';
                  const isExpiring = m.status === 'expiring_soon';

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        onClose();
                        onNavigateTab('members');
                      }}
                      className={`p-3 rounded-xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-zinc-800 border border-orange-400/40 shadow-sm'
                          : 'hover:bg-zinc-800/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 text-orange-400 font-extrabold flex items-center justify-center shrink-0 text-xs font-mono">
                          {m.fullName
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map(w => w[0])
                            .join('')
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm truncate">{m.fullName}</span>
                            <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 font-mono text-[10px] border border-zinc-800">
                              {m.memberCode}
                            </span>
                            {hasDues && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px]">
                                Due ₹{m.pendingAmount.toLocaleString('en-IN')}
                              </span>
                            )}
                            {isExpiring && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px]">
                                Expiring {m.expiryDate}
                              </span>
                            )}
                            {isExpired && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px]">
                                Expired
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                            <span className="truncate">{m.packageName}</span>
                            <span>•</span>
                            <span className="font-mono">{m.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Fast Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onClose();
                            onNavigateTab('payments');
                            onOpenNewPayment?.(m);
                          }}
                          className="px-2.5 py-1.5 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 border border-orange-400/30 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          title="Record Payment / Settle Balance"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay</span>
                        </button>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onClose();
                            onNavigateTab('members');
                            onOpenRenewMember?.(m);
                          }}
                          className="px-2.5 py-1.5 bg-sky-400/10 hover:bg-sky-400/20 text-sky-300 border border-sky-400/30 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          title="Renew Package"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Renew</span>
                        </button>

                        <a
                          href={`tel:${m.phone || m.whatsapp}`}
                          onClick={e => e.stopPropagation()}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-lg text-xs transition inline-flex items-center justify-center"
                          title="Call Member"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Commands & Navigation */}
          <div className="py-2">
            <div className="px-3 py-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <span>Quick Navigation & Actions</span>
            </div>

            <div className="space-y-1 mt-1">
              {quickActions.map((action, aIdx) => {
                const globalIdx = matchingMembers.length + aIdx;
                const isSelected = selectedIndex === globalIdx;
                const Icon = action.icon;

                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={`w-full p-3 rounded-xl transition flex items-center justify-between text-left ${
                      isSelected
                        ? 'bg-zinc-800 border border-orange-400/40'
                        : 'hover:bg-zinc-800/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${action.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{action.title}</p>
                        <span className="text-[11px] text-zinc-400">{action.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                        {action.shortcut}
                      </span>
                      <CornerDownLeft className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {allItems.length === 0 && (
            <div className="py-12 text-center text-zinc-400 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-zinc-600" />
              <p className="text-sm font-semibold text-zinc-300">No matching members or commands found</p>
              <p className="text-xs text-zinc-500">Try searching by phone number digits or full name.</p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between px-4 font-mono">
          <div className="flex items-center gap-3">
            <span><strong className="text-zinc-200">↑↓</strong> Navigate</span>
            <span><strong className="text-zinc-200">Enter</strong> Select</span>
            <span><strong className="text-zinc-200">ESC</strong> Close</span>
          </div>
          <span className="text-orange-400 font-bold">Fast Search</span>
        </div>
      </div>
    </div>
  );
};
