
import React from 'react';
import { 
  Gavel, 
  FileText, 
  Users, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ShieldCheck,
  LayoutDashboard,
  FileCheck,
  History,
  Bell,
  FolderOpen
} from 'lucide-react';

export const CASE_TYPE_LABELS: Record<string, string> = {
  MONEY_RECOVERY: 'Money Recovery',
  DAMAGES_RECOVERY: 'Damages Recovery',
  APPEAL: 'Appeal',
  LAND_CASE: 'Land Case',
  CRIMINAL_CASE: 'Criminal Case',
  DISCIPLINARY: 'Inquiry / Disciplinary',
  OTHER: 'Other Court / Legal Matters'
};

export const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  ON_HOLD: 'bg-amber-100 text-amber-700',
  CLOSED: 'bg-slate-100 text-slate-700',
  CORRECTION_REQUIRED: 'bg-red-100 text-red-700',
  DRAFT: 'bg-slate-100 text-slate-700',
  PENDING_REVIEW: 'bg-indigo-100 text-indigo-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  EXECUTED: 'bg-purple-100 text-purple-700',
  REJECTED: 'bg-red-100 text-red-700',
  ARCHIVED: 'bg-gray-100 text-gray-700'
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'cases', label: 'Legal Cases', icon: <Gavel size={20} /> },
  { id: 'agreements', label: 'Agreements', icon: <FileCheck size={20} /> },
  { id: 'documents', label: 'Document Vault', icon: <FolderOpen size={20} /> }, // Added global document view
  { id: 'audit', label: 'Audit Trail', icon: <History size={20} /> },
  { id: 'settings', label: 'Settings', icon: <ShieldCheck size={20} /> },
];
