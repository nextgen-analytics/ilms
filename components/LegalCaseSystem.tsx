
import React, { useState, useMemo, useRef } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  Check, 
  FileText, 
  X, 
  Clock, 
  Activity, 
  UploadCloud,
  ExternalLink,
  ShieldCheck,
  FileIcon,
  AlertCircle,
  Send
} from 'lucide-react';
import { mockAuditLogs } from '../store/mockData';
import { CaseStatus, CaseType, UserRole, LegalCase, CaseDocument } from '../types';
import { CASE_TYPE_LABELS, STATUS_COLORS } from '../constants';
import { hasPermission } from '../utils/permissions';
import CaseSpecifics from './CaseSpecifics';

interface LegalCaseSystemProps {
  userRole: UserRole;
  cases: LegalCase[];
  onAddCase: (newCase: LegalCase) => void;
  onUpdateCase: (updatedCase: LegalCase) => void;
}

const LegalCaseSystem: React.FC<LegalCaseSystemProps> = ({ userRole, cases, onAddCase, onUpdateCase }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [wizardStep, setWizardStep] = useState(1); 
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(cases[0]?.id || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newCaseData, setNewCaseData] = useState<Partial<LegalCase>>({
    caseType: CaseType.MONEY_RECOVERY,
    status: CaseStatus.NEW,
    title: '',
    partiesInvolved: '',
    summaryOfFacts: '',
    courtAuthority: '',
    financialExposure: 0,
    documents: []
  });

  const selectedCase = useMemo(() => cases.find(c => c.id === selectedCaseId), [selectedCaseId, cases]);

  const caseHistory = useMemo(() => {
    return mockAuditLogs
      .filter(log => log.entityId === selectedCaseId && log.entityType === 'CASE')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [selectedCaseId]);

  const canCreate = hasPermission(userRole, 'CASE', 'CREATE');
  const canEdit = hasPermission(userRole, 'CASE', 'EDIT');
  const canDelete = hasPermission(userRole, 'CASE', 'DELETE');
  const canViewFinancials = hasPermission(userRole, 'FINANCIALS', 'VIEW');

  const openCreateWizard = () => {
    setIsEditMode(false);
    setNewCaseData({
      caseType: CaseType.MONEY_RECOVERY,
      status: CaseStatus.NEW,
      title: '',
      partiesInvolved: '',
      summaryOfFacts: '',
      courtAuthority: '',
      financialExposure: 0,
      documents: []
    });
    setWizardStep(1);
    setShowWizard(true);
  };

  const openEditWizard = (e: React.MouseEvent, c: LegalCase) => {
    e.stopPropagation();
    setIsEditMode(true);
    setNewCaseData({ ...c });
    setWizardStep(3); // Go straight to details for edit
    setShowWizard(true);
  };

  const closeWizard = () => {
    setShowWizard(false);
    setWizardStep(1);
    setIsEditMode(false);
  };

  const handleFinalSubmit = () => {
    if (isEditMode && newCaseData.id) {
      const updatedCase: LegalCase = {
        ...newCaseData as LegalCase,
        updatedAt: new Date().toISOString()
      };
      onUpdateCase(updatedCase);
    } else {
      const typePrefixes: Record<string, string> = {
        MONEY_RECOVERY: 'MR',
        DAMAGES_RECOVERY: 'DR',
        APPEAL: 'AP',
        LAND_CASE: 'LC',
        CRIMINAL_CASE: 'CR',
        DISCIPLINARY: 'INQ',
        OTHER: 'OTH'
      };

      const prefix = typePrefixes[newCaseData.caseType || 'OTH'];
      const count = cases.filter(c => c.caseType === newCaseData.caseType).length + 1;
      const refNo = `${prefix}-2024-${count.toString().padStart(3, '0')}`;

      const createdCase: LegalCase = {
        id: `case_${Math.random().toString(36).substr(2, 9)}`,
        title: newCaseData.title || 'Untitled Case',
        caseType: newCaseData.caseType as CaseType,
        referenceNumber: refNo,
        status: CaseStatus.NEW,
        partiesInvolved: newCaseData.partiesInvolved || 'N/A',
        natureOfCase: newCaseData.title || '',
        financialExposure: newCaseData.financialExposure || 0,
        courtAuthority: newCaseData.courtAuthority || 'Pending Assignment',
        summaryOfFacts: newCaseData.summaryOfFacts || 'Initial creation.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: newCaseData.documents || [],
        specificData: {
          isInitialDocumentSaved: true,
          documentUploadTimestamp: new Date().toISOString()
        }
      };

      onAddCase(createdCase);
      setSelectedCaseId(createdCase.id);
    }
    closeWizard();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    setTimeout(() => {
      const newDocs: CaseDocument[] = Array.from(files).map((file: File) => ({
        id: `doc_${Math.random().toString(36).substr(2, 9)}`,
        title: file.name,
        version: 1,
        uploadDate: new Date().toISOString(),
        uploadedBy: 'Legal Officer',
        url: '#',
        mimeType: file.type || 'application/octet-stream'
      }));

      setNewCaseData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), ...newDocs]
      }));
      
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1200);
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const getWizardButtonLabel = () => {
    if (isEditMode) return 'Update Record';
    switch(wizardStep) {
      case 1: return 'Proceed to Document';
      case 2: return 'Proceed to Details';
      case 3: return 'Review Submission';
      case 4: return 'Submit for Review';
      default: return 'Next Step';
    }
  };

  const isNextDisabled = () => {
    if (wizardStep === 1) return !newCaseData.caseType;
    if (wizardStep === 2) return !newCaseData.documents || newCaseData.documents.length === 0;
    if (wizardStep === 3) return !newCaseData.title || !newCaseData.summaryOfFacts;
    return false;
  };

  const renderWizardContent = () => {
    switch(wizardStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
              Select Case Type (BPMN Box 2)
            </h3>
            <div className="grid grid-cols-2 gap-4 pb-4">
              {Object.entries(CASE_TYPE_LABELS).map(([type, label]) => (
                <button 
                  key={type}
                  onClick={() => {
                    setNewCaseData({ ...newCaseData, caseType: type as CaseType });
                    // No auto-advance to step 2 to allow user to confirm with the main button
                  }}
                  className={`p-4 border-2 rounded-2xl text-left hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group ${newCaseData.caseType === type ? 'border-indigo-500 bg-indigo-50/80 ring-4 ring-indigo-50' : 'bg-white border-slate-100'}`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-black text-slate-800 tracking-tight">{label}</p>
                    {newCaseData.caseType === type && <Check size={16} className="text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Legal Registry Category</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
               Create Initial Document (BPMN Box 3)
            </h3>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-700 leading-relaxed flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>
                <strong>System Rule:</strong> To initiate a new case, a primary "Initial Document" (Notice of Claim, Summons, or Formal Report) must be uploaded to the vault.
              </p>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              onChange={handleFileChange}
            />

            <div 
              onClick={triggerFileBrowser}
              className={`border-4 border-dashed rounded-[32px] p-12 text-center transition-all cursor-pointer ${isUploading ? 'bg-indigo-50 border-indigo-400 animate-pulse' : 'border-slate-100 hover:border-indigo-300 hover:bg-slate-50'}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Clock className="animate-spin text-indigo-600 mb-4" size={32} />
                  <p className="text-sm font-black text-indigo-700 uppercase tracking-widest">Encrypting to Vault...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl text-indigo-600 border border-slate-50">
                    <UploadCloud size={32}/>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">Attach Legal Instrument</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, Word, or Scanned Images (Max 50MB)</p>
                  </div>
                </div>
              )}
            </div>

            {newCaseData.documents && newCaseData.documents.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Uploaded Initial Records</p>
                <div className="space-y-2">
                  {newCaseData.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm animate-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                          <FileText size={18} />
                        </div>
                        <span className="text-xs font-black text-slate-700 truncate max-w-[350px]">{doc.title}</span>
                      </div>
                      <button 
                        onClick={() => setNewCaseData(prev => ({ ...prev, documents: prev.documents?.filter(d => d.id !== doc.id) }))}
                        className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">3</span>
              Enter Case Details (BPMN Box 4)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Matter Title</label>
                <input 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                  placeholder="e.g. Debt Recovery - Merchant Corp"
                  value={newCaseData.title}
                  onChange={(e) => setNewCaseData({ ...newCaseData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Court / Authority</label>
                <input 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                  placeholder="e.g. High Court Commercial Div"
                  value={newCaseData.courtAuthority}
                  onChange={(e) => setNewCaseData({ ...newCaseData, courtAuthority: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Parties (Applicant v Respondent)</label>
                <input 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                  placeholder="Company Name vs Counterparty"
                  value={newCaseData.partiesInvolved}
                  onChange={(e) => setNewCaseData({ ...newCaseData, partiesInvolved: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Financial Exposure ($)</label>
                <input 
                  type="number"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                  placeholder="0.00"
                  value={newCaseData.financialExposure}
                  onChange={(e) => setNewCaseData({ ...newCaseData, financialExposure: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Summary of Facts (Mandatory History)</label>
                <textarea 
                  className="w-full border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all h-32 leading-relaxed" 
                  placeholder="Enter the primary narrative and legal grounds for this matter..."
                  value={newCaseData.summaryOfFacts}
                  onChange={(e) => setNewCaseData({ ...newCaseData, summaryOfFacts: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 text-center py-4">
             <h3 className="font-bold text-slate-800 flex items-center justify-center gap-2">
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">4</span>
              Submit for Review (BPMN Box 5)
            </h3>
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-indigo-100 animate-bounce">
              <Send size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Final Verification</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
                You are about to route this case to the Supervisor pool for approval (BPMN "Check Approval"). 
                Ensure all documents and facts are legally verified.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-[32px] p-8 text-left border border-slate-100 max-w-md mx-auto space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</span>
                <span className="text-xs font-black text-indigo-600 uppercase">{CASE_TYPE_LABELS[newCaseData.caseType || 'OTHER']}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matter</span>
                <span className="text-xs font-bold text-slate-800 line-clamp-1">{newCaseData.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence</span>
                <span className="text-xs font-bold text-emerald-600 uppercase">{newCaseData.documents?.length || 0} Records Attached</span>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Case Registry</h1>
          <p className="text-sm text-slate-500 font-medium">BPMN-Governed Legal Initiation & Monitoring</p>
        </div>
        {canCreate && (
          <button 
            onClick={openCreateWizard}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl flex items-center gap-3 hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 font-black text-sm uppercase tracking-widest hover:-translate-y-0.5"
          >
            <Plus size={20} /> New Legal Case
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden border-slate-200/60">
            <div className="p-6 border-b bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter by ref, title or parties..." 
                  className="w-full pl-12 pr-6 py-3 text-sm border-2 border-slate-100 rounded-2xl bg-white outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-medium" 
                />
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Registry Key:</span>
                 {Object.entries(STATUS_COLORS).slice(0, 4).map(([status, color]) => (
                   <span key={status} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border ${color}`}>{status}</span>
                 ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/80 border-b text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-6 text-left">Reference</th>
                    <th className="px-8 py-6 text-left">Identity & Entities</th>
                    <th className="px-8 py-6 text-left">Category</th>
                    <th className="px-8 py-6 text-left">Lifecycle State</th>
                    <th className="px-8 py-6 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cases.map((c) => (
                    <tr 
                      key={c.id} 
                      className={`hover:bg-slate-50/80 cursor-pointer transition-all group ${selectedCaseId === c.id ? 'bg-indigo-50/30 ring-inset ring-2 ring-indigo-500/20' : ''}`}
                      onClick={() => setSelectedCaseId(c.id)}
                    >
                      <td className="px-8 py-6">
                        <div className="font-mono text-[11px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{c.referenceNumber}</div>
                        <div className="text-[9px] text-slate-300 mt-1 uppercase font-bold">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-800 text-sm tracking-tight">{c.title}</div>
                        <div className="text-[11px] text-slate-400 italic mt-1 font-medium">{c.partiesInvolved}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-slate-500 font-black text-[10px] uppercase tracking-widest">{CASE_TYPE_LABELS[c.caseType]}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${STATUS_COLORS[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          {canEdit && (
                            <button 
                              onClick={(e) => openEditWizard(e, c)}
                              className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:shadow-lg transition-all"
                            >
                              <Edit2 size={16}/>
                            </button>
                          )}
                          <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 hover:shadow-lg transition-all"><MoreHorizontal size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {cases.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center max-w-xs mx-auto text-slate-300">
                          <Activity size={48} className="mb-4 opacity-10" />
                          <p className="text-sm font-black uppercase tracking-widest">Vault Empty</p>
                          <p className="text-xs mt-1 italic">No legal records found in the current jurisdiction.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[40px] border shadow-2xl overflow-hidden sticky top-6 self-start border-slate-200/60 transition-all">
            {selectedCase ? (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="p-8 border-b bg-slate-50/50">
                   <div className="flex justify-between items-start mb-6">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${STATUS_COLORS[selectedCase.status]}`}>
                        State: {selectedCase.status}
                      </div>
                      <div className="flex gap-2">
                        {canEdit && <button onClick={(e) => openEditWizard(e, selectedCase)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><Edit2 size={16}/></button>}
                        {canDelete && <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 transition-all shadow-sm"><Trash2 size={16}/></button>}
                      </div>
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 leading-[1.1] tracking-tight mb-4">{selectedCase.title}</h2>
                   <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-inner">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FileIcon size={12} className="text-indigo-500"/> Reference Key
                     </p>
                     <p className="font-mono text-sm font-black text-indigo-600 mt-1 uppercase">{selectedCase.referenceNumber}</p>
                   </div>
                </div>

                <div className="p-8 space-y-10">
                  <CaseSpecifics legalCase={selectedCase} canViewFinancials={canViewFinancials} />
                  
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                      <ShieldCheck size={14} className="text-indigo-600"/> Evidence Vault
                    </h4>
                    <div className="space-y-3">
                      {selectedCase.documents && selectedCase.documents.length > 0 ? (
                        selectedCase.documents.map(doc => (
                          <div key={doc.id} className="group p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm border border-slate-50">
                                <FileText size={20} />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-black text-slate-800 truncate max-w-[120px]">{doc.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Version {doc.version}.0</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button title="Open" className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-colors"><ExternalLink size={16}/></button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center border-4 border-dashed rounded-[32px] border-slate-100">
                          <FileText className="mx-auto mb-4 text-slate-200" size={32} />
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Evidence Missing</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowTimeline(true)}
                    className="w-full py-5 bg-slate-900 text-white rounded-[32px] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 hover:-translate-y-1"
                  >
                    <Activity size={18} /> Audit Lifecycle (FR-11)
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center justify-center h-full space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center shadow-inner animate-pulse">
                  <ShieldCheck className="text-slate-200" size={48} />
                </div>
                <div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Registry Idle</p>
                  <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">Select a case identity to hydrate system-level specifics and evidence links.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Initiation Wizard (Following BPMN) */}
      {showWizard && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-500 flex flex-col h-full max-h-[90vh]">
            <div className={`p-10 border-b flex items-center justify-between shrink-0 ${isEditMode ? 'bg-indigo-50/50' : 'bg-slate-50/50'}`}>
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4 tracking-tight leading-none">
                  {isEditMode ? <Edit2 size={32} className="text-indigo-600"/> : <ShieldCheck size={32} className="text-indigo-600"/>}
                  {isEditMode ? 'Update Legal Record' : 'Legal Case Initiation Flow'}
                </h2>
                {!isEditMode && (
                  <div className="flex gap-3 mt-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-500 ${wizardStep === i ? 'w-12 bg-indigo-600 shadow-lg shadow-indigo-100' : wizardStep > i ? 'w-4 bg-emerald-500' : 'w-4 bg-slate-200'}`}></div>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={closeWizard} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"><X size={28}/></button>
            </div>
            
            <div className="p-10 flex-1 overflow-y-auto min-h-0 bg-white">
              {renderWizardContent()}
            </div>

            <div className="p-10 border-t bg-slate-50/50 flex justify-between gap-4 shrink-0">
              {wizardStep > 1 && (
                <button 
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-100 transition-all shadow-sm"
                >
                  <ArrowLeft size={18}/> Previous Step
                </button>
              )}
              <div className="flex-1"></div>
              <button onClick={closeWizard} className="px-6 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">Discard Draft</button>
              
              {wizardStep < 4 ? (
                <button 
                  disabled={isNextDisabled()}
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className={`px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 disabled:opacity-30 hover:-translate-y-1 ${!isNextDisabled() ? 'shadow-2xl shadow-indigo-200 animate-pulse' : ''}`}
                >
                  {getWizardButtonLabel()} <ChevronRight size={18}/>
                </button>
              ) : (
                <button 
                  onClick={handleFinalSubmit}
                  className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3 hover:-translate-y-1"
                >
                  {isEditMode ? 'Update Record' : 'Confirm & Submit'} <Check size={20}/>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showTimeline && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[70] flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl animate-in slide-in-from-right duration-700 overflow-hidden flex flex-col">
            <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-indigo-200">
                  <Activity size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Audit Timeline</h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">{selectedCase?.referenceNumber}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTimeline(false)}
                className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 bg-white">
              <div className="relative border-l-4 border-slate-50 ml-6 pl-10 space-y-12">
                {caseHistory.length > 0 ? (
                  caseHistory.map((log, index) => (
                    <div key={log.id} className="relative group">
                      <div className={`absolute -left-[54px] top-1 w-8 h-8 rounded-2xl border-4 border-white shadow-xl ring-4 ring-white transition-all duration-700 ${
                        index === 0 ? 'bg-indigo-600 scale-110' : 'bg-slate-200 group-hover:bg-indigo-400'
                      }`}></div>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-sm border ${
                            index === 0 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                          }`}>
                            {log.action.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} /> {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="p-5 bg-slate-50/50 border border-slate-50 rounded-[28px] group-hover:bg-white group-hover:border-slate-100 transition-all group-hover:shadow-md">
                          <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                            {log.details}
                          </p>
                          <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100/50">
                            <div className="w-8 h-8 rounded-xl bg-white border shadow-sm flex items-center justify-center text-[10px] font-black text-indigo-600">
                              {log.userName.charAt(0)}
                            </div>
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{log.userName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 -ml-10">
                    <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 border-4 border-dashed border-slate-100">
                      <FileText size={32} className="text-slate-200" />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Audit Registry Null</p>
                    <p className="text-xs text-slate-400 mt-2 italic">Immutable transaction logs hydrate here upon state mutation.</p>
                  </div>
                )}
                <div className="pt-8 -ml-10 text-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
                    Registry Terminal
                  </span>
                </div>
              </div>
            </div>

            <div className="p-10 border-t bg-slate-50/50 flex gap-4">
              <button className="flex-1 py-4 bg-white border border-slate-200 rounded-[24px] text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all shadow-sm">Export Audit Log</button>
              <button 
                onClick={() => setShowTimeline(false)}
                className="flex-1 py-4 bg-slate-900 text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200"
              >
                Close Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalCaseSystem;
