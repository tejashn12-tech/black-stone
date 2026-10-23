import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Search,
  Filter,
  Send,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Users,
  Edit3,
  Save,
  RotateCcw,
  Zap,
  Phone,
  Clock,
  Check,
  Shield,
  Flame,
  Sun,
  Moon,
  Heart,
  Award,
  Crown,
  Trophy,
  Gift,
  Flag,
  Loader2
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { FestivalEvent } from '../../types';
import confetti from 'canvas-confetti';

interface IndianFestivalsWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedFestivalId?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Festival': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Cultural': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  'National Day': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Special Occasion': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' }
};

export const IndianFestivalsWishModal: React.FC<IndianFestivalsWishModalProps> = ({
  isOpen,
  onClose,
  initialSelectedFestivalId
}) => {
  const {
    festivals,
    members,
    settings,
    toggleFestival,
    updateFestivalTemplate,
    sendFestivalWishesToAll,
    testWhatsAppAutomation,
    whatsAppSession
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [editingFestivalId, setEditingFestivalId] = useState<string | null>(null);
  const [editTemplateText, setEditTemplateText] = useState('');
  const [activeFestivalId, setActiveFestivalId] = useState<string>(
    initialSelectedFestivalId || festivals[0]?.id || ''
  );
  const [isSendingToAll, setIsSendingToAll] = useState(false);
  const [sendResultNotice, setSendResultNotice] = useState<{
    type: 'success' | 'error';
    message: string;
    sent?: number;
    duplicate?: number;
    failed?: number;
  } | null>(null);

  const [testPhone, setTestPhone] = useState(settings.whatsapp || settings.phone || '');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  // Compute Today in MMDD
  const todayMMDD = useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${mm}-${dd}`;
  }, []);

  const activeMembers = useMemo(() => {
    return members.filter(
      m =>
        (m.status as string) !== 'inactive' &&
        m.automationOverrides?.festivalGreetings !== false &&
        (m.whatsapp || m.phone)
    );
  }, [members]);

  const filteredFestivals = useMemo(() => {
    return festivals.filter(f => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.dateString.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.messageTemplate.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === 'all' || f.category === selectedCategory;

      // Month
      const matchesMonth =
        selectedMonth === 'all' ||
        (f.monthDay && f.monthDay.startsWith(`${selectedMonth}-`));

      return matchesSearch && matchesCategory && matchesMonth;
    });
  }, [festivals, searchQuery, selectedCategory, selectedMonth]);

  const selectedFestival = useMemo(() => {
    return festivals.find(f => f.id === activeFestivalId) || filteredFestivals[0] || festivals[0];
  }, [festivals, activeFestivalId, filteredFestivals]);

  if (!isOpen) return null;

  const handleStartEdit = (f: FestivalEvent) => {
    setEditingFestivalId(f.id);
    setEditTemplateText(f.messageTemplate);
  };

  const handleSaveEdit = (id: string) => {
    if (editTemplateText.trim()) {
      updateFestivalTemplate(id, editTemplateText.trim());
    }
    setEditingFestivalId(null);
  };

  const handleSendToAllNow = async (festival: FestivalEvent) => {
    if (!whatsAppSession.status || whatsAppSession.status === 'disconnected') {
      setSendResultNotice({
        type: 'error',
        message: 'WhatsApp Gateway is currently disconnected. Please connect WhatsApp in Settings/Gateway to broadcast live messages!'
      });
      return;
    }

    const confirmMsg = `Send "${festival.name}" festive wish to all ${activeMembers.length} active gym members? Messages will be sent personalized with member names and duplicate protection.`;
    if (!window.confirm(confirmMsg)) return;

    setIsSendingToAll(true);
    setSendResultNotice(null);

    try {
      const res = await sendFestivalWishesToAll(festival.id);
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setSendResultNotice({
          type: 'success',
          message: `Festive wishes for ${festival.name} successfully dispatched to all members!`,
          sent: res.sent,
          duplicate: res.duplicate,
          failed: res.failed
        });
      } else {
        setSendResultNotice({
          type: 'error',
          message: res.error || 'Failed to dispatch festive wishes to members.'
        });
      }
    } catch (err: any) {
      setSendResultNotice({
        type: 'error',
        message: err?.message || 'Error occurred while sending festive wishes.'
      });
    } finally {
      setIsSendingToAll(false);
    }
  };

  const handleSendTest = async (festival: FestivalEvent) => {
    if (!testPhone || testPhone.length < 10) {
      setTestFeedback('Please enter a valid 10-digit mobile number for test');
      setTimeout(() => setTestFeedback(null), 4000);
      return;
    }

    setIsSendingTest(true);
    setTestFeedback(null);

    try {
      const sampleMsg = festival.messageTemplate
        .replace(/{MEMBER_NAME}/gi, 'Rahul Sharma (Test Member)')
        .replace(/{GYM_NAME}/gi, settings.gymName || 'Black Stone Fitness')
        .replace(/{FESTIVAL_NAME}/gi, festival.name);

      const res = await testWhatsAppAutomation({
        testPhone,
        templateType: 'festival',
        memberName: 'Rahul Sharma',
        customMessage: sampleMsg
      });

      if (res.success) {
        setTestFeedback('Test festive greeting dispatched to ' + testPhone + ' successfully!');
      } else {
        setTestFeedback('Notice: ' + (res.error || 'Test message queued'));
      }
    } catch (err: any) {
      setTestFeedback('Error: ' + (err?.message || 'Failed to dispatch test'));
    } finally {
      setIsSendingTest(false);
      setTimeout(() => setTestFeedback(null), 6000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0 border border-amber-500/30 shadow-inner">
              🪔
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-black text-white tracking-wide">
                  Indian Festivals Automated Wish Center
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Auto-Wish Active For Everyone Without Fail
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automatically dispatches festive greetings in Kannada &amp; English to all members on every Indian festival.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Feedback Banner */}
        {sendResultNotice && (
          <div className={`px-5 py-3 text-xs flex items-center justify-between border-b ${
            sendResultNotice.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              {sendResultNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{sendResultNotice.message}</span>
              {sendResultNotice.sent !== undefined && (
                <span className="font-mono text-[11px] ml-2 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200">
                  Sent: {sendResultNotice.sent} | Skipped/Duplicate: {sendResultNotice.duplicate} | Failed: {sendResultNotice.failed}
                </span>
              )}
            </div>
            <button
              onClick={() => setSendResultNotice(null)}
              className="text-xs underline hover:no-underline font-semibold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Body: Two Columns (Left list of festivals, Right preview & broadcast actions) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Festival List & Search */}
          <div className="w-full md:w-1/2 border-r border-zinc-800/80 flex flex-col overflow-hidden bg-zinc-950/30">
            
            {/* Filters Bar */}
            <div className="p-3 border-b border-zinc-800/80 space-y-2 bg-zinc-900/60">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search festival (e.g. Deepavali, Sankranti, Dasara, Holi)..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                {['all', 'Festival', 'Cultural', 'National Day', 'Special Occasion'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat === 'all' ? 'All (35+)' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Festivals */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredFestivals.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No Indian festivals matching "{searchQuery}".
                </div>
              ) : (
                filteredFestivals.map((fest) => {
                  const isSelected = fest.id === selectedFestival?.id;
                  const isToday = fest.monthDay === todayMMDD;
                  const catStyle = CATEGORY_COLORS[fest.category] || CATEGORY_COLORS['Festival'];

                  return (
                    <div
                      key={fest.id}
                      onClick={() => setActiveFestivalId(fest.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer text-left ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                          : isToday
                          ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                          : 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-white truncate">
                              {fest.name}
                            </span>
                            {isToday && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider bg-red-500 text-white animate-pulse">
                                TODAY!
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <span className="font-mono text-amber-300 font-semibold flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-400" />
                              {fest.dateString}
                            </span>
                            <span>•</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                              {fest.category}
                            </span>
                          </div>
                        </div>

                        {/* Enable / Disable Auto-Wish Toggle */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFestival(fest.id);
                          }}
                          title={fest.enabled ? "Auto-Wish Active: Click to pause" : "Auto-Wish Paused: Click to activate"}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border cursor-pointer transition shrink-0 ${
                            fest.enabled
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'
                          }`}
                        >
                          {fest.enabled ? 'Auto-Active' : 'Paused'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Festival Detail, Template Editor & Broadcast Actions */}
          <div className="w-full md:w-1/2 flex flex-col overflow-y-auto bg-zinc-900/40 p-5 space-y-5">
            {selectedFestival ? (
              <>
                {/* Festival Hero Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-zinc-900 border border-amber-500/30 shadow-lg space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                          {selectedFestival.category}
                        </span>
                        {selectedFestival.monthDay === todayMMDD && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-red-500 text-white animate-pulse">
                            TODAY'S CELEBRATION
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Dispatches to All Members
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white mt-1.5">
                        {selectedFestival.name}
                      </h3>
                      <p className="text-xs text-amber-300/90 font-mono font-medium flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Annual Date: {selectedFestival.dateString}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => toggleFestival(selectedFestival.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        selectedFestival.enabled
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                      }`}
                    >
                      {selectedFestival.enabled ? '✓ Auto-Wish ON' : '✕ Auto-Wish OFF'}
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-300 leading-relaxed border-t border-amber-500/20 pt-2.5">
                    When this festival arrives, the 24/7 background automation service checks Asia/Kolkata date and delivers this wish message to all <strong>{activeMembers.length} active members</strong> without fail.
                  </p>
                </div>

                {/* Message Template Editor / Preview */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        WhatsApp Message Template
                      </span>
                    </div>
                    {editingFestivalId === selectedFestival.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingFestivalId(null)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(selectedFestival.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save Template</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(selectedFestival)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3 h-3 text-orange-400" />
                        <span>Edit Template</span>
                      </button>
                    )}
                  </div>

                  {editingFestivalId === selectedFestival.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editTemplateText}
                        onChange={(e) => setEditTemplateText(e.target.value)}
                        rows={4}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-zinc-100 font-sans focus:outline-none focus:border-orange-500"
                        placeholder="Write festive message..."
                      />
                      <p className="text-[10px] text-zinc-400">
                        Dynamic Tokens: <code className="text-orange-400">{"{MEMBER_NAME}"}</code> (Member's full name), <code className="text-orange-400">{"{GYM_NAME}"}</code> (Black Stone Fitness).
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 font-sans leading-relaxed whitespace-pre-wrap">
                      {selectedFestival.messageTemplate}
                    </div>
                  )}

                  {/* Personalized Preview */}
                  <div className="pt-2 border-t border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                      Personalized Preview on Recipient Phone:
                    </span>
                    <div className="mt-1.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-100 whitespace-pre-wrap leading-relaxed font-sans">
                      {selectedFestival.messageTemplate
                        .replace(/{MEMBER_NAME}/gi, 'Rahul Sharma')
                        .replace(/{GYM_NAME}/gi, settings.gymName || 'Black Stone Fitness')
                        .replace(/{FESTIVAL_NAME}/gi, selectedFestival.name)}
                    </div>
                  </div>
                </div>

                {/* Instant Actions: Broadcast to All or Test */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Manual Instant Dispatch
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      Target: <strong className="text-white">{activeMembers.length} active members</strong>
                    </span>
                  </div>

                  {/* Broadcast to All Button */}
                  <button
                    disabled={isSendingToAll}
                    onClick={() => handleSendToAllNow(selectedFestival)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs tracking-wide uppercase shadow-lg shadow-amber-500/20 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSendingToAll ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Sending Festive Wish to Everyone...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Festive Wish to Everyone Now ({activeMembers.length} Members)</span>
                      </>
                    )}
                  </button>

                  {/* Send Test to Phone */}
                  <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                    <span className="text-[11px] text-zinc-400 font-semibold block">
                      Send Test Festive Wish to My Number First:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={testPhone}
                          onChange={(e) => setTestPhone(e.target.value)}
                          placeholder="Admin Phone (e.g. 9876543210)"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <button
                        disabled={isSendingTest}
                        onClick={() => handleSendTest(selectedFestival)}
                        className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 shrink-0 border border-zinc-700"
                      >
                        {isSendingTest ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                        ) : (
                          <Send className="w-3.5 h-3.5 text-orange-400" />
                        )}
                        <span>Send Test</span>
                      </button>
                    </div>
                    {testFeedback && (
                      <p className="text-[11px] text-emerald-400 font-medium">
                        {testFeedback}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-zinc-500 text-xs">
                Select a festival from the list to preview message and broadcast.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
