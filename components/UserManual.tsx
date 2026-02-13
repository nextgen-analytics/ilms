
import React from 'react';
import { BookOpen, Gavel, FileCheck, Shield, HelpCircle, AlertTriangle, ArrowRight, MousePointer2 } from 'lucide-react';

const UserManual: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4">
      {/* Introduction */}
      <header className="space-y-4">
        <div className="w-16 h-16 bg-indigo-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-indigo-100">
          <BookOpen size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Operations Manual</h2>
        <p className="text-slate-500 max-w-2xl text-lg leading-relaxed font-medium">
          A definitive guide to managing legal lifecycles and administrative workflows within the ILMS Pro environment.
        </p>
      </header>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-indigo-300 transition-all">
          <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-3">
            <Gavel className="text-indigo-600" /> Sub-System 1: Litigation
          </h3>
          <ul className="space-y-4 text-sm text-slate-600">
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-400">01</div>
              <p><strong>Initiation:</strong> Use the 3-step wizard to define Case Type, Facts, and Evidence. (BRD-04)</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-400">02</div>
              <p><strong>Monitoring:</strong> Track legal timelines via the "Lifecycle Timeline" sidebar. Each state change is automatically logged.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-400">03</div>
              <p><strong>Evidence:</strong> Documents are stored with versioning. Use the 'Global Vault' to search for attachments across multiple cases.</p>
            </li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-emerald-300 transition-all">
          <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-3">
            <FileCheck className="text-emerald-600" /> Sub-System 2: Agreements
          </h3>
          <ul className="space-y-4 text-sm text-slate-600">
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-400">01</div>
              <p><strong>Workflow:</strong> Agreements must pass 3 levels: Review, Forwarding, and Final CLO Execution.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-400">02</div>
              <p><strong>Decisions:</strong> When approving or rejecting, you <strong>must</strong> provide a justification note for the audit log.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-400">03</div>
              <p><strong>Revisions:</strong> Use the 'Rotate' action to send a draft back to the initiator with suggested changes.</p>
            </li>
          </ul>
        </section>
      </div>

      {/* Pro-Tips & Warnings */}
      <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <HelpCircle size={120} />
        </div>
        <div className="relative z-10 space-y-8">
          <h3 className="text-2xl font-black flex items-center gap-3">
            <Shield className="text-indigo-400" /> Best Practices for Compliance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-indigo-400">
                <MousePointer2 size={20} />
                <h4 className="font-bold uppercase tracking-widest text-xs">Administrative Rigor</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Always ensure the <strong>"Summary of Facts"</strong> is complete during Case Initiation. 
                This foundation record is used by supervisors to determine jurisdictional routing.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle size={20} />
                <h4 className="font-bold uppercase tracking-widest text-xs">Security Awareness</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Never share credentials. The <strong>Universal Audit Service</strong> logs every click to your 
                user profile. Deactivating users in 'Settings' immediately revokes all sub-system tokens.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-indigo-400 font-black text-sm uppercase tracking-widest hover:text-white transition-colors pt-4">
            Download PDF Manual <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManual;
