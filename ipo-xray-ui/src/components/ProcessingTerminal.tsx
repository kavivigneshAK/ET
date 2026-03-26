import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface Stage {
  id: string;
  name: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  detail?: string;
}

interface Props {
  stages: Stage[];
  progress: number;
}

export default function ProcessingTerminal({ stages, progress }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [stages]);

  return (
    <div className="glass-card rounded-lg overflow-hidden border border-primary/30 shadow-neon-cyan max-w-xl mx-auto w-full">
      <div className="bg-black/80 px-4 py-2.5 border-b border-primary/20 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-danger"></div>
          <div className="w-3 h-3 rounded-full bg-warning"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
        </div>
        <span className="font-mono text-[10px] text-primary uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,212,255,0.8)]">IPO_XRAY_PIPELINE.sh</span>
      </div>

      <div className="h-0.5 bg-black/50 w-full relative">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_#00D4FF]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div ref={containerRef} className="p-6 font-mono text-sm space-y-4 bg-[#02050A] overflow-y-auto max-h-[350px] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {stages.map((stage, idx) => (
          <motion.div 
            key={stage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-start ${stage.status === 'pending' ? 'opacity-30' : 'opacity-100'}`}
          >
            <span className="mr-3 mt-0.5 flex-shrink-0">
              {stage.status === 'success' && <CheckCircle2 className="w-4 h-4 text-success drop-shadow-[0_0_5px_rgba(0,227,150,0.5)]" />}
              {stage.status === 'loading' && <Loader2 className="w-4 h-4 text-primary animate-spin drop-shadow-[0_0_5px_rgba(0,212,255,0.5)]" />}
              {stage.status === 'error' && <AlertCircle className="w-4 h-4 text-danger drop-shadow-[0_0_5px_rgba(255,69,96,0.5)]" />}
              {stage.status === 'pending' && <div className="w-4 h-4 rounded-full border border-textMuted/50" />}
            </span>
            <div className="flex-1">
              <p className={`${stage.status === 'loading' ? 'text-primary animate-pulse' : 'text-textPrimary'} transition-colors`}>
                {stage.name}
              </p>
              {stage.detail && (stage.status === 'loading' || stage.status === 'success' || stage.status === 'error') && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`text-xs mt-1 ${stage.status === 'error' ? 'text-danger' : 'text-textMuted'}`}
                >
                  <span className="text-primary mr-2 opacity-60">↳</span> 
                  {stage.detail}
                </motion.p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
