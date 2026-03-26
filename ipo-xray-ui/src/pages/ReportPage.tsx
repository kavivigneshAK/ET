import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, Download, Share2, ChevronLeft, Menu, X, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import RiskScoreGauge from '../components/RiskScoreGauge';
import RedFlagCard from '../components/RedFlagCard';
import FinancialTable from '../components/FinancialTable';
import RPTTable from '../components/RPTTable';
import ComplianceGrid from '../components/ComplianceGrid';
import PeerComparisonChart from '../components/PeerComparisonChart';
import { useToast } from '../contexts/ToastContext';

const MOCK_REPORT_DATA = {
  company: "MockCorp Industries",
  sector: "FINTECH",
  issueSize: "₹1,250 Cr",
  promoterStake: "74.5%",
  verdict: "HIGH RISK - AVOID",
  riskScore: 82,
  riskCategory: "HIGH",
  executiveSummary: "Company exhibits severe working capital stress, inflated margins compared to peers, and complex related-party transactions routing funds to promoter entities. High dependency on two clients poses concentration risk.",
  redFlags: [
    { severity: 'Critical', title: 'Auditor Qualification', explanation: 'Statutory auditor cited inability to verify ₹145 Cr of inventory.', pageCitation: 'Page 112', implication: 'Reported profits may be artificially inflated.' },
    { severity: 'Critical', title: 'Promoter Pledge', explanation: '90% of promoter stake is pledged.', pageCitation: 'Page 40', implication: 'High risk of forced selling causing stock crash.' },
    { severity: 'Watch', title: 'Negative Cash Flow', explanation: 'Operating cash flow is consistently negative over 3 years.', pageCitation: 'Page 68', implication: 'Aggressive revenue recognition bypassing actual cash generation.' }
  ],
  financials: [
    { year: 'FY22', revenue: 450, ebitdaMargin: 8.5, pat: 12, debtEquity: 1.5 },
    { year: 'FY23', revenue: 680, ebitdaMargin: 12.2, pat: 45, debtEquity: 1.8 },
    { year: 'FY24', revenue: 1120, ebitdaMargin: 18.5, pat: 115, debtEquity: 2.4 }
  ],
  rpts: [
    { id: '1', party: 'MockVentures LLP', relationship: 'Promoter Entity', type: 'Unsecured Loan', amount: 85, percentRevenue: 7.5, risk: 'HIGH' },
    { id: '2', party: 'Alpha Trading', relationship: 'Director Relative', type: 'Purchases', amount: 120, percentRevenue: 10.7, risk: 'MEDIUM' }
  ],
  compliance: [
    { id: '1', regulation: 'Reg 16', description: 'Promoter Lock-in 20% for 18 months', status: 'COMPLIANT', notes: 'Clearly stated' },
    { id: '2', regulation: 'Reg 7', description: 'GCP within 25% of issue', status: 'AMBIGUOUS', notes: 'Stated as 24.5% but deployment unclear' },
    { id: '3', regulation: 'Reg 41', description: 'Monitoring Agency named', status: 'MISSING', notes: 'No agency appointed despite issue > 100Cr' }
  ],
  peers: [
    { name: 'MockCorp', pe: 85.2, pb: 12.4, evEbitda: 45.1, isTarget: true },
    { name: 'Peer A (Listed)', pe: 42.1, pb: 6.2, evEbitda: 22.5 },
    { name: 'Peer B (Listed)', pe: 38.5, pb: 5.8, evEbitda: 18.2 }
  ]
};

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('summary');
  const [isExporting, setIsExporting] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id?.startsWith('mock-')) {
      setReportData(MOCK_REPORT_DATA);
      setIsLoading(false);
      return;
    }

    // Dynamic Fetch of REAL JSON output by Gemini
    axios.get(`http://127.0.0.1:8000/reports/${id}`)
      .then(res => {
         try {
           const parsed = JSON.parse(res.data.report_content);
           setReportData(parsed);
         } catch (e) {
           showToast("Invalid JSON schema detected from AI Engine. Falling back to Mock DB.", "error");
           setReportData(MOCK_REPORT_DATA);
         }
         setIsLoading(false);
      })
      .catch(err => {
         console.error(err);
         showToast("Database fetch failure. Model logic disjointed. Rendering Mock Architecture.", "error");
         setReportData(MOCK_REPORT_DATA);
         setIsLoading(false);
      });
  }, [id, showToast]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['summary', 'red-flags', 'financials', 'rpt', 'compliance', 'valuation'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveTab(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsBottomSheetOpen(false);
    }
  };

  const exportPDF = async () => {
    const reportElement = document.getElementById('report-content');
    if (!reportElement) return;
    
    setIsExporting(true);
    showToast('Compiling analytical vectors into PDF format...', 'info');
    
    try {
      const canvas = await html2canvas(reportElement, {
        backgroundColor: '#050B18',
        scale: 2,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`IPO_XRay_Report_${reportData?.company?.replace(/\s+/g, '_') || 'Analysis'}.pdf`);
      showToast('PDF Export Successfully Completed', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error generating PDF render payload.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const shareReport = async () => {
    const shareUrl = `${window.location.origin}/report/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Secure intelligence link copied to clipboard!', 'success');
    } catch {
      showToast('Failed to write to clipboard protocol.', 'error');
    }
  };

  const navItems = [
    { id: 'summary', label: '📊 Exec Summary' },
    { id: 'red-flags', label: `🚨 Red Flags (${reportData?.redFlags?.length || 0})` },
    { id: 'financials', label: '💰 Financial Health' },
    { id: 'rpt', label: '🔗 Related Party Tx' },
    { id: 'compliance', label: '📋 SEBI Checks' },
    { id: 'valuation', label: '📈 Valuation Metrics' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#02050A] flex flex-col items-center justify-center p-6">
        <Activity className="w-12 h-12 text-primary animate-pulse drop-shadow-lg mb-6" />
        <h2 className="text-xl font-display font-medium tracking-widest uppercase mb-2">Decrypting Datastream</h2>
        <p className="font-mono text-[#6B8CAE] text-xs">Awaiting LLM literal JSON payloads from DB...</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-[#02050A] flex flex-col items-center justify-center p-6">
        <AlertTriangle className="w-16 h-16 text-danger mb-6" />
        <h2 className="text-2xl font-display font-bold tracking-tight text-[#E8F4FD] mb-2">Invalid Schema Payload</h2>
        <p className="text-[#6B8CAE] text-sm text-center max-w-md">The report generated did not contain a strict functional JSON topology. Please re-run the pipeline explicitly using the new prompt matrix.</p>
        <button onClick={() => navigate('/analyze')} className="mt-8 px-6 py-3 border border-primary/50 text-primary font-mono text-[10px] uppercase tracking-widest hover:bg-primary/10 rounded-md">Return to Analyzer</button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#02050A] text-textPrimary selection:bg-primary/30 pb-24 relative">
      <div className="w-full border-b border-white/5 bg-[#03060D] h-12 flex items-center px-6 sticky top-16 z-40">
        <button onClick={() => navigate('/dashboard')} className="flex items-center font-mono text-[10px] tracking-widest uppercase text-textMuted hover:text-primary transition-colors border-r border-white/10 pr-6 mr-6">
          <ChevronLeft className="w-4 h-4 mr-1" /> Dashboard
        </button>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-display font-medium tracking-widest text-[#E8F4FD] text-[11px] uppercase">RHP_JSON::{reportData.company}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto pt-10 px-6 flex flex-col md:flex-row gap-8 relative">
        {/* Sticky Sidebar FOR DESKTOP */}
        <div className="hidden md:block w-72 flex-shrink-0">
          <div className="sticky top-32 glass-card rounded-xl p-5 border border-white/5 shadow-2xl">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#6B8CAE] mb-6 px-3">JSON DOM Navigation</h3>
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.id}>
                  <button 
                    onClick={() => scrollTo(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === item.id ? 'bg-primary/10 text-primary border-l-[3px] border-primary shadow-[inset_0_0_15px_rgba(0,212,255,0.1)]' : 'text-[#6B8CAE] hover:bg-white/5 hover:text-textPrimary border-l-[3px] border-transparent'}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Bottom Sheet Navigation Button */}
        <button 
          onClick={() => setIsBottomSheetOpen(true)}
          className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-primary text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)]"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Bottom Sheet Nav */}
        <AnimatePresence>
          {isBottomSheetOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBottomSheetOpen(false)} className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm"></motion.div>
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 w-full bg-[#050B18] border-t border-white/10 z-[60] md:hidden rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                <div className="p-6">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#6B8CAE]">Dynamic Link</h3>
                      <button onClick={() => setIsBottomSheetOpen(false)} className="text-textMuted"><X className="w-5 h-5"/></button>
                   </div>
                   <ul className="space-y-2">
                    {navItems.map(item => (
                      <li key={item.id}>
                        <button 
                          onClick={() => scrollTo(item.id)}
                          className={`w-full text-left px-4 py-4 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-white/5 text-[#E8F4FD] hover:bg-white/10 border border-transparent'}`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Dynamic DOM Matrix Layer */}
        <div id="report-content" className="flex-1 space-y-20 min-w-0 bg-[#02050A] p-2 rounded-xl">
          
          <section id="summary" className="scroll-mt-32">
            <h2 className="text-3xl font-display font-bold border-b border-white/10 pb-4 mb-8 text-glow uppercase">{reportData.company} Executive Summary</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-1 glass-card p-6 flex flex-col items-center justify-center rounded-xl border border-white/5 shadow-inner relative overflow-hidden group bg-[#0A1320]">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Activity className="w-48 h-48" />
                </div>
                <RiskScoreGauge score={reportData.riskScore || 0} size={160} />
                <div className="mt-8 w-full text-center z-10 flex flex-col items-center">
                  <span className={`inline-block px-5 py-2 font-display font-bold uppercase tracking-widest rounded-md text-sm border 
                    ${reportData.riskCategory === 'HIGH' || reportData.riskCategory === 'VERY HIGH' ? 'bg-danger/10 text-danger border-danger/30 shadow-neon-danger' : 
                    reportData.riskCategory === 'MODERATE' ? 'bg-warning/10 text-warning border-warning/30 shadow-neon-warning' : 
                    'bg-success/10 text-success border-success/30 shadow-neon-cyan'}`}>
                    {reportData.riskCategory} CATEGORY
                  </span>
                  <span className="text-[10px] font-mono text-[#6B8CAE] mt-3 uppercase tracking-widest">Sector: {reportData.sector}</span>
                </div>
              </div>
              <div className="lg:col-span-2 glass-card p-8 rounded-xl border border-white/5 flex flex-col justify-center shadow-lg bg-[#0A1320]">
                <blockquote className="text-xl text-[#E8F4FD] leading-relaxed font-display border-l-[4px] border-primary/60 pl-6 italic mb-8">
                  "{reportData.executiveSummary}"
                </blockquote>
                <div className="flex justify-between items-center border-t border-white/10 pt-6 mt-auto">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B8CAE]">Issue Size</p>
                    <p className="text-2xl font-bold font-mono text-[#E8F4FD] mt-1.5">{reportData.issueSize || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B8CAE]">Promoter Stake</p>
                    <p className="text-2xl font-bold font-mono text-[#E8F4FD] mt-1.5">{reportData.promoterStake || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B8CAE]">Verdict</p>
                    <p className={`text-xl font-bold font-display mt-1.5 px-4 py-1 rounded inline-block border shadow-neon-danger
                        ${reportData.verdict?.includes('AVOID') ? 'text-danger bg-danger/10 border-danger/20' : 
                          reportData.verdict?.includes('CAUTION') ? 'text-warning bg-warning/10 border-warning/20 shadow-neon-warning' : 
                          'text-success bg-success/10 border-success/20 shadow-neon-cyan'}
                      `}>
                      {reportData.verdict || "UNKNOWN"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="red-flags" className="scroll-mt-32">
            <h2 className="text-2xl font-display font-bold border-b border-primary/30 pb-3 mb-8 flex items-center shadow-[0_1px_10px_rgba(0,212,255,0.05)]">
              <span className="bg-danger/20 border border-danger/50 text-danger px-2.5 py-0.5 rounded text-sm mr-3 font-mono shadow-neon-danger">{reportData.redFlags?.length || 0}</span>
              Algorithmic Red Flags Detected
            </h2>
            <div className="space-y-4">
              {reportData.redFlags?.length > 0 ? (
                 reportData.redFlags.map((flag: any, i: number) => (
                  <RedFlagCard 
                    key={i}
                    severity={flag.severity}
                    title={flag.title}
                    explanation={flag.explanation}
                    pageCitation={flag.pageCitation}
                    implication={flag.implication}
                  />
                 ))
              ) : (
                <div className="p-8 border border-success/30 rounded-xl bg-success/5 text-success font-mono text-sm tracking-wide shadow-inner">
                  [ System Analysis: No significant operational or compliance red flags detected within token context window. Proceeds with optimal trajectory. ]
                </div>
              )}
            </div>
          </section>

          <section id="financials" className="scroll-mt-32">
            <h2 className="text-2xl font-display font-bold border-b border-white/10 pb-3 mb-8">Financial Trajectory Matrix</h2>
            <FinancialTable data={reportData.financials || []} />
          </section>

          <section id="rpt" className="scroll-mt-32">
            <h2 className="text-2xl font-display font-bold border-b border-white/10 pb-3 mb-8">Related Party Connections</h2>
            {reportData.rpts?.length > 0 ? (
               <RPTTable data={reportData.rpts} />
            ) : (
               <p className="font-mono text-[#6B8CAE] text-xs">No explicit irregular related party transactions parsed.</p>
            )}
          </section>

          <section id="compliance" className="scroll-mt-32">
            <ComplianceGrid items={reportData.compliance || []} />
          </section>

          <section id="valuation" className="scroll-mt-32 pb-20">
            <h2 className="text-2xl font-display font-bold border-b border-white/10 pb-3 mb-8">Dynamic Peer Valuations</h2>
            {reportData.peers?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PeerComparisonChart data={reportData.peers} metric="pe" />
                <PeerComparisonChart data={reportData.peers} metric="evEbitda" />
              </div>
            ) : (
              <p className="font-mono text-[#6B8CAE] text-xs">Insufficient sector comparison data extracted by the LLM.</p>
            )}
          </section>

        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-[#010308]/95 backdrop-blur-xl border-t border-primary/20 p-4 z-[70] shadow-[0_-10px_40px_rgba(0,212,255,0.15)]">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6">
          <p className="text-[10px] font-mono text-[#6B8CAE] hidden md:block w-1/3 tracking-widest uppercase">Live JSON Render • Gemini 2.5 Pro Inference Engine</p>
          <div className="flex w-full md:w-auto justify-end space-x-4">
            <button onClick={shareReport} className="flex-1 md:flex-none items-center justify-center flex px-6 py-3 rounded-lg glass-card text-[#E8F4FD] hover:bg-white/10 transition-colors border border-white/20 font-mono text-[11px] uppercase tracking-widest font-semibold hover:border-primary focus:ring-1 focus:ring-primary/50">
              <Share2 className="w-4 h-4 mr-2" /> Share Link
            </button>
            <button disabled={isExporting} onClick={exportPDF} className={`flex-1 md:flex-none items-center justify-center flex px-8 py-3 rounded-lg font-display font-bold uppercase tracking-widest transition-all ${isExporting ? 'bg-primary/50 text-black/50 cursor-not-allowed' : 'bg-primary text-black hover:bg-[#00e1ff] shadow-neon-cyan'}`}>
              {isExporting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Flattening PDF DOM...</> : <><Download className="w-4 h-4 mr-2" /> Export Literal</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
