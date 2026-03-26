import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TickerItem {
  company: string;
  score: number;
}

interface Props {
  items: TickerItem[];
}

export default function TickerTape({ items }: Props) {
  // Duplicate array significantly to create an infinite seamless hardware scroll effect
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-[#00040A] border-y border-white/5 py-3 flex items-center relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
      {/* Left and Right Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#00040A] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#00040A] to-transparent z-10 pointer-events-none"></div>
      
      <motion.div 
        className="flex whitespace-nowrap items-center"
        animate={{ x: [0, -2000] }}
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: 40 
        }}
      >
        {duplicatedItems.map((item, idx) => {
          const isHighRisk = item.score > 55;
          return (
            <div key={`${item.company}-${idx}`} className="flex items-center mx-10">
              <span className="font-mono text-xs font-semibold text-textMuted mr-2 uppercase tracking-widest">{item.company}</span>
              <span className={`font-mono text-sm font-bold flex items-center ${isHighRisk ? 'text-danger drop-shadow-[0_0_5px_rgba(255,69,96,0.3)]' : 'text-success drop-shadow-[0_0_5px_rgba(0,227,150,0.3)]'}`}>
                {item.score}
                {isHighRisk ? <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 ml-0.5" />}
              </span>
              <div className="h-1 w-1 bg-white/20 rounded-full mx-10"></div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
