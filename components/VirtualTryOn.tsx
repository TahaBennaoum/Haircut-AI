import React, { useState } from 'react';
import { X, Download, Share2, RefreshCw, MapPin } from 'lucide-react';
import { HairstyleRecommendation } from '../types';

interface VirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  style: HairstyleRecommendation | null;
  originalImage: string;
  generatedImage: string | null;
  isGenerating: boolean;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({
  isOpen, onClose, style, originalImage, generatedImage, isGenerating
}) => {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');

  if (!isOpen || !style) return null;

  const handleShare = async () => {
    if (generatedImage && navigator.share) {
      try {
        const blob = await (await fetch(generatedImage)).blob();
        const file = new File([blob], 'my-new-style.png', { type: 'image/png' });
        await navigator.share({
          title: `My new ${style.name}`,
          text: `Checking out this ${style.name} look from StyleCut AI!`,
          files: [file],
        });
      } catch (error) {
        console.log('Sharing failed', error);
      }
    } else {
        alert("Sharing not supported on this device/browser.");
    }
  };
  
  const handleFindSalon = () => {
    // Open Google Maps searching for the hairstyle or general salon
    const query = encodeURIComponent(`hair salon specialized in ${style.name}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Virtual Try-On: <span className="text-purple-400">{style.name}</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            
            {/* Image Area */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] md:h-[500px] flex items-center justify-center border border-slate-700 group">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4 text-purple-400">
                  <RefreshCw className="w-10 h-10 animate-spin" />
                  <p className="text-sm font-medium animate-pulse">AI is styling your hair...</p>
                </div>
              ) : (
                <>
                  <img 
                    src={activeTab === 'after' && generatedImage ? generatedImage : originalImage} 
                    alt="Try On" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-slate-900/90 backdrop-blur-md rounded-full p-1 border border-slate-700">
                    <button
                      onClick={() => setActiveTab('before')}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'before' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Original
                    </button>
                    <button
                      onClick={() => setActiveTab('after')}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'after' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Try-On
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Details Area */}
            <div className="flex flex-col space-y-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h3 className="font-bold text-white mb-2">Styling Instructions</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {style.stylingTips.join(" ")}
                </p>
                
                <h3 className="font-bold text-white mb-2">Recommended Products</h3>
                <div className="flex flex-wrap gap-2">
                   {style.products.map((p, i) => (
                      <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600">{p}</span>
                   ))}
                </div>
              </div>
              
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex-grow">
                 <h3 className="font-bold text-white mb-4">What's Next?</h3>
                 <div className="space-y-3">
                    <button 
                        onClick={handleFindSalon}
                        className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-600"
                    >
                        <MapPin className="w-5 h-5 text-amber-400" />
                        Find a Salon for this Cut
                    </button>
                    <button 
                        onClick={handleShare}
                        disabled={!generatedImage}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Share2 className="w-5 h-5" />
                        Share Result
                    </button>
                    {generatedImage && (
                        <a 
                            href={generatedImage} 
                            download={`stylecut-${style.id}.png`}
                            className="w-full py-3 bg-slate-900 hover:bg-black text-slate-300 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
                        >
                            <Download className="w-5 h-5" />
                            Save Photo
                        </a>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;