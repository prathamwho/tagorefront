import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-lg p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-white mb-2">Welcome back</h1>
          <p className="text-[#8b949e]">Sign in to continue your research.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8b949e] uppercase">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={18} />
              <input 
                type="email"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 pl-10 text-white focus:border-[#1f6feb] outline-none"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8b949e] uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={18} />
              <input 
                type="password"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 pl-10 text-white focus:border-[#1f6feb] outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3 rounded-md flex items-center justify-center disabled:opacity-50"
          >
            {isLoggingIn ? <Loader2 className="animate-spin" /> : "Sign in"}
          </button>
        </form>

        <p className="text-center mt-6 text-[#8b949e] text-sm">
          New to Tagore? <Link to="/signup" className="text-[#58a6ff] hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;