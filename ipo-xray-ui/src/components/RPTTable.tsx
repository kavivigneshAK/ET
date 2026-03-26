import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface RPTData {
  id: string;
  party: string;
  relationship: string;
  type: string;
  amount: number;
  percentRevenue: number;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface Props {
  data: RPTData[];
}

export default function RPTTable({ data }: Props) {
  const getRiskChip = (risk: string) => {
    if (risk === 'HIGH') return <span className="px-2 py-1 bg-danger/10 text-danger border border-danger/20 font-mono text-[10px] rounded shadow-neon-danger flex items-center justify-center w-full max-w-[80px] mx-auto"><AlertTriangle className="w-3 h-3 mr-1" /> HIGH</span>;
    if (risk === 'MEDIUM') return <span className="px-2 py-1 bg-warning/10 text-warning border border-warning/20 font-mono text-[10px] rounded shadow-neon-warning flex items-center justify-center w-full max-w-[80px] mx-auto"><AlertCircle className="w-3 h-3 mr-1" /> MED</span>;
    return <span className="px-2 py-1 bg-success/10 text-success border border-success/20 font-mono text-[10px] rounded flex items-center justify-center w-full max-w-[80px] mx-auto"><CheckCircle2 className="w-3 h-3 mr-1" /> LOW</span>;
  };

  return (
    <div className="overflow-x-auto glass-card rounded-xl border border-white/5 shadow-lg">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-[#0A1320] text-textMuted uppercase font-mono text-[10px] tracking-widest border-b border-primary/20">
          <tr>
            <th className="p-4 font-semibold">Related Party</th>
            <th className="p-4 font-semibold">Relationship</th>
            <th className="p-4 font-semibold">Transaction Type</th>
            <th className="p-4 font-semibold text-right">Amount (Cr)</th>
            <th className="p-4 font-semibold text-right">% Revenue</th>
            <th className="p-4 font-semibold text-center">Risk Level</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-white/[0.03] transition-colors group cursor-default">
              <td className="p-4 font-medium text-textPrimary group-hover:text-primary transition-colors">{row.party}</td>
              <td className="p-4 text-textMuted">{row.relationship}</td>
              <td className="p-4 text-textMuted">{row.type}</td>
              <td className="p-4 text-right font-mono">{row.amount.toLocaleString()}</td>
              <td className="p-4 text-right font-mono text-warning opacity-90">{row.percentRevenue.toFixed(1)}%</td>
              <td className="p-4 align-middle">
                {getRiskChip(row.risk)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
