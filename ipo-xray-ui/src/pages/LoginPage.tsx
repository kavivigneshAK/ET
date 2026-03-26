import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Mail, Lock, User as UserIcon, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface Props {
  isSignup?: boolean;
}

export default function LoginPage({ isSignup = false }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate robust authentication latency
    setTimeout(() => {
      login(email);
      showToast(isSignup ? 'Identity initialized successfully!' : 'Secure connection established!', 'success');
      
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#010308] flex items-center justify-center p-6 relative overflow-hidden -mt-16 pt-16">
      {/* Immersive Cyberpunk BGs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-danger/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-black/40 rounded-full mb-6 border border-white/10 shadow-[0_0_30px_rgba(0,212,255,0.15)] relative">
            <Activity className="w-8 h-8 text-primary drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-display font-bold text-[#E8F4FD] tracking-tight">
            {isSignup ? 'Initialize Credentials' : 'Secure Authorization'}
          </h2>
          <p className="text-[#6B8CAE] mt-2 text-sm">
            {isSignup ? 'Join the algorithmic intelligence network.' : 'Access your forensic intelligence dashboard.'}
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-white/5 border-t-primary/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {isSignup && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-mono text-[#6B8CAE] uppercase tracking-widest mb-1.5 pl-1">Full Identity</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8CAE]" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Satoshi Nakamoto"
                      required={isSignup}
                      className="w-full bg-[#050B18]/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-[#E8F4FD] placeholder:text-[#6B8CAE]/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-mono text-[#6B8CAE] uppercase tracking-widest mb-1.5 pl-1">Transmission Alias</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8CAE]" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="analyst@fund.com"
                  required
                  className="w-full bg-[#050B18]/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-[#E8F4FD] placeholder:text-[#6B8CAE]/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 pl-1 pr-1">
                <label className="block text-xs font-mono text-[#6B8CAE] uppercase tracking-widest">Encryption Key</label>
                {!isSignup && <a href="#" className="text-[10px] text-primary hover:text-white transition-colors uppercase tracking-widest font-mono">Recover</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8CAE]" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#050B18]/60 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-[#E8F4FD] focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-xl tracking-[0.2em]"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-4 rounded-lg font-display font-bold uppercase tracking-widest transition-all mt-6 shadow-lg ${isSubmitting ? 'bg-primary/50 cursor-not-allowed text-black/50' : 'bg-primary hover:bg-[#00e1ff] shadow-neon-cyan text-black hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]'}`}
            >
              {isSubmitting ? 'Executing Handshake...' : (isSignup ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10 opacity-70">
            <span className="px-4 text-[10px] font-mono text-[#6B8CAE] uppercase tracking-widest">Bridging</span>
          </div>

          <button className="w-full mt-6 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium flex items-center justify-center text-[#E8F4FD]">
            <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[#6B8CAE] text-sm">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <a href={isSignup ? '/login' : '/signup'} className="text-primary hover:text-white transition-colors border-b border-primary/30 pb-0.5 ml-1 font-medium tracking-wide">
              {isSignup ? 'Sign In' : 'Sign Up'}
            </a>
          </p>
          
          {isSignup && (
            <div className="mt-8 flex items-start justify-center text-[10px] text-[#6B8CAE] max-w-sm mx-auto bg-[#0A1320] p-4 rounded-lg border border-white/5 shadow-inner">
              <ShieldAlert className="w-5 h-5 mr-3 flex-shrink-0 text-warning" />
              <p className="text-left leading-relaxed">By signing up you explicitly agree to our Operating Terms. This framework provides purely algorithmic logic matrices and does not legally constitute SEBI-registered investment advice.</p>
            </div>
          )}
          {!isSignup && (
             <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#6B8CAE]/40 font-mono">Encrypted payloads are persistently tied to this alias</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
