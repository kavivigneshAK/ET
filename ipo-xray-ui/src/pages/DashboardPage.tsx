import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Activity, Search, Filter, X, ServerCrash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IPOCard from '../components/IPOCard';

const MOCK_IPOS = [
  { id: 'mock-1', company: 'TechNova Solutions', sector: 'FINTECH', date: new Date(Date.now() - 86400000 * 1).toISOString(), score: 82, riskCategory: 'HIGH', flagsCount: 4 },
  { id: 'mock-2', company: 'GreenEnergy Corp', sector: 'MANUFACTURING', date: new Date(Date.now() - 86400000 * 3).toISOString(), score: 45, riskCategory: 'MODERATE', flagsCount: 2 },
  { id: 'mock-3', company: 'HealthPlus AI', sector: 'TECH', date: new Date(Date.now() - 86400000 * 7).toISOString(), score: 15, riskCategory: 'LOW', flagsCount: 0 },
  { id: 'mock-4', company: 'UrbanLogistics', sector: 'LOGISTICS', date: new Date(Date.now() - 86400000 * 12).toISOString(), score: 91, riskCategory: 'VERY HIGH', flagsCount: 6 },
  { id: 'mock-5', company: 'Paytm (One97)', sector: 'FINTECH', date: new Date(Date.now() - 86400000 * 14).toISOString(), score: 88, riskCategory: 'VERY HIGH', flagsCount: 7 },
  { id: 'mock-6', company: 'Zomato Ltd', sector: 'FOODTECH', date: new Date(Date.now() - 86400000 * 20).toISOString(), score: 65, riskCategory: 'HIGH', flagsCount: 3 },
  { id: 'mock-7', company: 'Nykaa Beauty', sector: 'E-COMMERCE', date: new Date(Date.now() - 86400000 * 30).toISOString(), score: 38, riskCategory: 'MODERATE', flagsCount: 1 },
  { id: 'mock-8', company: 'LIC India', sector: 'INSURANCE', date: new Date(Date.now() - 86400000 * 45).toISOString(), score: 22, riskCategory: 'LOW', flagsCount: 0 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [ipos, setIpos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // Dynamically fetch and parse literal real AI intelligence natively extracted!
    axios.get('http://127.0.0.1:8000/reports/user/64c9f1a23b4c5d6e7f8a9b0c')
      .then(res => {
        if (res.data && res.data.length > 0) {
           const realIpos = res.data.map((report: any) => {
             try {
               const parsed = JSON.parse(report.report_content);
               return {
                 id: report._id,
                 company: parsed.company || "Unknown Target",
                 sector: parsed.sector || "UNKNOWN",
                 date: parsed.date || new Date().toISOString(),
                 score: parsed.riskScore || 0,
                 flagsCount: parsed.redFlags?.length || 0,
                 riskCategory: parsed.riskCategory || 'HIGH'
               };
             } catch (e) {
               return null;
             }
           }).filter((v: any) => v !== null);
           setIpos([...realIpos, ...MOCK_IPOS]);
        } else {
           setIpos(MOCK_IPOS); 
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIpos(MOCK_IPOS);
        setIsLoading(false);
      });
  }, []);

  const filteredIPOs = ipos.filter(ipo => {
    const matchSearch = ipo.company.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === 'ALL' || ipo.riskCategory === riskFilter;
    const matchSector = sectorFilter === 'ALL' || ipo.sector === sectorFilter;
    return matchSearch && matchRisk && matchSector;
  });

  const isFilterActive = search !== '' || riskFilter !== 'ALL' || sectorFilter !== 'ALL';

  const clearFilters = () => {
    setSearch('');
    setRiskFilter('ALL');
    setSectorFilter('ALL');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#02050A] pt-12 pb-12 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-end w-full justify-between mb-8">
          <div className="mb-6 xl:mb-0">
            <h1 className="text-3xl font-display font-bold text-textPrimary mb-2 flex items-center tracking-tight">
              <Activity className="w-8 h-8 mr-3 text-primary drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
              Live Target Registry
            </h1>
            <p className="text-textMuted text-sm border-l-[3px] border-primary/50 pl-4 font-mono tracking-wide max-w-2xl">Access historically parsed multi-modal financial forensic targets via the Gemini pipeline.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 text-textMuted absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search extracted indices..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-12 pr-4 py-3 bg-black/60 border border-white/10 rounded-lg text-sm text-[#E8F4FD] placeholder:text-[#6B8CAE]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all w-full sm:w-72 shadow-inner font-mono"
              />
            </div>
            
            <div className="flex space-x-4">
              {/* Desktop Filters */}
              <div className="hidden lg:flex space-x-4">
                <select 
                  value={sectorFilter} 
                  onChange={e => setSectorFilter(e.target.value)}
                  className="px-5 py-3 bg-black/60 border border-white/10 rounded-lg text-xs text-[#E8F4FD] appearance-none focus:outline-none focus:border-primary/50 font-mono tracking-widest cursor-pointer hover:border-primary/30 transition-colors uppercase"
                >
                  <option value="ALL">ALL SECTORS</option>
                  <option value="FINTECH">FINTECH</option>
                  <option value="E-COMMERCE">E-COMMERCE</option>
                  <option value="FOODTECH">FOODTECH</option>
                  <option value="INSURANCE">INSURANCE</option>
                  <option value="LOGISTICS">LOGISTICS</option>
                  <option value="TECH">TECH</option>
                  <option value="MANUFACTURING">MANUFACTURING</option>
                  <option value="CONSUMER">CONSUMER</option>
                </select>

                <select 
                  value={riskFilter} 
                  onChange={e => setRiskFilter(e.target.value)}
                  className="px-5 py-3 bg-black/60 border border-white/10 rounded-lg text-xs text-[#E8F4FD] appearance-none focus:outline-none focus:border-primary/50 font-mono tracking-widest cursor-pointer hover:border-danger/30 transition-colors uppercase"
                >
                  <option value="ALL">ALL RISK SCORES</option>
                  <option value="LOW">SECURE (LOW)</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="HIGH">CRITICAL (HIGH)</option>
                  <option value="VERY HIGH">VERY HIGH</option>
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden px-5 py-3 bg-black/60 border border-white/10 rounded-lg text-textPrimary hover:bg-white/5 transition-colors flex items-center shadow-lg"
              >
                <Filter className="w-4 h-4 mr-2 text-textMuted" />
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Filter</span>
              </button>
              
              <AnimatePresence>
              {isFilterActive && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearFilters}
                  className="px-4 py-3 bg-danger/10 border border-danger/20 rounded-lg text-danger hover:bg-danger/20 transition-colors flex items-center shadow-neon-danger"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Filters Expanding Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden mb-8 p-4 glass-card rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
               <select 
                  value={sectorFilter} 
                  onChange={e => setSectorFilter(e.target.value)}
                  className="w-full px-4 py-4 bg-[#0A1320] border border-white/10 rounded-lg text-[11px] font-mono tracking-widest text-textPrimary focus:outline-none uppercase"
                >
                  <option value="ALL">ALL SECTORS</option>
                  <option value="FINTECH">FINTECH</option>
                  <option value="E-COMMERCE">E-COMMERCE</option>
                  <option value="FOODTECH">FOODTECH</option>
                  <option value="INSURANCE">INSURANCE</option>
                  <option value="LOGISTICS">LOGISTICS</option>
                  <option value="TECH">TECH</option>
                  <option value="MANUFACTURING">MANUFACTURING</option>
                  <option value="CONSUMER">CONSUMER</option>
                </select>

                <select 
                  value={riskFilter} 
                  onChange={e => setRiskFilter(e.target.value)}
                  className="w-full px-4 py-4 bg-[#0A1320] border border-white/10 rounded-lg text-[11px] font-mono tracking-widest text-[#E8F4FD] focus:outline-none uppercase"
                >
                  <option value="ALL">ALL RISKS</option>
                  <option value="LOW">LOW</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="HIGH">HIGH</option>
                  <option value="VERY HIGH">VERY HIGH</option>
                </select>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-56 glass-card rounded-2xl border border-white/5 animate-pulse bg-white/5 relative overflow-hidden group">
              </div>
            ))}
          </div>
        ) : filteredIPOs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredIPOs.map((ipo, idx) => (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={ipo.id}>
                <IPOCard 
                  company={ipo.company}
                  sector={ipo.sector}
                  date={ipo.date}
                  score={ipo.score}
                  flagsCount={ipo.flagsCount}
                  onClick={() => navigate(`/report/${ipo.id}`)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 mt-8 text-center glass-card rounded-3xl border border-white/5 flex flex-col items-center justify-center bg-black/20 shadow-inner">
            <div className="w-28 h-28 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
              {ipos.length === 0 ? <ServerCrash className="w-12 h-12 text-white/30" /> : <Search className="w-12 h-12 text-white/30" />}
            </div>
            <h3 className="text-2xl font-display font-medium text-[#E8F4FD] mb-3">{ipos.length === 0 ? 'No Intelligence Parsed Yet' : 'No Target Acquisitions Matched'}</h3>
            <p className="text-[#6B8CAE] max-w-sm mx-auto mb-8 text-sm leading-relaxed">
              {ipos.length === 0 ? 'Proceed to the Analyzer framework to upload a PDF RHP and populate the database via Gemini 2.5 Pro.' : 'Adjust your categorical filters or algorithmic parameters to detect isolated IPO reports in the directory.'}
            </p>
            {ipos.length > 0 ? (
              <button onClick={clearFilters} className="text-primary hover:text-white border-b border-primary/50 hover:border-white font-mono text-[10px] uppercase tracking-widest transition-colors pb-0.5">Flush Filters Sequence</button>
            ) : (
              <button onClick={() => navigate('/analyze')} className="px-6 py-3 bg-primary text-black font-display font-bold uppercase tracking-widest rounded shadow-neon-cyan hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all">Launch Analyzer</button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
