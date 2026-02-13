
import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, FileText, Info, BookOpen } from 'lucide-react';
import UserManagement from './UserManagement';
import ArchitectureDocumentation from './ArchitectureDocumentation';
import UserManual from './UserManual';
import { UserRole, User } from '../types';

interface SettingsProps {
  userRole: UserRole;
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ userRole, users, onUpdateUsers }) => {
  const isAdmin = userRole === UserRole.ADMIN;
  const [activeSubTab, setActiveSubTab] = useState<'docs' | 'users' | 'manual'>(isAdmin ? 'users' : 'manual');

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-4 bg-white rounded-3xl border shadow-sm text-indigo-600 shadow-indigo-100">
          <SettingsIcon size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Controls</h1>
          <p className="text-sm text-slate-500 font-medium">Governance, Architecture, and Personnel Management.</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50/30 overflow-x-auto scrollbar-hide">
          {isAdmin && (
            <button 
              onClick={() => setActiveSubTab('users')}
              className={`px-8 py-5 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 border-b-2 shrink-0 ${
                activeSubTab === 'users' 
                ? 'text-indigo-600 border-indigo-600 bg-white' 
                : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              <Shield size={18} /> User Directory
            </button>
          )}
          <button 
            onClick={() => setActiveSubTab('manual')}
            className={`px-8 py-5 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 border-b-2 shrink-0 ${
              activeSubTab === 'manual' 
              ? 'text-indigo-600 border-indigo-600 bg-white' 
              : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            <BookOpen size={18} /> User Manual
          </button>
          <button 
            onClick={() => setActiveSubTab('docs')}
            className={`px-8 py-5 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 border-b-2 shrink-0 ${
              activeSubTab === 'docs' 
              ? 'text-indigo-600 border-indigo-600 bg-white' 
              : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            <FileText size={18} /> Tech Blueprint
          </button>
          <div className="flex-1"></div>
          <div className="px-8 hidden lg:flex items-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <Info size={14} className="text-indigo-400" /> Contextual Governance
            </span>
          </div>
        </div>

        <div className="p-10 bg-white min-h-[600px]">
          {activeSubTab === 'users' && isAdmin && <UserManagement users={users} onUpdateUsers={onUpdateUsers} />}
          {activeSubTab === 'docs' && <ArchitectureDocumentation />}
          {activeSubTab === 'manual' && <UserManual />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
