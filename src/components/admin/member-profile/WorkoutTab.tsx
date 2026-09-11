import React, { useState } from 'react';
import { Member, MemberWorkoutPlan } from '../../../types';
import { useGym } from '../../../context/GymContext';
import {
  Dumbbell,
  Edit2,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
  User,
  Plus,
  Trash2
} from 'lucide-react';

interface WorkoutTabProps {
  member: Member;
  onOpenModal: (type: any, data?: any) => void;
}

export const WorkoutTab: React.FC<WorkoutTabProps> = ({ member, onOpenModal }) => {
  const { getTrainerById } = useGym();
  const assignedTrainer = member.assignedTrainerId ? getTrainerById(member.assignedTrainerId) : null;

  // Default workout plan if none specified
  const workoutPlan: MemberWorkoutPlan = member.workoutPlan || {
    planName: 'Hypertrophy & Functional Strength Split',
    goal: 'Muscle Growth & Body Recomposition',
    level: 'Intermediate',
    assignedTrainerName: assignedTrainer?.name || 'Coach Vikram Shetty',
    lastUpdated: '2026-08-15',
    notes: 'Focus on progressive overload, 2-3 mins rest on compound lifts. Stay hydrated with 3.5L water daily.',
    schedule: [
      {
        day: 'Monday',
        focus: 'Chest & Triceps (Push Heavy)',
        exercises: ['Barbell Bench Press (4x8-10)', 'Incline Dumbbell Press (3x10-12)', 'Cable Chest Flyes (3x15)', 'Tricep Rope Pushdowns (4x12)']
      },
      {
        day: 'Tuesday',
        focus: 'Back & Biceps (Pull Heavy)',
        exercises: ['Conventional Deadlifts (4x6)', 'Lat Pulldowns (4x10-12)', 'Seated Cable Rows (3x12)', 'Barbell Bicep Curls (4x10)']
      },
      {
        day: 'Wednesday',
        focus: 'Legs & Core (Lower Focus)',
        exercises: ['Barbell Back Squats (4x8)', 'Leg Press (4x12)', 'Romanian Deadlifts (3x10)', 'Hanging Leg Raises (3x15)']
      },
      {
        day: 'Thursday',
        focus: 'Active Rest / Mobility & Core',
        exercises: ['Treadmill Incline Walk (30 mins)', 'Dynamic Hip & Shoulder Mobility (15 mins)', 'Plank Variations (3x60s)']
      },
      {
        day: 'Friday',
        focus: 'Shoulders & Arms Hypertrophy',
        exercises: ['Overhead Dumbbell Press (4x10)', 'Lateral Raises (4x15)', 'Face Pulls (3x15)', 'Hammer Curls + Skullcrushers Superset (3x12)']
      },
      {
        day: 'Saturday',
        focus: 'Full Body Conditioning & HIIT',
        exercises: ['Kettlebell Swings (4x20)', 'Battle Ropes (4x30s)', 'Box Jumps (3x12)', 'Assault Bike Sprints (5 rounds)']
      }
    ]
  };

  return (
    <div className="space-y-4">
      {/* Top Workout Plan Summary Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                {workoutPlan.planName}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Target Goal: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{workoutPlan.goal}</span> • Level: <span className="text-orange-500 font-bold">{workoutPlan.level}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenModal('edit_workout', workoutPlan)}
            className="py-2 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Update Workout Plan</span>
          </button>
        </div>

        {/* Assigned Trainer & Notes Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 dark:bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Personal Trainer In-Charge</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {member.assignedTrainerName || workoutPlan.assignedTrainerName || 'General Fitness Coach'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Trainer's Prescription & Notes</span>
            <p className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed line-clamp-2">
              {workoutPlan.notes}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>Weekly Training Routine</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {workoutPlan.schedule.map((dayPlan, idx) => (
            <div
              key={idx}
              className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span className="font-bold text-xs text-orange-600 dark:text-orange-400 uppercase font-mono">
                  {dayPlan.day}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {dayPlan.focus.split('(')[0]}
                </span>
              </div>

              <ul className="space-y-1.5 text-xs">
                {dayPlan.exercises.map((ex, exIdx) => (
                  <li key={exIdx} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
