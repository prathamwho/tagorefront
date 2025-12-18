import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Lock, Briefcase, Loader2 } from 'lucide-react';

const SignUpPage = () => {
  const { signup, isSigningUp } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Researcher' // Default role
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-lg p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-white mb-2">Join Tagore</h1>
          <p className="text-[#8b949e]">Create an account to fund or publish research.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8b949e] uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={18} />
              <input 
                type="text"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 pl-10 text-white focus:border-[#1f6feb] outline-none"
                placeholder="Pratham Raj"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8b949e] uppercase">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, role: 'Researcher'})}
                 className={`p-3 border rounded-md flex items-center justify-center gap-2 transition-all ${formData.role === 'Researcher' ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#1f6feb]' : 'border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'}`}
               >
                 <Briefcase size={16} /> Researcher
               </button>
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, role: 'Funder'})}
                 className={`p-3 border rounded-md flex items-center justify-center gap-2 transition-all ${formData.role === 'Funder' ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#1f6feb]' : 'border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'}`}
               >
                 <User size={16} /> Funder
               </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSigningUp}
            className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3 rounded-md flex items-center justify-center disabled:opacity-50"
          >
            {isSigningUp ? <Loader2 className="animate-spin" /> : "Create Account"}
          </button>

        </form>

        <p className="text-center mt-6 text-[#8b949e] text-sm">
          Already have an account? <Link to="/login" className="text-[#58a6ff] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;