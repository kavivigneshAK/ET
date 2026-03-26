import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Building2 } from 'lucide-react';
import RiskScoreGauge from './RiskScoreGauge';

interface Props {
  company: string;
  sector: string;
  date: string;
  score: number;
  flagsCount: number;
  onClick?: () => void;
}

export default function IPOCard({ company, sector, date, score, flagsCount, onClick }: Props) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="glass-card p-5 rounded-xl cursor-pointer group hover:shadow-neon-cyan transition-all duration-300 border-t border-white/10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="pr-4">
          <h3 className="font-display font-bold text-xl text-textPrimary mb-2 group-hover:text-primary transition-colors flex items-center">
            <Building2 className="w-4 h-4 mr-2 text-textMuted group-hover:text-primary" />
            {company}
          </h3>
          <span className="px-2 py-1 text-[10px] uppercase tracking-widest font-mono bg-black/40 border border-white/5 rounded text-primary border-primary/20">
            {sector}
          </span>
        </div>
        <div className="scale-75 origin-top-right transform -mt-4 -mr-4 drop-shadow-xl">
          <RiskScoreGauge score={score} size={80} />
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center text-xs text-textMuted font-mono">
          <Clock className="w-3 h-3 mr-1.5 opacity-70" />
          {date}
        </div>
        <div className="flex items-center text-xs bg-danger/10 text-danger px-3 py-1.5 rounded border border-danger/20 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
          {flagsCount} Flags
        </div>
      </div>
    </motion.div>
  );
}
