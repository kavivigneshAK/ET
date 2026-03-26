import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, ChevronDown } from 'lucide-react';

interface Props {
  severity: 'Critical' | 'Moderate' | 'Watch';
  title: string;
  explanation: string;
  pageCitation: string;
  implication: string;
}

export default function RedFlagCard({ severity, title, explanation, pageCitation, implication }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const getSeverityConfig = () => {
    switch (severity) {
      case 'Critical':
        return { 
          icon: <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0" />, 
          border: 'border-danger/40', 
          bg: 'hover:bg-danger/5 shadow-[0_0_15px_rgba(255,69,96,0.05)]' 
        };
      case 'Moderate':
        return { 
          icon: <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />, 
          border: 'border-warning/40', 
          bg: 'hover:bg-warning/5 shadow-[0_0_15px_rgba(255,184,0,0.05)]' 
        };
      case 'Watch':
        return { 
          icon: <Info className="w-5 h-5 text-primary flex-shrink-0" />, 
          border: 'border-primary/40', 
          bg: 'hover:bg-primary/5 shadow-[0_0_15px_rgba(0,212,255,0.05)]' 
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <div 
      className={`glass-card rounded-xl border-l-4 ${config.border} p-4 mb-4 transition-all duration-300 ${config.bg} cursor-pointer group`} 
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 pr-4">
          {config.icon}
          <h3 className="font-display font-semibold text-lg text-textPrimary leading-tight group-hover:text-glow transition-all">{title}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-5 h-5 text-textMuted mt-0.5" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-1 border-t border-white/5 mt-3">
              <p className="text-textPrimary/80 text-sm leading-relaxed mb-4">{explanation}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-3 sm:gap-0 bg-black/20 p-3 rounded-lg border border-white/5">
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-mono font-medium rounded bg-warning/10 text-warning border border-warning/20 shadow-neon-warning">
                  RHP Page: {pageCitation}
                </span>
                <p className="text-textMuted italic text-xs sm:border-l sm:border-textMuted/30 sm:pl-3 w-full sm:w-2/3 leading-snug">
                  {implication}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
