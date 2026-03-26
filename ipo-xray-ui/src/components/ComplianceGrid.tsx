import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ComplianceItem {
  id: string;
  regulation: string;
  description: string;
  status: 'COMPLIANT' | 'AMBIGUOUS' | 'MISSING';
  notes?: string;
}

interface Props {
  items: ComplianceItem[];
}

export default function ComplianceGrid({ items }: Props) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return { icon: <CheckCircle2 className="w-5 h-5 text-success" />, color: 'border-success/30', bg: 'bg-success/5 text-success' };
      case 'MISSING': return { icon: <XCircle className="w-5 h-5 text-danger" />, color: 'border-danger/40', bg: 'bg-danger/10 text-danger shadow-neon-danger' };
      case 'AMBIGUOUS': return { icon: <AlertCircle className="w-5 h-5 text-warning" />, color: 'border-warning/40', bg: 'bg-warning/10 text-warning shadow-neon-warning' };
      default: return { icon: null, color: '', bg: '' };
    }
  };

  const compliantCount = items.filter(i => i.status === 'COMPLIANT').length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <h3 className="font-display font-semibold text-lg text-textPrimary">SEBI ICDR 2018 Verification</h3>
        <div className="flex items-center px-4 py-1.5 glass-card rounded-full border border-primary/20 shadow-[0_0_10px_rgba(0,212,255,0.1)]">
          <span className="font-mono text-xs tracking-widest uppercase text-textMuted mr-3">Score</span>
          <span className="font-display font-bold text-lg text-primary leading-none">{compliantCount}<span className="text-textMuted/40 text-sm">/10</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const config = getStatusConfig(item.status);
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass-card p-5 rounded-xl border-t-2 ${config.color} hover:bg-white/[0.03] transition-colors`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-textMuted bg-black/40 px-2 py-1 rounded border border-white/5">Reg {item.regulation}</span>
                <span className="drop-shadow-lg">{config.icon}</span>
              </div>
              <h4 className="text-sm font-medium text-textPrimary leading-snug mb-3 pr-2">{item.description}</h4>
              
              <div className="flex flex-col space-y-3 mt-auto">
                <span className={`inline-flex self-start px-2 py-1 text-[10px] font-mono rounded ${config.bg} uppercase tracking-wider font-semibold border ${config.color}`}>
                  {item.status}
                </span>
                {item.notes && (
                  <p className="text-[11px] text-textMuted italic border-l border-white/10 pl-3 leading-relaxed mt-2">"{item.notes}"</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
