import React, { useState } from 'react';
import { Member, MemberMedicalRecord } from '../../../types';
import { useGym } from '../../../context/GymContext';
import {
  HeartPulse,
  AlertTriangle,
  Shield,
  Edit2,
  PhoneCall,
  Activity,
  FileCheck
} from 'lucide-react';

interface MedicalTabProps {
  member: Member;
  onOpenModal: (type: any, data?: any) => void;
}

export const MedicalTab: React.FC<MedicalTabProps> = ({ member, onOpenModal }) => {
  const medical: MemberMedicalRecord = member.medicalHistory || {
    bloodGroup: member.bloodGroup || 'O+ Positive',
    injuries: 'Past minor ACL strain (Right knee, 2024). Avoid heavy jumping squats.',
    allergies: 'Lactose intolerant, mild dust allergy',
    restrictions: 'Keep rest intervals > 90s on high heart-rate exercises. No heavy overhead kettlebell snatch.',
    notes: 'Member is cleared for general resistance training. Advised to warm up thoroughly for 10 minutes prior to lifting.',
    emergencyDoctor: 'Dr. Ramesh Rao (Columbia Asia Mysuru)',
    doctorPhone: '+91 98450 12345'
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <span>Confidential Medical & Health Records</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Physical assessments, restrictions, injuries, and emergency medical directives
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Authorized Staff Only</span>
          </div>

          <button
            onClick={() => onOpenModal('edit_medical', medical)}
            className="py-1.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Medical Info</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blood Group & Key Vitals */}
        <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-500" />
              <span>Body Composition & Health Metrics</span>
            </span>
            <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              {medical.bloodGroup || member.bloodGroup || 'O+'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 block font-sans">Height</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{member.heightCm ? `${member.heightCm} cm` : '176 cm'}</span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 block font-sans">Weight</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{member.weightKg ? `${member.weightKg} kg` : '74 kg'}</span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 block font-sans">Est. BMI</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{member.bmi || '23.8'}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Emergency Physician</span>
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
              {medical.emergencyDoctor} ({medical.doctorPhone})
            </p>
          </div>
        </div>

        {/* Injuries & Warnings */}
        <div className="bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs border-b border-rose-200 dark:border-rose-900/40 pb-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Injuries & Structural Precautions</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 block">Known Injuries / Surgeries</span>
            <p className="text-xs text-zinc-800 dark:text-zinc-200 mt-1 leading-relaxed">
              {medical.injuries || 'None reported during onboarding.'}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 block">Allergies</span>
            <p className="text-xs text-zinc-800 dark:text-zinc-200 mt-1 leading-relaxed">
              {medical.allergies || 'No known allergies reported.'}
            </p>
          </div>
        </div>
      </div>

      {/* Restrictions & Notes Full Width Card */}
      <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2">
        <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-orange-500" />
          <span>Exercise Restrictions & Trainer Directives</span>
        </span>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {medical.restrictions}
        </p>

        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 mt-2">
          <span className="text-[10px] font-bold uppercase text-zinc-400 block">Medical History Notes</span>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 italic">
            "{medical.notes}"
          </p>
        </div>
      </div>
    </div>
  );
};
