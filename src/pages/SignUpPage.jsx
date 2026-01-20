// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuthStore } from '../store/useAuthStore';
// import { User, Mail, Lock, Briefcase, Loader2, Eye, EyeClosed } from 'lucide-react';
// import { axiosInstance } from '../lib/axios';
// import { toast } from 'sonner';

// const SignUpPage = () => {
//   const {
//     isSigningUp,
//     setIsSigningUp,
//     setAuthUser
//   } = useAuthStore();

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     role: 'Researcher'
//   });

//   const [seePassword, setSeePassword] = useState(true);

//   const toggleSeePassword = () => {
//     setSeePassword(!seePassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSigningUp(true);

//     try {
//       const res = await axiosInstance.post('/auth/register', formData);
//       toast.success('Account created successfully!');
//       setTimeout(() => {
//         setAuthUser(res.data.savedUser);
//       }, 1000);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Signup failed!');
//     } finally {
//       setIsSigningUp(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-lg p-8 shadow-xl">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-serif text-white mb-2">Join Tagore</h1>
//           <p className="text-[#8b949e]">Create an account to continue.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">

//           <div className="space-y-2">
//             <label className="text-xs font-bold text-[#8b949e] uppercase">Full Name</label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={18} />
//               <input
//                 type="text"
//                 className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 pl-10 text-white focus:border-[#1f6feb] outline-none"
//                 placeholder="Your Name"
//                 value={formData.fullName}
//                 onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-xs font-bold text-[#8b949e] uppercase">Email</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" size={18} />
//               <input
//                 type="email"
//                 className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 pl-10 text-white focus:border-[#1f6feb] outline-none"
//                 placeholder="you@example.com"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-xs font-bold text-[#8b949e] uppercase">Password</label>
//             <div className="relative flex items-center">
//               <Lock className="absolute left-3 text-[#8b949e]" size={18} />
//               <input
//                 type={seePassword ? 'password' : 'text'}
//                 className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 pl-10 text-white focus:border-[#1f6feb] outline-none"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={toggleSeePassword}
//                 className="absolute right-3 text-[#8b949e] hover:text-white"
//               >
//                 {seePassword ? <Eye /> : <EyeClosed />}
//               </button>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-xs font-bold text-[#8b949e] uppercase">I am a...</label>
//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 type="button"
//                 onClick={() => setFormData({ ...formData, role: 'Researcher' })}
//                 className={` p-3 border rounded-md flex items-center justify-center gap-2 transition-all ${
//                   formData.role === 'Researcher'
//                     ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#1f6feb]'
//                     : 'border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'
//                 }`}
//               >
//                 <Briefcase size={16} /> Researcher
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setFormData({ ...formData, role: 'Funder' })}
//                 className={`p-3 border rounded-md flex items-center justify-center gap-2 transition-all ${
//                   formData.role === 'Funder'
//                     ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#1f6feb]'
//                     : 'border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'
//                 }`}
//               >
//                 <User size={16} /> Funder
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isSigningUp}
//             className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3 rounded-md flex items-center justify-center disabled:opacity-50"
//           >
//             {isSigningUp ? <Loader2 className="animate-spin" /> : 'Create Account'}
//           </button>

//         </form>

//         <p className="text-center mt-6 text-[#8b949e] text-sm">
//           Already have an account?{' '}
//           <Link to="/login" className="text-[#58a6ff] hover:underline">
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Lock, Loader2, ArrowRight, Moon, Sun, Briefcase, GraduationCap } from 'lucide-react';

const SignUpPage = () => {
  const { isSigningUp, signup } = useAuthStore();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'Researcher' });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen bg-(--surface-primary) flex flex-col items-center justify-center p-6 transition-colors duration-500 font-satoshi">
      <div className="w-full max-w-md bg-(--card-surface) border border-(--border-subtle) rounded-4xl p-10 shadow-2xl relative">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-(--accent-action) rounded-xl flex items-center justify-center text-white font-bold italic mx-auto mb-6">T</div>
          <h1 className="text-3xl font-bold tracking-tight text-(--text-primary)">Join Tagore</h1>
          <p className="text-(--text-secondary) mt-2 font-medium">Start contributing to global science.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-(--text-muted) ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)" size={18} />
              <input 
                type="text" 
                className="w-full bg-(--surface-primary) border border-(--border-subtle) p-3.5 pl-12 rounded-2xl outline-none focus:border-(--accent-action) font-medium"
                placeholder="Dr. Pratham Raj"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-(--text-muted) ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)" size={18} />
              <input 
                type="email" 
                className="w-full bg-(--surface-primary) border border-(--border-subtle) p-3.5 pl-12 rounded-2xl outline-none focus:border-(--accent-action) font-medium"
                placeholder="name@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-(--text-muted) ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)" size={18} />
              <input 
                type="password" 
                className="w-full bg-(--surface-primary) border border-(--border-subtle) p-3.5 pl-12 rounded-2xl outline-none focus:border-(--accent-action)"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="py-2">
            <label className="text-[9px] font-bold uppercase tracking-widest text-(--text-muted) ml-1 mb-2 block">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'Researcher'})}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer text-xs font-bold ${formData.role === 'Researcher' ? 'border-(--accent-action) bg-(--accent-action)/5 text-(--accent-action)' : 'border-(--border-subtle) text-(--text-muted)'}`}
                >
                    <GraduationCap size={16}/> Researcher
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'Funder'})}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer text-xs font-bold ${formData.role === 'Funder' ? 'border-(--accent-action) bg-(--accent-action)/5 text-(--accent-action)' : 'border-(--border-subtle) text-(--text-muted)'}`}
                >
                    <Briefcase size={16}/> Funder
                </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSigningUp}
            className="w-full bg-(--accent-action) text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-(--accent-hover) transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {isSigningUp ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-(--text-secondary) font-medium">
          Already have an account? <Link to="/login" className="text-(--accent-action) font-bold hover:underline">Sign in</Link>
        </p>
      </div>

      <button 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="mt-8 p-4 rounded-full bg-(--card-surface) border border-(--border-subtle) text-(--text-secondary) shadow-lg hover:scale-110 transition-all cursor-pointer"
      >
        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
      </button>
    </div>
  );
};

export default SignUpPage;