import React from 'react';
import {
  Member,
  MemberSubscriptionItem,
  MemberAttendanceRecord,
  MemberWorkoutPlan,
  MemberMedicalRecord,
  MemberFollowUpLog,
  MemberChallengeRecord,
  PaymentRecord
} from '../../../types';

export type ProfileTab =
  | 'information'
  | 'subscriptions'
  | 'attendance'
  | 'workout'
  | 'followup'
  | 'medical'
  | 'payments'
  | 'communication'
  | 'automations';

export interface ProfileModalState {
  type:
    | null
    | 'edit_member'
    | 'freeze'
    | 'extend'
    | 'downgrade'
    | 'transfer'
    | 'upgrade'
    | 'combo'
    | 'assign_pt'
    | 'renew_pt'
    | 'log_pt_session'
    | 'free_trial'
    | 'add_subscription'
    | 'renew_subscription'
    | 'add_payment'
    | 'edit_workout'
    | 'edit_medical'
    | 'add_followup'
    | 'send_notification'
    | 'view_challenges'
    | 'receipt_view';
  data?: any;
}
