
import React from 'react';
import { 
  TrendingUp, 
  Map, 
  History, 
  ArrowUpRight, 
  ShieldAlert, 
  Users,
  DollarSign
} from 'lucide-react';
import { CaseType, LegalCase } from '../types';

interface CaseSpecificsProps {
  legalCase: LegalCase;
  canViewFinancials: boolean;
}

const CaseSpecifics: React.FC<CaseSpecificsProps> = ({ legalCase, canViewFinancials }) => {
  const data = legalCase.specificData || {};

  switch (legalCase.caseType) {
    case CaseType.MONEY_RECOVERY:
      const total = data.claimAmount || 0;
      const recovered = data.recovered || 0;
      const outstanding = total - recovered;
      return (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><DollarSign size={14}/> Recovery Financials (MR-FR-03)</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Total Claim</p>
              <p className="text-lg font-bold">${total.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <p className="text-[10px] text-emerald-600 font-bold uppercase">Recovered</p>
              <p className="text-lg font-bold text-emerald-700">${recovered.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
              <p className="text-[10px] text-red-600 font-bold uppercase">Outstanding</p>
              <p className="text-lg font-bold text-red-700">${outstanding.toLocaleString()}</p>
            </div>
          </div>
        </div>
      );

    case CaseType.LAND_CASE:
      return (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><Map size={14}/> Land & Survey Details (LC-FR-01)</h4>
          <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Land Reference</span>
              <span className="font-mono font-bold text-indigo-600">{data.landRef || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Deed/Survey No</span>
              <span className="font-semibold">{data.deedNumber || 'N/A'}</span>
            </div>
            <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50">
              <History size={12}/> View Ownership History (LC-FR-02)
            </button>
          </div>
        </div>
      );

    case CaseType.APPEAL:
      return (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><ArrowUpRight size={14}/> Appeal Tracking (AP-FR-01)</h4>
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-xs text-slate-500 mb-2 font-medium">Linked Original Case Record</p>
            <div className="bg-white p-3 rounded-lg border flex items-center justify-between shadow-sm">
              <span className="font-bold text-sm">Case #MR-2023-099</span>
              <button className="text-[10px] font-bold text-indigo-600 uppercase">View Record</button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
              <ShieldAlert size={14}/> Filing Deadline: 2024-05-12
            </div>
          </div>
        </div>
      );

    case CaseType.DISCIPLINARY:
      return (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><Users size={14}/> Inquiry Panel (INQ-FR-01)</h4>
          <div className="flex -space-x-2 mb-4">
            {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>)}
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 flex items-center justify-center border-2 border-white">+1</div>
          </div>
          <p className="text-xs text-slate-500"><strong>Finding:</strong> Awaiting panel recommendations on case decision (INQ-FR-02).</p>
        </div>
      );

    default:
      return null;
  }
};

export default CaseSpecifics;
