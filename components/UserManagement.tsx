
import React, { useState } from 'react';
import { UserPlus, Search, UserMinus, UserCheck, Shield, Mail, MoreVertical, X } from 'lucide-react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateUsers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: UserRole.VIEWER });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = (id: string) => {
    onUpdateUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      ...newUser,
      isActive: true
    };
    onUpdateUsers([created, ...users]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: UserRole.VIEWER });
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'bg-red-100 text-red-700 border-red-200';
      case UserRole.MANAGEMENT: return 'bg-purple-100 text-purple-700 border-purple-200';
      case UserRole.SUPERVISOR: return 'bg-blue-100 text-blue-700 border-blue-200';
      case UserRole.LEGAL_OFFICER: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">User Directory</h2>
          <p className="text-sm text-slate-500">Manage personnel access and system roles.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
        >
          <UserPlus size={18} /> Provision New User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Identity</th>
                <th className="px-6 py-4 text-left">System Role</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getRoleColor(u.role)}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                      <span className={`text-xs font-medium ${u.isActive ? 'text-emerald-700' : 'text-slate-400 italic'}`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleUserStatus(u.id)}
                        className={`p-2 rounded-lg transition-colors ${u.isActive ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                        title={u.isActive ? 'Deactivate User' : 'Reactivate User'}
                      >
                        {u.isActive ? <UserMinus size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                    No users matching your search criteria were found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">New User Provisioning</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50 focus:bg-white" 
                  placeholder="e.g. Rachel Zane"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Corporate Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50 focus:bg-white" 
                  placeholder="r.zane@legal.corp"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Role</label>
                <select 
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50 focus:bg-white"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                >
                  {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
