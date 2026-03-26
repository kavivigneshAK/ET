import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  score: number;
  size?: number;
}

export default function RiskScoreGauge({ score, size = 120 }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    // Small delay before animating the score up
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedScore / 100) * circumference;

  let color = '#00E396'; // Green < 30
  if (score > 30) color = '#FFB800'; // Amber
  if (score > 55) color = '#FF8A00'; // Orange
  if (score > 75) color = '#FF4560'; // Red

  return (
    <div className="relative flex items-center justify-center font-sans" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full overflow-visible">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Animated Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${color}90)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center mt-1">
        <span className="text-3xl font-display font-bold leading-none tracking-tight" style={{ color, textShadow: `0 0 15px ${color}60` }}>
          {animatedScore}
        </span>
        <span className="text-[9px] text-textMuted uppercase tracking-widest mt-1 opacity-80">Risk Score</span>
      </div>
    </div>
  );
}
