import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Cpu, Activity } from 'lucide-react';
import TickerTape from '../components/TickerTape';

const MOCK_TICKERS = [
  { company: 'PAYTM', score: 82 },
  { company: 'ZOMATO', score: 65 },
  { company: 'NYKAA', score: 45 },
  { company: 'LIC', score: 32 },
  { company: 'DELHIVERY', score: 71 },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#02050A] overflow-hidden">
      {/* Navbar Minimal */}
      <nav className="fixed w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg tracking-wider">IPO_XRAY</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-mono text-textMuted">
            <a href="#how" className="hover:text-primary transition-colors">How it Works</a>
            <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto grid-bg min-h-[80vh] flex flex-col justify-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen -z-10"></div>
        
        <div className="text-center z-10 max-w-4xl mx-auto relative mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            <span className="px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest shadow-neon-cyan leading-none">82% Precision Model</span>
            <span className="px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest leading-none">5-Min Analysis</span>
            <span className="px-3 py-1.5 rounded-full border border-success/30 bg-success/10 text-success text-[10px] font-mono uppercase tracking-widest leading-none">SEBI Compliance Checked</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-6xl md:text-8xl font-display font-bold textPrimary tracking-tight mb-6 text-glow"
          >
            IPO X-Ray
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-textMuted max-w-2xl mx-auto mb-12 font-medium"
          >
            GenAI Forensic Intelligence for Retail Investors. Upload a 500-page RHP and extract algorithmic risk matrices in exactly 5 minutes.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button 
              onClick={() => navigate('/analyze')}
              className="px-8 py-4 bg-primary text-black font-display font-bold uppercase tracking-wider rounded-md hover:bg-[#00e1ff] transition-all shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] flex items-center group w-full sm:w-auto justify-center"
            >
              Analyze an IPO
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3.5 bg-transparent text-textPrimary font-mono text-sm uppercase tracking-widest rounded-md hover:bg-white/5 border border-white/10 transition-colors w-full sm:w-auto"
            >
              See Sample Report
            </button>
          </motion.div>
        </div>
      </section>

      <TickerTape items={MOCK_TICKERS} />

      {/* Stats Bar */}
      <section className="border-b border-white/5 py-16 bg-[#030812]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="text-center md:px-8">
            <h4 className="text-5xl font-display font-bold text-primary mb-3 drop-shadow-[0_0_10px_rgba(0,212,255,0.4)]">500+</h4>
            <p className="text-textMuted font-mono text-xs uppercase tracking-widest">RHPs Analyzed</p>
          </div>
          <div className="text-center md:px-8 pt-8 md:pt-0">
            <h4 className="text-5xl font-display font-bold text-success mb-3 drop-shadow-[0_0_10px_rgba(0,227,150,0.4)]">₹500Cr</h4>
            <p className="text-textMuted font-mono text-xs uppercase tracking-widest">Retail Losses Prevented</p>
          </div>
          <div className="text-center md:px-8 pt-8 md:pt-0">
            <h4 className="text-5xl font-display font-bold text-warning mb-3 drop-shadow-[0_0_10px_rgba(255,184,0,0.4)]">5 Min</h4>
            <p className="text-textMuted font-mono text-xs uppercase tracking-widest text-[#6B8CAE]">Processing Time (vs 40+ Hrs)</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Forensic Pipeline</h2>
          <p className="text-textMuted text-lg">How we extract truth from 500 pages of legal jargon.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t border-dashed border-primary/20 -z-10"></div>
          
          <div className="glass-card p-8 rounded-2xl text-center border-t-2 border-t-white/10 hover:border-t-primary/50 transition-colors group">
            <div className="w-20 h-20 mx-auto bg-background/50 border border-white/5 rounded-full flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-shadow">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">1. Upload RHP</h3>
            <p className="text-textMuted text-sm leading-relaxed">Drop any local Indian IPO Draft Red Herring Prospectus PDF directly into our secure ingestion zone.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl text-center border-t-2 border-t-white/10 hover:border-t-warning/50 transition-colors group">
            <div className="w-20 h-20 mx-auto bg-background/50 border border-white/5 rounded-full flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(255,184,0,0.2)] transition-shadow">
              <Cpu className="w-10 h-10 text-warning" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">2. GenAI Engine</h3>
            <p className="text-textMuted text-sm leading-relaxed">Our pipeline parses millions of tokens of dense context to detect nested related party transactions and obscured debt.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl text-center border-t-2 border-t-white/10 hover:border-t-success/50 transition-colors group">
            <div className="w-20 h-20 mx-auto bg-background/50 border border-white/5 rounded-full flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(0,227,150,0.2)] transition-shadow">
              <ShieldCheck className="w-10 h-10 text-success" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">3. Risk Matrix</h3>
            <p className="text-textMuted text-sm leading-relaxed">Instantly receive a deterministic risk score, automated regulatory checks, and red flags mapped to exact pages.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#010205]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6 opacity-30">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-display font-bold tracking-widest text-textPrimary">IPO_XRAY_OS</span>
          </div>
          <p className="text-[10px] font-mono text-textMuted mb-2 uppercase tracking-widest">Not SEBI-Registered Investment Advice</p>
          <p className="text-[10px] text-textMuted/40 max-w-md mx-auto leading-relaxed">v1.2.0 • Financial data heavily reliant on autonomous AI models. Always verify citations manually before making investment decisions.</p>
        </div>
      </footer>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}
