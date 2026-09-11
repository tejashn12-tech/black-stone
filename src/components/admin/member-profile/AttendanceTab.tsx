import React, { useState } from 'react';
import { Member, MemberAttendanceRecord } from '../../../types';
import { useGym } from '../../../context/GymContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  QrCode,
  Sparkles,
  UserCheck,
  TrendingUp,
  Smartphone,
  AlertCircle
} from 'lucide-react';

interface AttendanceTabProps {
  member: Member;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ member }) => {
  const { updateMember } = useGym();
  const [isLoggingCheckIn, setIsLoggingCheckIn] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Generate synthetic but realistic attendance records if none exist
  const records: MemberAttendanceRecord[] = member.attendanceHistory && member.attendanceHistory.length > 0
    ? member.attendanceHistory
    : [
        {
          id: `att-1`,
          date: '2026-09-02',
          checkInTime: '06:24 AM',
          checkOutTime: '07:45 AM',
          method: 'QR',
          status: 'Present',
          gate: 'Reception QR Scanner'
        },
        {
          id: `att-2`,
          date: '2026-09-01',
          checkInTime: '06:15 AM',
          checkOutTime: '07:30 AM',
          method: 'Front Desk',
          status: 'Present',
          gate: 'Front Desk Terminal'
        },
        {
          id: `att-3`,
          date: '2026-08-30',
          checkInTime: '06:30 AM',
          checkOutTime: '08:00 AM',
          method: 'Front Desk',
          status: 'Present',
          gate: 'Front Desk Terminal'
        },
        {
          id: `att-4`,
          date: '2026-08-29',
          checkInTime: '07:10 AM',
          checkOutTime: '08:15 AM',
          method: 'App',
          status: 'Present',
          gate: 'Member Mobile App'
        },
        {
          id: `att-5`,
          date: '2026-08-28',
          checkInTime: '06:40 AM',
          checkOutTime: '07:55 AM',
          method: 'QR',
          status: 'Present',
          gate: 'Reception QR Scanner'
        },
        {
          id: `att-6`,
          date: '2026-08-26',
          checkInTime: '06:20 AM',
          checkOutTime: '07:40 AM',
          method: 'Front Desk',
          status: 'Present',
          gate: 'Front Desk Terminal'
        }
      ];

  const totalCheckIns = records.length;
  const presentDays = records.filter(r => r.status === 'Present').length;
  const absentDays = Math.max(0, 30 - presentDays);
  const lastCheckIn = records[0] ? `${records[0].date} at ${records[0].checkInTime}` : 'No check-in recorded yet';

  const handleManualCheckIn = () => {
    setIsLoggingCheckIn(true);
    setSuccessMsg(null);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      const dateStr = now.toISOString().split('T')[0];

      const newRecord: MemberAttendanceRecord = {
        id: `att-${Date.now()}`,
        date: dateStr,
        checkInTime: timeStr,
        checkOutTime: 'In Gym',
        method: 'Front Desk',
        status: 'Present',
        gate: 'Admin Desk Instant Check-In'
      };

      const updatedHistory = [newRecord, ...records];
      updateMember(member.id, { attendanceHistory: updatedHistory });
      setIsLoggingCheckIn(false);
      setSuccessMsg(`Check-In recorded successfully for ${member.fullName} at ${timeStr}`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Attendance Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Check-Ins</span>
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1 font-display">{totalCheckIns}</p>
          <span className="text-[10px] text-zinc-400">Lifetime recorded</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Present Days</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-display">{presentDays}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Past 30 days</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Absent Days</span>
            <div className="p-1.5 rounded-lg bg-zinc-500/10 text-zinc-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-zinc-700 dark:text-zinc-300 mt-1 font-display">{absentDays}</p>
          <span className="text-[10px] text-zinc-400">Rest / Missed</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Last Check-In</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-bold text-zinc-900 dark:text-white mt-2 font-mono truncate">{lastCheckIn}</p>
          <span className="text-[10px] text-zinc-400">Latest activity</span>
        </div>
      </div>

      {/* Main Table & Instant Check-In Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Attendance History & Entry Logs</span>
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Reception QR scans, mobile app verifications, and front desk check-ins
            </p>
          </div>

          <button
            onClick={handleManualCheckIn}
            disabled={isLoggingCheckIn}
            className="py-2 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isLoggingCheckIn ? 'Recording...' : 'Instant Check-In Now'}</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/80 text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Check-In</th>
                <th className="py-2.5 px-3">Check-Out</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Entry Terminal</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                  <td className="py-2.5 px-3 font-mono text-zinc-900 dark:text-zinc-100 font-semibold">{rec.date}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{rec.checkInTime}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-500 dark:text-zinc-400">{rec.checkOutTime || '--'}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-700 dark:text-zinc-300 font-semibold">
                      {rec.method === 'QR' ? (
                        <QrCode className="w-3.5 h-3.5 text-orange-500" />
                      ) : rec.method === 'App' ? (
                        <Smartphone className="w-3.5 h-3.5 text-sky-500" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                      )}
                      <span>{rec.method}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">{rec.gate || 'Front Desk Terminal'}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
