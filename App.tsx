
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, 
  Menu, 
  Search, 
  User as UserIcon,
  HelpCircle,
  X,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { NAV_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import LegalCaseSystem from './components/LegalCaseSystem';
import AgreementSystem from './components/AgreementSystem';
import DocumentVault from './components/DocumentVault'; 
import Login from './components/Login';
import Settings from './components/Settings';
import AuditTrail from './components/AuditTrail';
import { 
  mockNotifications, 
  mockUsers as initialMockUsers, 
  mockCases as initialMockCases,
  mockAgreements as initialMockAgreements
} from './store/mockData';
import { User, UserRole, LegalCase, Agreement } from './types';
import { hasPermission } from './utils/permissions';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [systemUsers, setSystemUsers] = useState<User[]>([]);
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('ilms_users');
    const savedCases = localStorage.getItem('ilms_cases');
    const savedAgreements = localStorage.getItem('ilms_agreements');

    if (savedUsers) setSystemUsers(JSON.parse(savedUsers));
    else {
      setSystemUsers(initialMockUsers);
      localStorage.setItem('ilms_users', JSON.stringify(initialMockUsers));
    }

    if (savedCases) setCases(JSON.parse(savedCases));
    else {
      const processedCases = initialMockCases.map(c => ({ ...c, documents: c.documents || [] }));
      setCases(processedCases);
      localStorage.setItem('ilms_cases', JSON.stringify(processedCases));
    }

    if (savedAgreements) setAgreements(JSON.parse(savedAgreements));
    else {
      const processedAgreements = initialMockAgreements.map(a => ({ 
        ...a, 
        documents: (a as any).documents || [], 
        comments: (a as any).comments || [],
        currentApprovalLevel: (a as any).currentApprovalLevel || 0,
        maxApprovalLevels: (a as any).maxApprovalLevels || 3,
        updatedAt: a.createdAt 
      }));
      setAgreements(processedAgreements);
      localStorage.setItem('ilms_agreements', JSON.stringify(processedAgreements));
    }
  }, []);

  const handleRegister = (newUser: User) => {
    const updatedUsers = [newUser, ...systemUsers];
    setSystemUsers(updatedUsers);
    localStorage.setItem('ilms_users', JSON.stringify(updatedUsers));
  };

  const handleUpdateUsers = (updatedUsers: User[]) => {
    setSystemUsers(updatedUsers);
    localStorage.setItem('ilms_users', JSON.stringify(updatedUsers));
  };

  const handleAddCase = (newCase: LegalCase) => {
    const updatedCases = [newCase, ...cases];
    setCases(updatedCases);
    localStorage.setItem('ilms_cases', JSON.stringify(updatedCases));
  };

  const handleUpdateCase = (updatedCase: LegalCase) => {
    const updatedCases = cases.map(c => c.id === updatedCase.id ? updatedCase : c);
    setCases(updatedCases);
    localStorage.setItem('ilms_cases', JSON.stringify(updatedCases));
  };

  const handleAddAgreement = (newAgr: Agreement) => {
    const updated = [newAgr, ...agreements];
    setAgreements(updated);
    localStorage.setItem('ilms_agreements', JSON.stringify(updated));
  };

  const handleUpdateAgreement = (updatedAgr: Agreement) => {
    const updated = agreements.map(a => a.id === updatedAgr.id ? updatedAgr : a);
    setAgreements(updated);
    localStorage.setItem('ilms_agreements', JSON.stringify(updated));
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    const isLegalDept = [UserRole.ADMIN, UserRole.LEGAL_OFFICER, UserRole.SUPERVISOR].includes(loggedInUser.role);
    setActiveTab(isLegalDept ? 'dashboard' : 'agreements');
  };

  const handleLogout = () => {
    setUser(null);
  };

  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    
    const isLegalDept = [UserRole.ADMIN, UserRole.LEGAL_OFFICER, UserRole.SUPERVISOR].includes(user.role);
    
    return NAV_ITEMS.filter(item => {
      if (!isLegalDept) {
        return item.id === 'agreements';
      }
      
      if (item.id === 'settings' || item.id === 'audit') {
        const entity = item.id === 'settings' ? 'SETTINGS' : 'AUDIT';
        return hasPermission(user.role, entity as any, 'VIEW');
      }
      return true;
    });
  }, [user]);

  if (!user) {
    return <Login users={systemUsers} onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard userRole={user.role} cases={cases} agreements={agreements} />;
      case 'cases': return <LegalCaseSystem userRole={user.role} cases={cases} onAddCase={handleAddCase} onUpdateCase={handleUpdateCase} />;
      case 'agreements': return <AgreementSystem userRole={user.role} agreements={agreements} onAddAgreement={handleAddAgreement} onUpdateAgreement={handleUpdateAgreement} />;
      case 'documents': return <DocumentVault cases={cases} />;
      case 'settings': return <Settings userRole={user.role} users={systemUsers} onUpdateUsers={handleUpdateUsers} />;
      case 'audit': return <AuditTrail />;
      default: return <Dashboard userRole={user.role} cases={cases} agreements={agreements} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className={`bg-slate-900 text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          {sidebarOpen && <span className="font-bold text-lg tracking-tight">ILMS <span className="text-indigo-400">Pro</span></span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-2">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <UserIcon size={20} />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.role.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm font-medium">Log Out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition">
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search global records..." 
                className="pl-10 pr-4 py-1.5 bg-slate-50 border-transparent rounded-lg text-sm w-72 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 relative transition"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)}><X size={16}/></button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map(n => (
                      <div key={n.id} className="p-4 border-b hover:bg-slate-50 cursor-pointer">
                        <p className="text-sm font-bold mb-1">{n.title}</p>
                        <p className="text-xs text-slate-500 mb-2">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(n.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition">
              <HelpCircle size={20} />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-indigo-600">Secure Session</p>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
