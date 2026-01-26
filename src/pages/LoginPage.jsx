// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuthStore } from '../store/useAuthStore';
// import { Mail, Lock, Loader2, Eye, EyeClosed } from 'lucide-react';
// import { axiosInstance } from '../lib/axios';
// import { toast } from 'sonner';

// const LoginPage = () => {
//   const {
//     isLoggingIn,
//     setIsLoggingIn,
//     setAuthUser
//   } = useAuthStore();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const [seePassword, setSeePassword] = useState(true);

//   const toggleSeePassword = () => {
//     setSeePassword(!seePassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoggingIn(true);

//     try {
//       const res = await axiosInstance.post('/auth/login', formData);
//       toast.success('Logged in successfully!');
//       setTimeout(() => {
//         setAuthUser(res.data.oldUser);
//       }, 1000);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Internal Server Error!');
//     } finally {
//       setIsLoggingIn(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-lg p-8 shadow-xl">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-serif text-white mb-2">Welcome back</h1>
//           <p className="text-[#8b949e]">Sign in to continue.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
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
//                 {seePassword ? <Eye /> : <EyeClosed  />}
//               </button>
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={isLoggingIn}
//             className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3 rounded-md flex items-center justify-center disabled:opacity-50"
//           >
//             {isLoggingIn ? <Loader2 className="animate-spin" /> : "Sign in"}
//           </button>
//         </form>

//         <p className="text-center mt-6 text-[#8b949e] text-sm">
//           New to Tagore? <Link to="/signup" className="text-[#58a6ff] hover:underline">Create an account</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Loader2, ArrowRight, Moon, Sun } from 'lucide-react';

const LoginPage = () => {
  const { isLoggingIn, login } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen bg-(--surface-primary) flex flex-col items-center justify-center p-6 transition-colors duration-500">
      <div className="w-full max-w-md bg-(--card-surface) border border-(--border-subtle) rounded-4xl p-10 shadow-2xl relative">
        <div className="text-center mb-10">
          <img
            src="src/public/withoutBackground.png"
            alt="Tagore Logo"
            className="w-14 h-14 object-contain mx-auto mb-6 drop-shadow-md"
          />
          <h1 className="text-3xl font-bold tracking-tight text-(--text-primary)">Welcome back</h1>
          <p className="text-(--text-secondary) mt-2 font-medium">Continue your scientific journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-(--text-muted) ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)" size={18} />
              <input
                type="email"
                className="w-full bg-(--surface-primary) border border-(--border-subtle) p-4 pl-12 rounded-2xl outline-none focus:border-(--accent-action) transition-all font-medium"
                placeholder="name@institution.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-(--text-muted) ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)" size={18} />
              <input
                type="password"
                className="w-full bg-(--surface-primary) border border-(--border-subtle) p-4 pl-12 rounded-2xl outline-none focus:border-(--accent-action) transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-(--accent-action) text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-(--surface-featured) transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-4"
          >
            {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-(--text-secondary) font-medium">
          New to Tagore? <Link to="/signup" className="text-(--accent-action) font-bold hover:underline">Create an account</Link>
        </p>
      </div>

      {/* CIRCULAR THEME TOGGLE BELOW CARD */}
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="mt-8 p-4 rounded-full bg-(--card-surface) border border-(--border-subtle) text-(--text-secondary) shadow-lg hover:scale-110 transition-all cursor-pointer"
      >
        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
      </button>
    </div>
  );
};

export default LoginPage;