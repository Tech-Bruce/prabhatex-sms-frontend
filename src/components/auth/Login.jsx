import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, Shield, Check } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Default admin login logic
    if (email === 'admin@prabhatex.in' && password === 'admin123') {
      if (onLogin) onLogin();
    } else if (email === 'admin@prabhatex.com' && password === 'admin123') {
      if (onLogin) onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 
          className="text-3xl font-semibold mb-2 text-[#1C2541]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Welcome back
        </h2>
        <p className="text-slate-500 text-sm">Sign in to your admin account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#1C2541]">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              required
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-3 pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B8863E]/50 focus:border-[#B8863E] transition-all"
              placeholder="admin@prabhatex.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#1C2541]">Password</label>
            <a href="#" className="text-xs text-[#8c1a1a] hover:text-[#6B0000] font-medium transition-colors">Forgot password?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-3 pl-11 pr-11 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B8863E]/50 focus:border-[#B8863E] transition-all tracking-wider"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-1 pb-2">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
              rememberMe ? 'bg-[#6B0000] border-[#6B0000] text-white' : 'bg-white border-slate-300 text-transparent'
            }`}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </button>
          <span className="text-sm font-medium text-slate-700 cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
            Remember me
          </span>
        </div>

        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-[#6B0000] hover:bg-[#520000] text-white font-medium py-3.5 px-4 rounded-lg transition-all duration-200 shadow-md shadow-[#6B0000]/20"
        >
          Sign In <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-2 text-slate-400">
        <Shield className="h-4 w-4 text-[#D4AF37]" />
        <span className="text-xs font-medium uppercase tracking-wider">Secure admin access</span>
      </div>
    </div>
  );
};

export default Login;
