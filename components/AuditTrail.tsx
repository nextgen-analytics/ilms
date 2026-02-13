
import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  User as UserIcon, 
  Gavel, 
  FileCheck, 
  FileText, 
  ShieldAlert,
  Calendar,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { mockAuditLogs } from '../store/mockData';
import { AuditLog } from '../types';

const AuditTrail: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return mockAuditLogs
      .filter(log => {
        const matchesSearch = 
          log.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.entityId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'ALL' || log.entityType === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [searchQuery, filterType]);

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'CASE': return <Gavel size={16} className="text-blue-500" />;
      case 'AGREEMENT': return <FileCheck size={16} className="text-emerald-500" />;
      case 'USER': return <UserIcon size={16} className="text-purple-500" />;
      case 'DOCUMENT': return <FileText size={16} className="text-indigo-500" />;
      default: return <ShieldAlert size={16} className="text-slate-400" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (action.includes('REJECT') || action.includes('DELETE')) return 'bg-red-50 text-red-700 border-red-100';
    if (action.includes('APPROVE') || action.includes('ACTIVATE')) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-[24px] border shadow-sm text-indigo-600 shadow-indigo-50">
            <History size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Audit Ledger</h1>
            <p className="text-sm text-slate-500 font-medium">Global Immutable Transaction Log (Compliance Standard BRD-11)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by user, entity ID, or activity details..." 
            className="w-full pl-12 pr-6 py-3 text-sm border-2 border-slate-50 rounded-2xl bg-slate-50/50 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-2 shrink-0">
          <Filter size={16} className="text-slate-400" />
          <select 
            className="appearance-none bg-white border-2 border-slate-100 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 outline-none focus:border-indigo-500 transition-all"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Entities</option>
            <option value="CASE">Litigation Cases</option>
            <option value="AGREEMENT">Legal Agreements</option>
            <option value="USER">User Management</option>
            <option value="DOCUMENT">Vault Records</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6 text-left">Timestamp & User</th>
                <th className="px-8 py-6 text-left">Activity Context</th>
                <th className="px-8 py-6 text-left">Action Performed</th>
                <th className="px-8 py-6 text-left">Details</th>
                <th className="px-8 py-6 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 group-hover:bg-white transition-colors">
                        {log.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight">{log.userName}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mt-0.5">
                          <Calendar size={10} /> {new Date(log.timestamp).toLocaleDateString()}
                          <Clock size={10} className="ml-1" /> {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        {getEntityIcon(log.entityType)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.entityType}</p>
                        <p className="text-xs font-mono font-bold text-indigo-600 mt-0.5">{log.entityId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${getActionBadgeColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-slate-600 leading-relaxed max-w-md font-medium">
                      {log.details}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all hover:shadow-md border border-transparent hover:border-slate-100">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center max-w-xs mx-auto text-slate-300">
                      <ShieldAlert size={48} className="mb-4 opacity-10" />
                      <p className="text-sm font-black uppercase tracking-widest">No matching activities</p>
                      <p className="text-xs mt-1 italic">The search filters yielded no results in the current ledger index.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Legend / Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tight">Integrity Check</h4>
            <p className="text-[11px] text-indigo-700/70 mt-1 leading-relaxed">This ledger uses write-once-read-many (WORM) storage. Entries cannot be modified once committed to the persistence layer.</p>
          </div>
        </div>
        <div className="p-6 bg-slate-900 rounded-3xl text-white flex items-start gap-4 shadow-xl">
          <div className="p-3 bg-slate-800 rounded-2xl text-indigo-400">
            <Clock size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-tight">Retention Policy</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Compliance records are retained for a period of 7 years as per legal regulatory frameworks (FR-L-09).</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
            <Download size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-tight">Audit Export</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Need a physical copy? Use the export tool to generate signed PDF or CSV summaries for external auditors.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
