import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PeerData {
  name: string;
  pe: number;
  pb: number;
  evEbitda: number;
  isTarget?: boolean;
}

interface Props {
  data: PeerData[];
  metric: 'pe' | 'pb' | 'evEbitda';
}

export default function PeerComparisonChart({ data, metric }: Props) {
  const formatMetricName = () => {
    if (metric === 'pe') return 'P/E Ratio';
    if (metric === 'pb') return 'P/B Ratio';
    return 'EV/EBITDA';
  };

  return (
    <div className="h-64 w-full p-4 glass-card rounded-xl">
      <h3 className="text-sm font-mono text-textMuted uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
        {formatMetricName()} vs Peers
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B8CAE', fontSize: 11, fontFamily: 'monospace' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B8CAE', fontSize: 11, fontFamily: 'monospace' }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              contentStyle={{ backgroundColor: '#0D1B2A', borderColor: 'rgba(0,212,255,0.2)', borderRadius: '8px', color: '#E8F4FD', fontFamily: 'Inter' }}
              itemStyle={{ color: '#00D4FF', fontWeight: 'bold' }}
            />
            <Bar dataKey={metric} name={formatMetricName()} radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isTarget ? '#FFB800' : '#00D4FF'} 
                  style={{ filter: `drop-shadow(0 0 6px ${entry.isTarget ? '#FFB800' : '#00D4FF'}80)` }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
