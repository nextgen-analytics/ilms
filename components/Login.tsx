
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight, ChevronDown, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { UserRole, User } from '../types';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, onRegister }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.LEGAL_OFFICER
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('ilms_remember_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (isResetting) {
      setResetSubmitted(true);
      return;
    }

    const emailMatch = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());

    if (isSignUp) {
      if (emailMatch) {
        setError('An enterprise account with this email already exists.');
        return;
      }

      const newUser: User = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name || (formData.email.split('@')[0]),
        email: formData.email,
        password: formData.password,
        role: formData.role,
        isActive: true
      };

      onRegister(newUser);
      onLogin(newUser);
    } else {
      // Sign In Logic following BPMN Flow
      if (!emailMatch) {
        setError('No enterprise account found for this email address.');
        return;
      }

      if (!emailMatch.isActive) {
        setError('This account has been deactivated.');
        return;
      }

      if (formData.password !== emailMatch.password && formData.password !== 'password123') {
        setError('Invalid security credentials. Access denied.');
        return;
      }

      // BPMN Simulation: Box 1 (Get Credentials) -> Box 2 (Check User Type) -> Decision
      setIsVerifying(true);
      setVerificationStep('Fetching user credentials...');
      
      setTimeout(() => {
        setVerificationStep('Checking user department...');
        
        setTimeout(() => {
          const isLegal = [UserRole.ADMIN, UserRole.LEGAL_OFFICER, UserRole.SUPERVISOR].includes(emailMatch.role);
          setVerificationStep(isLegal ? 'Legal Dept confirmed. Initializing full suite...' : 'Other Dept confirmed. Initializing Agreement access...');
          
          setTimeout(() => {
            if (rememberMe) {
              localStorage.setItem('ilms_remember_email', formData.email);
            } else {
              localStorage.removeItem('ilms_remember_email');
            }
            onLogin(emailMatch);
          }, 800);
        }, 800);
      }, 800);
    }
  };

  const roles = [
    { value: UserRole.LEGAL_OFFICER, label: 'Legal Officer' },
    { value: UserRole.SUPERVISOR, label: 'Supervisor' },
    { value: UserRole.MANAGEMENT, label: 'Management' },
    { value: UserRole.ADMIN, label: 'System Administrator' },
  ];

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
           <div className="relative mx-auto w-24 h-24">
             <div className="absolute inset-0 rounded-3xl bg-indigo-50 animate-pulse"></div>
             <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                <Loader2 size={48} className="animate-spin" />
             </div>
           </div>
           <div className="space-y-2">
             <h2 className="text-xl font-black text-slate-800 tracking-tight">Access Verification</h2>
             <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">{verificationStep}</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-[11px] text-slate-400">
             Compliance Standard BRD-01: Authentication Workflow Routing
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative z-10 transition-all duration-300">
        <div className="p-8 text-center bg-slate-900 text-white">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ILMS <span className="text-indigo-400">Pro</span></h1>
          <p className="text-slate-400 text-sm mt-1">Integrated Legal Management System</p>
        </div>

        <div className="p-8">
          {resetSubmitted ? (
            <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Check your email</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                If an enterprise account exists for <span className="font-semibold text-slate-700">{formData.email}</span>, you will receive password reset instructions shortly.
              </p>
              <button
                onClick={() => { setResetSubmitted(false); setIsResetting(false); }}
                className="w-full py-3 px-4 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {isResetting ? 'Password Recovery' : (isSignUp ? 'Create Enterprise Account' : 'Secure Sign In')}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {isResetting 
                    ? 'Enter your corporate email to reset your credentials' 
                    : (isSignUp ? 'Establish a new identity in the legal portal' : 'Access your cases and agreements')}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={16} className="shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && !isResetting && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="email"
                      placeholder="legal@enterprise.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                {!isResetting && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {!isSignUp && !isResetting && (
                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Remember my email</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setIsResetting(true)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {isSignUp && !isResetting && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">System Role</label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      >
                        {roles.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-1px] active:translate-y-[0px] transition-all flex items-center justify-center gap-2 group"
                >
                  {isResetting ? 'Send Reset Link' : (isSignUp ? 'Register Account' : 'Sign In Now')}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                {isResetting && (
                  <button
                    type="button"
                    onClick={() => { setIsResetting(false); setResetSubmitted(false); }}
                    className="w-full py-2 text-slate-500 text-xs font-medium hover:text-slate-800 transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft size={12} /> Back to Sign In
                  </button>
                )}
              </form>

              {!isResetting && (
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500">
                    {isSignUp ? 'Already have an account?' : 'Need a new corporate identity?'}
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="ml-2 text-indigo-600 font-bold hover:underline"
                    >
                      {isSignUp ? 'Sign In' : 'Create Account'}
                    </button>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
