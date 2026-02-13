
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { CaseType, CaseStatus, AgreementStatus, UserRole, LegalCase, Agreement } from '../types';
import { Activity, Clock, FileCheck, TrendingUp, DollarSign } from 'lucide-react';
import { hasPermission } from '../utils/permissions';

interface DashboardProps {
  userRole: UserRole;
  cases: LegalCase[];
  agreements: Agreement[];
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, cases, agreements }) => {
  // Simple aggregations
  const activeCasesCount = cases.filter(c => c.status === CaseStatus.ACTIVE).length;
  const pendingAgreementsCount = agreements.filter(a => a.status === AgreementStatus.PENDING_REVIEW).length;
  const totalFinancialExposure = cases.reduce((acc, curr) => acc + (curr.financialExposure || 0), 0);

  const canViewFinancials = hasPermission(userRole, 'FINANCIALS', 'VIEW');

  const caseTypeData = [
    { name: 'Money Recovery', value: cases.filter(c => c.caseType === CaseType.MONEY_RECOVERY).length },
    { name: 'Land Cases', value: cases.filter(c => c.caseType === CaseType.LAND_CASE).length },
    { name: 'Appeals', value: cases.filter(c => c.caseType === CaseType.APPEAL).length },
    { name: 'Criminal', value: cases.filter(c => c.caseType === CaseType.CRIMINAL_CASE).length },
  ];

  const statusData = [
    { name: 'Active', value: activeCasesCount },
    { name: 'New', value: cases.filter(c => c.status === CaseStatus.NEW).length },
    { name: 'Closed', value: cases.filter(c => c.status === CaseStatus.CLOSED).length },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
        <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase tracking-widest">
          {userRole} Access
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Legal Cases', val: activeCasesCount, icon: <Activity className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Pending Approvals', val: pendingAgreementsCount, icon: <Clock className="text-amber-600" />, bg: 'bg-amber-50' },
          { 
            label: 'Total Exposure', 
            val: canViewFinancials ? `$${(totalFinancialExposure/1000).toFixed(1)}k` : 'RESTRICTED', 
            icon: <TrendingUp className="text-red-600" />, 
            bg: 'bg-red-50' 
          },
          { label: 'Total Agreements', val: agreements.length, icon: <FileCheck className="text-purple-600" />, bg: 'bg-purple-50' },
        ].map((kpi, idx) => (
          <div key={idx} className={`${kpi.bg} p-4 rounded-xl border shadow-sm flex items-center justify-between transition-all hover:shadow-md`}>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-3xl font-bold mt-1 text-slate-900">{kpi.val}</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-inner">{kpi.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800"><DollarSign size={18}/> Case Distribution by Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} tick={{fill: '#64748b'}} />
                <YAxis fontSize={11} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800"><Activity size={18}/> Lifecycle Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
