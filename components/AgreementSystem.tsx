
import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, Check, X, FileText, User, Clock, Shield, Activity, 
  Trash2, AlertCircle, RotateCcw, ChevronRight, ArrowLeft, 
  UploadCloud, Send, MessageSquare, Download, ExternalLink,
  ShieldCheck, LayoutList, History
} from 'lucide-react';
import { AgreementStatus, UserRole, Agreement, CaseDocument, AgreementComment } from '../types';
import { STATUS_COLORS } from '../constants';
import { hasPermission } from '../utils/permissions';

interface AgreementSystemProps {
  userRole: UserRole;
  agreements: Agreement[];
  onAddAgreement: (newAgr: Agreement) => void;
  onUpdateAgreement?: (updatedAgr: Agreement) => void;
}

const AgreementSystem: React.FC<AgreementSystemProps> = ({ userRole, agreements, onAddAgreement, onUpdateAgreement }) => {
  const [selectedAgrId, setSelectedAgrId] = useState<string | null>(agreements[0]?.id || null);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Workflow Action States
  const [showActionModal, setShowActionModal] = useState<'APPROVE' | 'REJECT' | 'REVISION' | null>(null);
  const [actionComment, setActionComment] = useState('');

  const [newAgrData, setNewAgrData] = useState<Partial<Agreement>>({
    title: '',
    type: 'Service Agreement',
    parties: '',
    durationMonths: 12,
    value: 0,
    documents: [],
    status: AgreementStatus.DRAFT
  });

  const selectedAgr = useMemo(() => agreements.find(a => a.id === selectedAgrId), [selectedAgrId, agreements]);

  const canCreate = hasPermission(userRole, 'AGREEMENT', 'CREATE');
  const canApprove = hasPermission(userRole, 'AGREEMENT', 'APPROVE');
  const canDelete = hasPermission(userRole, 'AGREEMENT', 'DELETE');

  const handleOpenWizard = () => {
    setNewAgrData({
      title: '',
      type: 'Service Agreement',
      parties: '',
      durationMonths: 12,
      value: 0,
      documents: [],
      status: AgreementStatus.DRAFT
    });
    setWizardStep(1);
    setShowWizard(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploading(true);
    setTimeout(() => {
      const newDocs: CaseDocument[] = Array.from(files).map((file: File) => ({
        id: `doc_${Math.random().toString(36).substr(2, 9)}`,
        title: file.name,
        version: 1,
        uploadDate: new Date().toISOString(),
        uploadedBy: 'Current User',
        url: '#',
        mimeType: file.type || 'application/octet-stream',
        size: file.size
      }));
      setNewAgrData(prev => ({ ...prev, documents: [...(prev.documents || []), ...newDocs] }));
      setIsUploading(false);
    }, 1000);
  };

  const handleFinalSubmit = () => {
    const finalAgr: Agreement = {
      id: `agr_${Math.random().toString(36).substr(2, 9)}`,
      title: newAgrData.title || 'Untitled Agreement',
      type: newAgrData.type || 'Other',
      parties: newAgrData.parties || 'N/A',
      durationMonths: newAgrData.durationMonths || 12,
      value: newAgrData.value || 0,
      status: AgreementStatus.PENDING_REVIEW, // Automatic forward to review as per image
      currentVersion: 1,
      expiryDate: new Date(Date.now() + (newAgrData.durationMonths || 12) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: newAgrData.documents || [],
      comments: [],
      currentApprovalLevel: 0,
      maxApprovalLevels: 3 // Review -> Dept Head -> Financial -> CLO
    };
    onAddAgreement(finalAgr);
    setSelectedAgrId(finalAgr.id);
    setShowWizard(false);
  };

  const handleWorkflowAction = () => {
    if (!selectedAgr || !onUpdateAgreement) return;

    let nextStatus = selectedAgr.status;
    let nextLevel = selectedAgr.currentApprovalLevel;
    const newComment: AgreementComment = {
      id: `cmt_${Date.now()}`,
      authorName: 'Authority',
      text: actionComment,
      timestamp: new Date().toISOString(),
      type: showActionModal === 'APPROVE' ? 'APPROVAL_NOTE' : showActionModal === 'REJECT' ? 'REVISION_REQUEST' : 'REVISION_REQUEST'
    };

    if (showActionModal === 'APPROVE') {
      if (selectedAgr.status === AgreementStatus.PENDING_REVIEW) {
        nextStatus = AgreementStatus.FORWARDED_FOR_APPROVAL;
        nextLevel = 1;
      } else if (selectedAgr.currentApprovalLevel < selectedAgr.maxApprovalLevels) {
        nextLevel += 1;
        if (nextLevel === selectedAgr.maxApprovalLevels) {
          nextStatus = AgreementStatus.EXECUTED;
        }
      }
    } else if (showActionModal === 'REVISION') {
      nextStatus = AgreementStatus.UNDER_REVISION;
    } else if (showActionModal === 'REJECT') {
      nextStatus = AgreementStatus.REJECTED;
    }

    onUpdateAgreement({
      ...selectedAgr,
      status: nextStatus,
      currentApprovalLevel: nextLevel,
      updatedAt: new Date().toISOString(),
      comments: [...selectedAgr.comments, newComment]
    });

    setShowActionModal(null);
    setActionComment('');
  };

  const renderWizardContent = () => {
    switch (wizardStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-800">1. Agreement Metadata (AAM-FR-02)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agreement Title</label>
                <input 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g., Annual IT Service Maintenance 2024"
                  value={newAgrData.title}
                  onChange={e => setNewAgrData({ ...newAgrData, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Parties</label>
                <input 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="Our Corp vs Third Party"
                  value={newAgrData.parties}
                  onChange={e => setNewAgrData({ ...newAgrData, parties: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gross Value ($)</label>
                <input 
                  type="number"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newAgrData.value}
                  onChange={e => setNewAgrData({ ...newAgrData, value: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duration (Months)</label>
                <input 
                  type="number"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newAgrData.durationMonths}
                  onChange={e => setNewAgrData({ ...newAgrData, durationMonths: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newAgrData.type}
                  onChange={e => setNewAgrData({ ...newAgrData, type: e.target.value })}
                >
                  <option>Service Agreement</option>
                  <option>Real Estate</option>
                  <option>Procurement</option>
                  <option>Partnership</option>
                  <option>NDA</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-800">2. Upload Draft Documents</h3>
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-[11px] text-indigo-700 leading-relaxed">
              <strong>Workflow Rule:</strong> A valid document draft must be attached before forwarding for departmental review.
            </div>
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center hover:border-indigo-400 hover:bg-slate-50 cursor-pointer transition-all"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Clock className="animate-spin text-indigo-600 mb-4" size={32} />
                  <p className="text-xs font-bold text-slate-600 uppercase">Encrypting to Vault...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="mx-auto text-slate-300" size={48} />
                  <p className="text-sm font-bold text-slate-600">Browse Computer for Files</p>
                  <p className="text-xs text-slate-400">PDF, Word, or Signed Images</p>
                </div>
              )}
            </div>

            {newAgrData.documents && newAgrData.documents.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {newAgrData.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-indigo-600" />
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[300px]">{doc.title}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewAgrData(prev => ({ ...prev, documents: prev.documents?.filter(d => d.id !== doc.id) }));
                      }}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-50">
              <Check size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Ready to Submit</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              This draft will be forwarded to the Legal Reviewer level. You can add more comments or attachments later.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border text-left space-y-2 max-w-xs mx-auto mt-6">
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                <span>Parties</span>
                <span className="text-slate-800">{newAgrData.parties || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                <span>Value</span>
                <span className="text-indigo-600">${newAgrData.value?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const getWorkflowSteps = () => {
    if (!selectedAgr) return [];
    return [
      { id: 0, label: 'Review & Suggest', status: selectedAgr.status === AgreementStatus.PENDING_REVIEW ? 'current' : selectedAgr.currentApprovalLevel > 0 ? 'completed' : 'pending' },
      { id: 1, label: 'Forward for Approval', status: selectedAgr.currentApprovalLevel === 1 ? 'current' : selectedAgr.currentApprovalLevel > 1 ? 'completed' : 'pending' },
      { id: 2, label: 'Financial / Legal Review', status: selectedAgr.currentApprovalLevel === 2 ? 'current' : selectedAgr.currentApprovalLevel > 2 ? 'completed' : 'pending' },
      { id: 3, label: 'Mark as Execute (CLO)', status: selectedAgr.status === AgreementStatus.EXECUTED ? 'completed' : selectedAgr.currentApprovalLevel === 3 ? 'current' : 'pending' },
    ];
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agreement Approval System</h1>
          <p className="text-sm text-slate-500">Multilevel workflow routing from drafting to digital signature.</p>
        </div>
        {canCreate && (
          <button 
            onClick={handleOpenWizard}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 font-bold"
          >
            <Plus size={18} /> Draft New Agreement
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Active Pipeline</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{agreements.length} Total</span>
          </div>
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 scrollbar-hide">
            {agreements.map(a => (
              <div 
                key={a.id} 
                onClick={() => setSelectedAgrId(a.id)}
                className={`group p-4 rounded-2xl border shadow-sm cursor-pointer transition-all ${selectedAgrId === a.id ? 'bg-white border-indigo-500 ring-4 ring-indigo-50 translate-x-1' : 'bg-white/60 hover:bg-white hover:border-slate-300'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${selectedAgrId === a.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                    <FileText size={16} />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${STATUS_COLORS[a.status]}`}>
                    {a.status.replace('_', ' ')}
                  </span>
                </div>
                <p className={`font-black text-sm line-clamp-1 transition-colors ${selectedAgrId === a.id ? 'text-indigo-900' : 'text-slate-800'}`}>{a.title}</p>
                <div className="flex items-center gap-2 mt-3">
                   <div className="w-4 h-4 rounded-full bg-slate-200 border border-white"></div>
                   <p className="text-[10px] text-slate-400 font-bold truncate tracking-tight">{a.parties}</p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-mono text-slate-300">Updated {new Date(a.updatedAt || a.createdAt).toLocaleDateString()}</span>
                  <ChevronRight size={12} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-3 space-y-6">
          {selectedAgr ? (
            <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden border-slate-200/60 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="p-8 border-b bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl group-hover:scale-105 transition-transform">
                      <FileText size={40} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                      <History size={16} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">{selectedAgr.title}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">Version {selectedAgr.currentVersion}.0</span>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${STATUS_COLORS[selectedAgr.status]}`}>Status: {selectedAgr.status.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Initiated {new Date(selectedAgr.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {canApprove && selectedAgr.status !== AgreementStatus.EXECUTED && selectedAgr.status !== AgreementStatus.REJECTED && (
                    <div className="flex items-center gap-2 bg-white/50 p-2 rounded-2xl border border-slate-100 shadow-inner">
                      <button 
                        onClick={() => setShowActionModal('REVISION')}
                        className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all group relative"
                      >
                        <RotateCcw size={20}/>
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Request Revision</span>
                      </button>
                      <button 
                        onClick={() => setShowActionModal('REJECT')}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all group relative"
                      >
                        <X size={20}/>
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Reject Permanent</span>
                      </button>
                      <button 
                        onClick={() => setShowActionModal('APPROVE')}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center gap-3 transition-all hover:-translate-y-0.5"
                      >
                        <Check size={20}/> {selectedAgr.status === AgreementStatus.PENDING_REVIEW ? 'Approve Review' : 'Authorize Level'}
                      </button>
                    </div>
                  )}
                  {canDelete && (
                    <button className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm"><Trash2 size={24} /></button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-x divide-slate-100 min-h-[500px]">
                <div className="lg:col-span-2 p-8 space-y-10">
                  {/* Workflow Visualization from BPMN */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                        <Activity size={14} className="text-indigo-600"/> BPMN Workflow Path (Page 12)
                       </h3>
                       <div className="flex gap-1">
                          {[0,1,2,3].map(lvl => (
                            <div key={lvl} className={`w-3 h-1.5 rounded-full ${lvl <= selectedAgr.currentApprovalLevel ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="relative p-6 bg-slate-50 rounded-[32px] border border-slate-100 shadow-inner overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <ShieldCheck size={120} />
                      </div>
                      <div className="flex items-center justify-between relative z-10">
                        {getWorkflowSteps().map((step, idx) => (
                          <React.Fragment key={idx}>
                            <div className="flex flex-col items-center gap-3 text-center max-w-[120px]">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-all duration-700 ${
                                step.status === 'completed' ? 'bg-emerald-500 border-emerald-100 text-white' : 
                                step.status === 'current' ? 'bg-indigo-600 border-indigo-200 text-white animate-pulse' : 
                                'bg-white border-slate-200 text-slate-300'
                              }`}>
                                {step.status === 'completed' ? <Check size={24}/> : <span className="text-sm font-black">{idx + 1}</span>}
                              </div>
                              <p className={`text-[10px] font-black uppercase tracking-tighter leading-tight ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-700'}`}>{step.label}</p>
                            </div>
                            {idx < 3 && (
                              <div className={`flex-1 h-1 rounded-full mx-2 transition-all duration-1000 ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Metadata Profile</h4>
                      <div className="bg-white rounded-2xl border p-5 space-y-4 shadow-sm border-slate-200/60">
                         <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                            <span className="text-[11px] font-bold text-slate-400">PARTIES</span>
                            <span className="text-xs font-black text-slate-800">{selectedAgr.parties}</span>
                         </div>
                         <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                            <span className="text-[11px] font-bold text-slate-400">CATEGORY</span>
                            <span className="text-xs font-bold text-indigo-600">{selectedAgr.type}</span>
                         </div>
                         <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                            <span className="text-[11px] font-bold text-slate-400">VALUATION</span>
                            <span className="text-sm font-black text-slate-900">${selectedAgr.value.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-400">LIFESPAN</span>
                            <span className="text-xs font-bold text-red-500">{selectedAgr.durationMonths} Months</span>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vault Attachments</h4>
                      <div className="space-y-2">
                        {selectedAgr.documents.map(doc => (
                          <div key={doc.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:bg-white hover:border-indigo-200 transition-all shadow-sm">
                            <div className="flex items-center gap-3">
                              <FileText size={16} className="text-indigo-600" />
                              <span className="text-[11px] font-black text-slate-700 truncate max-w-[120px]">{doc.title}</span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg"><Download size={14}/></button>
                              <button className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg"><ExternalLink size={14}/></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/30 p-8 space-y-6">
                   <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                    <MessageSquare size={14}/> Audit Comments & Log
                   </h3>
                   <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                      {selectedAgr.comments.map(cmt => (
                        <div key={cmt.id} className="bg-white p-4 rounded-2xl border shadow-sm space-y-2 border-slate-100">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{cmt.authorName}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{new Date(cmt.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed italic">"{cmt.text}"</p>
                          <div className="pt-2 flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${cmt.type === 'REVISION_REQUEST' ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{cmt.type.replace('_', ' ')}</span>
                          </div>
                        </div>
                      ))}
                      {selectedAgr.comments.length === 0 && (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-3xl">
                           <MessageSquare className="mx-auto text-slate-200 mb-3" size={32} />
                           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No workflow notes yet</p>
                        </div>
                      )}
                   </div>
                   
                   <div className="pt-4 border-t border-slate-100">
                      <div className="bg-white rounded-2xl border p-2 flex gap-2 shadow-inner">
                        <input 
                          className="flex-1 bg-transparent border-none outline-none text-xs px-3 py-2" 
                          placeholder="Quick note for auditors..." 
                        />
                        <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                          <Send size={16}/>
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-[48px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center animate-pulse">
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <LayoutList className="text-slate-200" size={64} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.2em]">Registry selection required</p>
              <p className="text-xs text-slate-300 mt-2 max-w-xs leading-relaxed">Choose an active agreement record from the left-hand pipeline to initiate workflow review.</p>
            </div>
          )}
        </div>
      </div>

      {/* Creation Wizard */}
      {showWizard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500">
            <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <ShieldCheck size={28} className="text-indigo-600"/>
                  Agreement Initiation Flow
                </h2>
                <div className="flex gap-3 mt-3">
                   {[1,2,3].map(i => (
                     <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${wizardStep >= i ? (wizardStep === i ? 'w-12 bg-indigo-600 shadow-lg shadow-indigo-100' : 'w-4 bg-emerald-500') : 'w-4 bg-slate-100'}`}></div>
                   ))}
                </div>
              </div>
              <button onClick={() => setShowWizard(false)} className="p-3 hover:bg-white rounded-2xl transition-colors text-slate-400 shadow-sm border border-transparent hover:border-slate-100"><X size={24}/></button>
            </div>
            
            <div className="p-10 min-h-[400px]">
              {renderWizardContent()}
            </div>

            <div className="p-8 border-t bg-slate-50/50 flex justify-between items-center">
              {wizardStep > 1 ? (
                <button 
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black text-xs flex items-center gap-2 hover:bg-slate-100 transition-all shadow-sm"
                >
                  <ArrowLeft size={18}/> Back to Step {wizardStep - 1}
                </button>
              ) : <div />}
              
              <div className="flex gap-4 items-center">
                <button onClick={() => setShowWizard(false)} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 px-4">Exit Flow</button>
                {wizardStep < 3 ? (
                  <button 
                    disabled={wizardStep === 1 && !newAgrData.title}
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-50 hover:-translate-y-0.5"
                  >
                    Continue <ChevronRight size={18}/>
                  </button>
                ) : (
                  <button 
                    onClick={handleFinalSubmit}
                    className="px-12 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 hover:-translate-y-0.5"
                  >
                    Submit for Review <Check size={20}/>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-500">
             <div className="p-10 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Workflow Decision</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Status Transition: {showActionModal}</p>
                </div>
                <button onClick={() => setShowActionModal(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X size={28}/></button>
             </div>
             <div className="p-10 space-y-6">
                <div className={`p-6 rounded-[32px] border flex items-center gap-5 ${showActionModal === 'APPROVE' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : showActionModal === 'REJECT' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-transparent">
                    {showActionModal === 'APPROVE' ? <Check className="text-emerald-600" size={28}/> : showActionModal === 'REJECT' ? <AlertCircle className="text-red-600" size={28}/> : <RotateCcw className="text-amber-600" size={28}/>}
                   </div>
                   <p className="text-xs font-black leading-relaxed italic uppercase tracking-tighter">
                     "This operation is immutable and will be indexed in the global audit repository. The initiator will receive a priority system notification."
                   </p>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>Justification Remarks</span>
                    <span className="text-indigo-600">Required</span>
                   </label>
                   <textarea 
                    className="w-full border-2 border-slate-100 rounded-[32px] p-6 text-sm focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 outline-none h-40 transition-all" 
                    placeholder="Provide specific reasons for this decision..."
                    value={actionComment}
                    onChange={e => setActionComment(e.target.value)}
                   ></textarea>
                </div>
             </div>
             <div className="p-10 border-t bg-slate-50/50 flex gap-4">
                <button onClick={() => setShowActionModal(null)} className="flex-1 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-colors">Discard</button>
                <button 
                  disabled={!actionComment}
                  onClick={handleWorkflowAction}
                  className={`flex-[2] py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-2xl transition-all disabled:opacity-30 ${showActionModal === 'APPROVE' ? 'bg-emerald-600 shadow-emerald-200' : showActionModal === 'REJECT' ? 'bg-red-600 shadow-red-200' : 'bg-amber-600 shadow-amber-200'}`}
                >
                  Confirm & Route Task
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreementSystem;
