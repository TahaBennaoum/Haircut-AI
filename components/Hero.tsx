import React from 'react';
import { Camera, Scissors, Sparkles } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fade-in">
      <div className="mb-6 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75"></div>
        <div className="relative bg-slate-900 p-4 rounded-full border border-slate-700">
          <Scissors className="w-16 h-16 text-purple-400" />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 mb-6 tracking-tight">
        StyleCut AI
      </h1>
      
      <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
        Discover your perfect haircut with the power of AI. 
        We analyze your face shape, features, and hair type to recommend 
        styles that are scientifically proven to suit you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <Camera className="w-8 h-8 text-pink-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">1. Upload Selfie</h3>
          <p className="text-slate-400 text-sm">Take a clear, front-facing photo.</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <Sparkles className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">2. AI Analysis</h3>
          <p className="text-slate-400 text-sm">We detect face shape & features.</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <Scissors className="w-8 h-8 text-amber-400 mb-4 mx-auto" />
          <h3 className="font-semibold text-white mb-2">3. Get Styled</h3>
          <p className="text-slate-400 text-sm">Try on new looks instantly.</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-purple-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-purple-500"
      >
        Find My Style
        <div className="absolute -inset-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
      </button>
    </div>
  );
};

export default Hero;