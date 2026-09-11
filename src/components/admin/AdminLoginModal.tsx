import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { BSFLogo } from '../common/BSFLogo';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { loginAsAdmin } = useGym();
  const [passcode, setPasscode] = useState('123456');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsAdmin(passcode)) {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('Invalid Admin Security Key. (Default Passcode: 123456)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white text-lg w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <BSFLogo size="md" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-400/10 border border-orange-400/30 text-orange-400 text-[11px] font-black uppercase font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>STAFF & OWNER SECURE PORTAL</span>
          </div>
          <h2 className="text-2xl font-black text-white font-display tracking-wide">
            GYM MANAGEMENT ACCESS
          </h2>
          <p className="text-xs text-zinc-400 font-sans-body">
            Enter administrative authorization key to open member records, fee invoicing, and WhatsApp automations.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-body">
          <div>
            <label className="block font-bold text-zinc-300 uppercase mb-1">
              Admin Master Key
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none font-mono"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Access Passcode: <span className="text-orange-400 font-bold font-mono">123456</span>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider shadow-lg shadow-orange-400/20 flex items-center justify-center gap-2"
          >
            <span>Authenticate & Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
