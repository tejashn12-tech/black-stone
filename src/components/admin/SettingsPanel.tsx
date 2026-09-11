import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Settings,
  Building,
  CreditCard,
  Save,
  CheckCircle2,
  Database,
  RefreshCw,
  Server,
  Trash2,
  AlertTriangle,
  Smartphone,
  ChevronRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface SettingsPanelProps {
  initialSubTab?: 'general' | 'database';
  onNavigateTab?: (tab: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  initialSubTab = 'general',
  onNavigateTab
}) => {
  const { 
    settings, 
    updateSettings, 
    isFirebaseConnected, 
    firestoreSynced, 
    clearAllGymData, 
    clearTrainersPlansAndUpi,
    members, 
    packages,
    trainers,
    payments, 
    enquiries 
  } = useGym();

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'database'>(initialSubTab);
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearTrainersPlansConfirm, setShowClearTrainersPlansConfirm] = useState(false);
  const [dataClearedSuccess, setDataClearedSuccess] = useState(false);
  const [trainersPlansClearedSuccess, setTrainersPlansClearedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleManualResync = () => {
    setIsResyncing(true);
    setTimeout(() => {
      setIsResyncing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 800);
  };

  const handleClearAllData = async () => {
    try {
      setIsClearingData(true);
      await clearAllGymData();
      setShowClearConfirm(false);
      setDataClearedSuccess(true);
      setTimeout(() => setDataClearedSuccess(false), 4000);
    } catch (err) {
      console.error('Error clearing data:', err);
    } finally {
      setIsClearingData(false);
    }
  };

  const handleClearTrainersPlansAndUpi = async () => {
    try {
      setIsClearingData(true);
      await clearTrainersPlansAndUpi();
      setFormData(prev => ({ ...prev, upiId: '' }));
      setShowClearTrainersPlansConfirm(false);
      setTrainersPlansClearedSuccess(true);
      setTimeout(() => setTrainersPlansClearedSuccess(false), 4000);
    } catch (err) {
      console.error('Error clearing trainers, plans and UPI:', err);
    } finally {
      setIsClearingData(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl" id="bsf-admin-settings-panel">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-display tracking-wide flex items-center gap-2">
            <Settings className="w-6 h-6 text-orange-400" />
            CLUB SETTINGS & CONFIGURATION
          </h2>
          <p className="text-xs text-zinc-400 font-sans-body mt-0.5">
            Configure Black Stone Fitness business profile, UPI payments, and cloud storage database.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Settings Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSubTab === 'general'
              ? 'bg-orange-400 text-black shadow-md shadow-orange-950/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>General & UPI</span>
        </button>

        <button
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeSubTab === 'database'
              ? 'bg-orange-400 text-black shadow-md shadow-orange-950/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Cloud Database & Maintenance</span>
        </button>
      </div>

      {/* Sub-Tab: General Settings */}
      {activeSubTab === 'general' && (
        <div className="space-y-6">

          {/* Cloud Database Integration Status */}
          <div className="p-6 bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/30 border border-amber-500/30 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Firebase Firestore Cloud Database</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[11px] font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {isFirebaseConnected && firestoreSynced ? 'Live Synced' : 'Connected'}
                </span>
              </div>
            </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800">
            <p className="text-zinc-500 text-[10px] uppercase font-bold">Database Provider</p>
            <p className="text-white font-mono font-bold mt-1 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-amber-400" />
              Google Cloud Firestore
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800">
            <p className="text-zinc-500 text-[10px] uppercase font-bold">Project & Database ID</p>
            <p className="text-white font-mono text-[11px] font-bold mt-1 truncate">
              silver-day-h5jvd
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-[10px] uppercase font-bold">Real-time Snapshots</p>
              <p className="text-emerald-400 font-mono font-bold mt-1 text-[11px]">
                Active Subscriptions
              </p>
            </div>
            <button
              type="button"
              onClick={handleManualResync}
              disabled={isResyncing}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition flex items-center gap-1 text-[10px] font-bold"
              title="Resync Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResyncing ? 'animate-spin text-orange-400' : ''}`} />
              <span>{isResyncing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Section 1: Business Profile */}
        <div className="p-6 bg-zinc-900/90 border border-zinc-800 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Building className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gym Identity & Contact Particulars</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">Gym Name</label>
              <input
                type="text"
                value={formData.gymName}
                onChange={e => setFormData({ ...formData, gymName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-zinc-400 uppercase mb-1">Premises Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">City / Pincode</label>
              <input
                type="text"
                value={`${formData.city} - ${formData.pincode}`}
                onChange={e => setFormData({ ...formData, city: 'Mysuru', pincode: '570020' })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">Front Desk Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">Official WhatsApp</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Financial & UPI */}
        <div className="p-6 bg-zinc-900/90 border border-zinc-800 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Billing & UPI Payment Gateways</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">Gym UPI VPA Address</label>
              <input
                type="text"
                value={formData.upiId}
                onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-orange-400 font-mono font-bold focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">GSTIN Number</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">Receipt Number Prefix</label>
              <input
                type="text"
                value={formData.receiptPrefix}
                onChange={e => setFormData({ ...formData, receiptPrefix: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: WhatsApp Templates */}
        <div className="p-6 bg-zinc-900/90 border border-zinc-800 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Automated WhatsApp Renewal Message Templates</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">
                7-Day Expiry Countdown Template <span className="text-zinc-500 font-mono">({'{MEMBER_NAME}'}, {'{EXPIRY_DATE}'})</span>
              </label>
              <textarea
                rows={3}
                value={formData.reminder7DayTemplate}
                onChange={e => setFormData({ ...formData, reminder7DayTemplate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none font-sans-body leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">
                3-Day Urgent Renewal Template
              </label>
              <textarea
                rows={3}
                value={formData.reminder3DayTemplate}
                onChange={e => setFormData({ ...formData, reminder3DayTemplate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none font-sans-body leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 uppercase mb-1">
                Member Birthday Greeting Template
              </label>
              <textarea
                rows={3}
                value={formData.birthdayTemplate}
                onChange={e => setFormData({ ...formData, birthdayTemplate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none font-sans-body leading-relaxed"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-sm uppercase tracking-wider rounded-2xl transition shadow-xl shadow-orange-400/20 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings & Automation Rules</span>
        </button>

      </form>
      </div>
      )}

      {/* Sub-Tab 3: Database Maintenance & Purge */}
      {(activeSubTab === 'database' || activeSubTab === 'general') && (
      <div className="p-6 bg-red-950/20 border border-red-900/40 rounded-3xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-red-900/30">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Database & Component Maintenance</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Wipe plans, trainers, UPI configurations, or wipe entire membership databases</p>
            </div>
          </div>
        </div>

        {trainersPlansClearedSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>All trainers, membership plans, and UPI details have been wiped successfully!</span>
          </div>
        )}

        {dataClearedSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>All members, payments, enquiries, and logs have been wiped successfully!</span>
          </div>
        )}

        {/* Row 1: Clear Trainers, Plans & UPI */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800">
          <div className="text-xs text-zinc-400">
            <p className="font-semibold text-zinc-200">Clear Trainers, Plans & UPI Details</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Current: <span className="text-white font-bold">{packages.length}</span> Plans | <span className="text-white font-bold">{trainers.length}</span> Trainers | UPI: <span className="text-orange-400 font-mono font-bold">{formData.upiId || 'Cleared / None'}</span>
            </p>
          </div>

          {!showClearTrainersPlansConfirm ? (
            <button
              type="button"
              onClick={() => setShowClearTrainersPlansConfirm(true)}
              className="px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Trainers, Plans & UPI</span>
            </button>
          ) : (
            <div className="p-3 bg-zinc-950 border border-amber-500/50 rounded-xl space-y-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Clear all trainers, plans, and UPI ID?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearTrainersPlansAndUpi}
                  disabled={isClearingData}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-lg"
                >
                  <span>{isClearingData ? 'Clearing...' : 'Confirm Clear'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearTrainersPlansConfirm(false)}
                  disabled={isClearingData}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Row 2: Wipe Entire Gym Data */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800">
          <div className="text-xs text-zinc-400">
            <p className="font-semibold text-zinc-200">Wipe Entire System Data</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Members: <span className="text-white font-bold">{members.length}</span> | Payments: <span className="text-white font-bold">{payments.length}</span> | Enquiries: <span className="text-white font-bold">{enquiries.length}</span>
            </p>
          </div>

          {!showClearConfirm ? (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          ) : (
            <div className="p-4 bg-zinc-950 border border-red-500/50 rounded-2xl space-y-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Are you sure? This will permanently delete all records!</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearAllData}
                  disabled={isClearingData}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-red-900/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isClearingData ? 'Clearing...' : 'Yes, Wipe Everything'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  disabled={isClearingData}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
