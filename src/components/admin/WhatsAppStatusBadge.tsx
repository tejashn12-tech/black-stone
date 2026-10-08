import React from 'react';
import {
  Clock,
  RefreshCw,
  Check,
  CheckCheck,
  AlertCircle,
  Volume2
} from 'lucide-react';

export interface WhatsAppStatusBadgeProps {
  status: string;
  statusDisplay?: string;
  compact?: boolean;
  showExplanation?: boolean;
  className?: string;
}

export const WhatsAppStatusBadge: React.FC<WhatsAppStatusBadgeProps> = ({
  status,
  statusDisplay,
  compact = false,
  showExplanation = false,
  className = ''
}) => {
  const normStatus = (status || '').toUpperCase().trim();

  // Match canonical states
  if (normStatus === 'PENDING' || normStatus === 'QUEUED') {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{statusDisplay || (normStatus === 'PENDING' ? 'Pending' : 'Queued')}</span>
        </span>
        {showExplanation && (
          <span className="text-[10px] text-zinc-400 mt-1">Awaiting local socket transmission</span>
        )}
      </div>
    );
  }

  if (normStatus === 'SENDING') {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
          <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
          <span>{statusDisplay || 'Sending to WhatsApp...'}</span>
        </span>
        {showExplanation && (
          <span className="text-[10px] text-zinc-400 mt-1">Transmitting payload through socket</span>
        )}
      </div>
    );
  }

  if (normStatus === 'SENT') {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-200 border border-zinc-600">
          <Check className="w-3.5 h-3.5 text-zinc-400" />
          <span>{compact ? 'Accepted (Sent)' : (statusDisplay || 'Accepted by WhatsApp Connection')}</span>
        </span>
        {showExplanation && (
          <span className="text-[10px] text-zinc-400 mt-1">
            Accepted by WhatsApp connection stream (awaiting recipient device delivery)
          </span>
        )}
      </div>
    );
  }

  if (normStatus === 'SERVER_ACK' || normStatus === 'SERVER ACK') {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-600">
          <Check className="w-3.5 h-3.5 text-slate-300" />
          <span>{statusDisplay || 'Server Acknowledged'}</span>
        </span>
        {showExplanation && (
          <span className="text-[10px] text-zinc-400 mt-1">Single tick: WhatsApp servers received message</span>
        )}
      </div>
    );
  }

  if (normStatus === 'DELIVERED') {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{compact ? 'Delivered' : (statusDisplay || 'Delivered to Recipient')}</span>
        </span>
        {showExplanation && (
          <span className="text-[10px] text-emerald-400/80 mt-1">Double ticks: Confirmed received on recipient device</span>
        )}
      </div>
    );
  }

  if (normStatus === 'READ') {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>{compact ? 'Read' : (statusDisplay || 'Read by Recipient')}</span>
        </span>
        {showExplanation && (
          <span className="text-[10px] text-cyan-400/80 mt-1">Blue ticks: Recipient opened and viewed message</span>
        )}
      </div>
    );
  }

  if (normStatus === 'PLAYED') {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          <Volume2 className="w-3.5 h-3.5 text-purple-400" />
          <span>{statusDisplay || 'Played'}</span>
        </span>
      </div>
    );
  }

  if (normStatus === 'FAILED') {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-300 border border-red-500/30">
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          <span>{statusDisplay || 'Failed'}</span>
        </span>
      </div>
    );
  }

  // Fallback for legacy values
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
      <span>{status || 'Unknown'}</span>
    </span>
  );
};
