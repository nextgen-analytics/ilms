
import React from 'react';
import { Database, Server, Cpu, Lock, Layers, CheckCircle, Clock, Share2, ShieldAlert } from 'lucide-react';

const ArchitectureDocumentation: React.FC = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      {/* Overview Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <Layers className="text-indigo-600" /> Enterprise System Blueprint
        </h2>
        <p className="text-slate-600 leading-relaxed">
          The ILMS Pro is built on a distributed micro-services architecture designed for high availability, 
          immutable auditability, and strictly enforced RBAC (Role-Based Access Control). 
          The platform bifurcates operations into two specialized sub-systems sharing a common core logic.
        </p>
      </section>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Cpu size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Frontend Stack</h3>
          <ul className="text-xs text-slate-500 space-y-2 font-medium">
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500"/> React 19 (Hooks/Memo)</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500"/> Tailwind CSS (Atomic Design)</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500"/> Lucide Iconography</li>
          </ul>
        </div>
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <Server size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Backend/API Layer</h3>
          <ul className="text-xs text-slate-500 space-y-2 font-medium">
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500"/> RESTful Service Gateway</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500"/> BPMN 2.0 State Machine</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500"/> JWT Bearer Authentication</li>
          </ul>
        </div>
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Database size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Persistence Layer</h3>
          <ul className="text-xs text-slate-500 space-y-2 font-medium">
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500"/> PostgreSQL (Case Records)</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500"/> S3 Encrypted Object Store</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-500"/> Redis Transaction Cache</li>
          </ul>
        </div>
      </div>

      {/* ERD / Data Model Logic */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Share2 size={20} className="text-indigo-600"/> Logical Entity Mapping
        </h3>
        <div className="bg-slate-900 rounded-[32px] p-8 text-slate-300 font-mono text-[11px] leading-relaxed border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">Case Handle Object (CHO)</p>
              <p className="text-slate-500">
                // Foundation for litigation tracking<br/>
                &#123;<br/>
                &nbsp;&nbsp;id: UUID,<br/>
                &nbsp;&nbsp;type: Enum(MR, LC, DR, AP),<br/>
                &nbsp;&nbsp;status: FSM_State,<br/>
                &nbsp;&nbsp;financials: Restricted&lt;Numeric&gt;,<br/>
                &nbsp;&nbsp;doc_vault_ptr: VaultRef[]<br/>
                &#125;
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Agreement Approval Object (AAO)</p>
              <p className="text-slate-500">
                // Multi-level workflow container<br/>
                &#123;<br/>
                &nbsp;&nbsp;workflow_id: UUID,<br/>
                &nbsp;&nbsp;levels: Integer(0..3),<br/>
                &nbsp;&nbsp;approvers: RoleID[],<br/>
                &nbsp;&nbsp;decision_log: CommentLog[],<br/>
                &nbsp;&nbsp;version_ctrl: SemanticVersion<br/>
                &#125;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Audit */}
      <section className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
        <h3 className="text-lg font-bold text-amber-900 mb-6 flex items-center gap-2">
          <Lock size={20} /> Security & Integrity Protocols
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h4 className="font-bold text-amber-800 text-sm flex items-center gap-2">
              <ShieldAlert size={16}/> Data-at-Rest Protection
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              All documents uploaded to the <strong>Document Vault</strong> are encrypted using AES-256. 
              The pointers in the database are protected via Row-Level Security (RLS) ensuring officers 
              can only access records within their assigned department or jurisdiction.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-amber-800 text-sm flex items-center gap-2">
              <Clock size={16}/> Immutable Audit Trail (BRD-11)
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              Every system mutation (Update/Delete/Approve) triggers a shadow record in the 
              Audit Service. These logs are write-once, read-many (WORM) to ensure absolute 
              traceability for legal compliance and regulatory reporting.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArchitectureDocumentation;
