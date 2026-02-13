
import React, { useState, useMemo } from 'react';
import { 
  FolderOpen, 
  Search, 
  FileText, 
  Download, 
  ExternalLink, 
  Filter, 
  ChevronRight, 
  MoreVertical,
  Calendar,
  User as UserIcon,
  Tag
} from 'lucide-react';
import { LegalCase, CaseDocument } from '../types';

interface DocumentVaultProps {
  cases: LegalCase[];
}

const DocumentVault: React.FC<DocumentVaultProps> = ({ cases }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const allDocuments = useMemo(() => {
    const docs: CaseDocument[] = [];
    cases.forEach(c => {
      if (c.documents) {
        c.documents.forEach(d => {
          docs.push({
            ...d,
            caseTitle: c.title,
            caseId: c.id
          });
        });
      }
    });
    return docs.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }, [cases]);

  const filteredDocs = allDocuments.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         d.caseTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || d.mimeType.includes(filterType.toLowerCase());
    return matchesSearch && matchesType;
  });

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1000) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Repository</h1>
          <p className="text-sm text-slate-500">Centralized vault for all litigation evidence and formal filings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search files or cases..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-72 focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="PDF">PDF Documents</option>
            <option value="IMAGE">Images</option>
            <option value="DOC">Word Docs</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4 text-left">Filename</th>
                <th className="px-6 py-4 text-left">Associated Case</th>
                <th className="px-6 py-4 text-left">Upload Date</th>
                <th className="px-6 py-4 text-left">Author</th>
                <th className="px-6 py-4 text-left">Size</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{doc.title}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-mono">{doc.mimeType.split('/')[1]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Tag size={12} className="text-slate-300" />
                      <span className="font-medium text-slate-600 line-clamp-1 max-w-[200px]">{doc.caseTitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-300" />
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 border flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                        {doc.uploadedBy.charAt(0)}
                      </div>
                      <span className="text-slate-600 font-medium">{doc.uploadedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                    {formatSize(doc.size)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition shadow-sm">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition shadow-sm">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center max-w-xs mx-auto text-slate-400">
                      <FolderOpen size={48} className="mb-4 opacity-10" />
                      <p className="text-sm font-bold uppercase tracking-widest mb-1">Vault Registry Empty</p>
                      <p className="text-xs leading-relaxed italic">No documents matched your current search parameters across the global directory.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentVault;
