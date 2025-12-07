import React from 'react';
import { FaceAnalysis } from '../types';
import { CheckCircle2, ScanFace, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisViewProps {
  analysis: FaceAnalysis;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis }) => {
  const data = [
    { name: 'Confidence', value: analysis.confidenceScore },
    { name: 'Uncertainty', value: 100 - analysis.confidenceScore },
  ];
  const COLORS = ['#8b5cf6', '#334155'];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl animate-fade-in">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <ScanFace className="text-purple-400 w-6 h-6" />
        <h2 className="text-xl font-bold text-white">Face Analysis Results</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Face Shape */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
            <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-2">Detected Face Shape</h3>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {analysis.faceShape}
              </span>
              <span className="text-sm text-slate-400">shape</span>
            </div>
            <p className="mt-2 text-slate-300 leading-relaxed">
              {analysis.faceShapeDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-slate-700/30 p-4 rounded-lg">
                <span className="text-xs text-slate-400 uppercase">Jawline</span>
                <p className="text-white font-medium">{analysis.features.jawline}</p>
             </div>
             <div className="bg-slate-700/30 p-4 rounded-lg">
                <span className="text-xs text-slate-400 uppercase">Forehead</span>
                <p className="text-white font-medium">{analysis.features.forehead}</p>
             </div>
             <div className="bg-slate-700/30 p-4 rounded-lg">
                <span className="text-xs text-slate-400 uppercase">Cheekbones</span>
                <p className="text-white font-medium">{analysis.features.cheekbones}</p>
             </div>
             <div className="bg-slate-700/30 p-4 rounded-lg">
                <span className="text-xs text-slate-400 uppercase">Skin Tone</span>
                <p className="text-white font-medium">{analysis.skinTone}</p>
             </div>
          </div>
        </div>

        {/* Stats / Confidence */}
        <div className="flex flex-col justify-center items-center bg-slate-900/30 rounded-xl p-4 border border-slate-700/50">
           <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
             <Activity className="w-4 h-4 text-purple-400" /> AI Confidence
           </h3>
           <div className="w-40 h-40">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={data}
                   cx="50%"
                   cy="50%"
                   innerRadius={40}
                   outerRadius={60}
                   fill="#8884d8"
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                   startAngle={90}
                   endAngle={-270}
                 >
                   {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                 />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="text-center mt-2">
              <span className="text-2xl font-bold text-white">{analysis.confidenceScore}%</span>
              <p className="text-xs text-slate-500">Match Accuracy</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;