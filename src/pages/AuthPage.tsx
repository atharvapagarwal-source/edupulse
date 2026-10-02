import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { GraduationCap, ArrowRight, ShieldCheck, UserCheck, Lock } from 'lucide-react';

interface AuthPageProps {
  onSuccess: (role: UserRole) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { loginAsRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('atharva@edupulse.edu');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsRole(selectedRole);
    onSuccess(selectedRole);
  };

  const handleQuickDemo = (role: UserRole) => {
    loginAsRole(role);
    onSuccess(role);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg mx-auto mb-3">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">EduPulse Portal</h2>
          <p className="text-xs text-slate-400">AI-Powered Academic Intelligence Platform</p>
        </div>

        {/* Quick Demo Switcher */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2 text-center">
          <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider block">
            Instant One-Click Demo Access
          </span>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => handleQuickDemo('STUDENT')}
              className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition flex flex-col items-center justify-center"
            >
              <GraduationCap className="w-4 h-4 mb-1" />
              <span>Student</span>
            </button>
            <button
              onClick={() => handleQuickDemo('TEACHER')}
              className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition flex flex-col items-center justify-center"
            >
              <UserCheck className="w-4 h-4 mb-1" />
              <span>Teacher</span>
            </button>
            <button
              onClick={() => handleQuickDemo('ADMIN')}
              className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold transition flex flex-col items-center justify-center"
            >
              <ShieldCheck className="w-4 h-4 mb-1" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['STUDENT', 'TEACHER', 'ADMIN'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    selectedRole === r
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2"
          >
            <span>{isRegister ? 'Create EduPulse Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-indigo-400 hover:underline"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
