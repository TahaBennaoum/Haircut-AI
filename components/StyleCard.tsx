import React from 'react';
import { HairstyleRecommendation } from '../types';
import { Scissors, Clock, Sparkles, Droplet } from 'lucide-react';

interface StyleCardProps {
  style: HairstyleRecommendation;
  onTryOn: (style: HairstyleRecommendation) => void;
  isSelected?: boolean;
}

const StyleCard: React.FC<StyleCardProps> = ({ style, onTryOn, isSelected }) => {
  return (
    <div className={`
      relative bg-slate-800 rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col h-full
      ${isSelected ? 'border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-750'}
    `}>
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{style.name}</h3>
          <span className={`
            px-2 py-1 rounded text-xs font-semibold
            ${style.maintenanceLevel === 'Low' ? 'bg-green-500/20 text-green-400' : 
              style.maintenanceLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}
          `}>
            {style.maintenanceLevel} Maint.
          </span>
        </div>
        
        <p className="text-slate-300 mb-4 text-sm leading-relaxed min-h-[60px]">
          {style.description}
        </p>

        <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
           <h4 className="text-xs font-bold text-purple-300 uppercase mb-2 flex items-center gap-1">
             <Sparkles className="w-3 h-3" /> Why it works
           </h4>
           <p className="text-xs text-slate-400">{style.whyItSuits}</p>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Scissors className="w-3 h-3" /> Styling Tips
            </h4>
            <ul className="text-xs text-slate-400 list-disc list-inside">
              {style.stylingTips.slice(0, 2).map((tip, i) => (
                <li key={i} className="truncate">{tip}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Droplet className="w-3 h-3" /> Key Products
            </h4>
            <div className="flex flex-wrap gap-1">
              {style.products.slice(0, 3).map((prod, i) => (
                <span key={i} className="text-[10px] bg-slate-700 px-2 py-1 rounded-full text-slate-300">
                  {prod}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700 mt-auto">
        <button
          onClick={() => onTryOn(style)}
          className="w-full py-2.5 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          Virtual Try-On
        </button>
      </div>
    </div>
  );
};

export default StyleCard;