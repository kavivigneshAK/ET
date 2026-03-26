import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface FinancialData {
  year: string;
  revenue: number;
  ebitdaMargin: number;
  pat: number;
  debtEquity: number;
}

interface Props {
  data: FinancialData[];
}

export default function FinancialTable({ data }: Props) {
  const getTrendIcon = (current: number, prev: number, inverse: boolean = false) => {
    if (prev === undefined || prev === null) return <Minus className="w-4 h-4 text-textMuted mx-auto" />;
    if (current > prev) return inverse ? <ArrowUpRight className="w-4 h-4 text-danger mx-auto" /> : <ArrowUpRight className="w-4 h-4 text-success mx-auto" />;
    if (current < prev) return inverse ? <ArrowDownRight className="w-4 h-4 text-success mx-auto" /> : <ArrowDownRight className="w-4 h-4 text-danger mx-auto" />;
    return <Minus className="w-4 h-4 text-textMuted mx-auto" />;
  };

  return (
    <div className="overflow-x-auto glass-card rounded-xl border border-white/10 shadow-lg">
      <table className="w-full text-left text-sm">
        <thead className="bg-black/40 text-textMuted uppercase font-mono text-[10px] tracking-wider border-b border-primary/30">
          <tr>
            <th className="p-4 font-semibold">Metric</th>
            {data.map(d => <th key={d.year} className="p-4 font-semibold text-right">{d.year}</th>)}
            <th className="p-4 font-semibold text-center">Trend Focus</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr className="hover:bg-white/[0.03] transition-colors">
            <td className="p-4 font-medium text-textPrimary">Revenue (Cr)</td>
            {data.map(d => <td key={d.year} className="p-4 text-right font-mono">{d.revenue.toLocaleString()}</td>)}
            <td className="p-4">{getTrendIcon(data[data.length-1]?.revenue, data[0]?.revenue)}</td>
          </tr>
          <tr className="hover:bg-white/[0.03] transition-colors">
            <td className="p-4 font-medium text-textPrimary">EBITDA Margin</td>
            {data.map(d => <td key={d.year} className="p-4 text-right font-mono">{d.ebitdaMargin}%</td>)}
            <td className="p-4">{getTrendIcon(data[data.length-1]?.ebitdaMargin, data[0]?.ebitdaMargin)}</td>
          </tr>
          <tr className="hover:bg-white/[0.03] transition-colors">
            <td className="p-4 font-medium text-textPrimary">PAT (Cr)</td>
            {data.map(d => (
              <td key={d.year} className={`p-4 text-right font-mono ${d.pat < 0 ? 'text-danger' : 'text-success/90'}`}>
                {d.pat.toLocaleString()}
              </td>
            ))}
            <td className="p-4">{getTrendIcon(data[data.length-1]?.pat, data[0]?.pat)}</td>
          </tr>
          <tr className="hover:bg-white/[0.03] transition-colors">
            <td className="p-4 font-medium text-textPrimary">D/E Ratio</td>
            {data.map(d => <td key={d.year} className="p-4 text-right font-mono">{d.debtEquity.toFixed(2)}</td>)}
            <td className="p-4">{getTrendIcon(data[data.length-1]?.debtEquity, data[0]?.debtEquity, true)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
