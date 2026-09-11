import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { BSFLogo } from '../common/BSFLogo';
import { X, Lock, Phone, UserCheck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MemberLoginModal: React.FC<MemberLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { members, loginAsMember } = useGym();
  const [inputVal, setInputVal] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setErrorMsg('Please enter your registered phone number or Member ID.');
      return;
    }

    const success = loginAsMember(inputVal);
    if (success) {
      setErrorMsg('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Member not found. Check phone number or use quick demo login below.');
    }
  };

  const handleQuickDemoLogin = (codeOrPhone: string) => {
    const success = loginAsMember(codeOrPhone);
    if (success) {
      setErrorMsg('');
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" id="member-login-modal">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <BSFLogo size="md" className="justify-center mb-1" />
          <h2 className="text-2xl font-black text-white font-display tracking-wide mt-2">
            MEMBER ACCESS PORTAL
          </h2>
          <p className="text-xs text-zinc-400 font-sans-body">
            View your active membership, receipts, trainer workouts, and renewal status.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Registered Phone / Member Code
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="e.g. 9845012345 or BSF-2026-101"
                value={inputVal}
                onChange={e => {
                  setInputVal(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-orange-400 focus:outline-none placeholder:text-zinc-600"
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-orange-400/20"
          >
            <span>Sign In to Member Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="mt-6 pt-5 border-t border-zinc-800 space-y-3">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-center">
            ⚡ Quick Demo Member Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            {members.slice(0, 4).map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleQuickDemoLogin(m.memberCode)}
                className="p-2.5 text-left rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-orange-400/50 hover:bg-zinc-800/40 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-orange-400 truncate block">
                    {m.fullName.split(' ')[0]}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-mono ${
                    m.status === 'active' ? 'text-emerald-400 bg-emerald-950' : 'text-orange-400 bg-orange-950'
                  }`}>
                    {m.status.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                  {m.memberCode}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
