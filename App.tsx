import React, { useState, useRef } from 'react';
import { AppState, AnalysisResult, UserPreferences, HairstyleRecommendation } from './types';
import { analyzeFaceAndRecommend, generateTryOnImage, fileToGenerativePart, createCustomRecommendation } from './services/geminiService';
import Hero from './components/Hero';
import PreferencesForm from './components/PreferencesForm';
import AnalysisView from './components/AnalysisView';
import StyleCard from './components/StyleCard';
import VirtualTryOn from './components/VirtualTryOn';
import { Upload, Camera, Loader2, Wand2, Plus, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: 'neutral',
    lengthPreference: 'medium',
    styleCategory: 'trendy',
    facialHair: 'none'
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Custom Style State
  const [customStylePrompt, setCustomStylePrompt] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  // Virtual Try On State
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [currentTryOnStyle, setCurrentTryOnStyle] = useState<HairstyleRecommendation | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStart = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please upload an image under 5MB.");
        return;
      }
      try {
        const base64 = await fileToGenerativePart(file);
        setSelectedImage(`data:${file.type};base64,${base64}`);
        // Remove mime prefix for API usage later
        setAppState(AppState.ANALYZING); // Move to preferences/preview state
        setError(null);
      } catch (e) {
        setError("Failed to process image.");
      }
    }
  };

  const executeAnalysis = async () => {
    if (!selectedImage) return;
    
    // Convert data URL to pure base64 for API
    const base64ForApi = selectedImage.split(',')[1];
    
    setAppState(AppState.ANALYZING);
    try {
      const data = await analyzeFaceAndRecommend(base64ForApi, preferences);
      setResult(data);
      setAppState(AppState.RESULTS);
    } catch (e) {
      console.error(e);
      setError("Analysis failed. Please try a clearer photo.");
      setAppState(AppState.IDLE);
    }
  };

  const handleGenerateCustomStyle = async () => {
    if (!customStylePrompt.trim() || !result) return;
    
    setIsGeneratingCustom(true);
    try {
        const customRec = await createCustomRecommendation(customStylePrompt, result.analysis, preferences);
        // Add to the beginning of the list
        setResult(prev => prev ? {
            ...prev,
            recommendations: [customRec, ...prev.recommendations]
        } : null);
        setCustomStylePrompt('');
    } catch (e) {
        console.error(e);
        // Optional: show a toast error
    } finally {
        setIsGeneratingCustom(false);
    }
  };

  const handleTryOn = async (style: HairstyleRecommendation) => {
    if (!selectedImage) return;
    
    setCurrentTryOnStyle(style);
    setIsTryOnOpen(true);
    setGeneratedImage(null); // Clear previous
    setIsGeneratingImage(true);

    try {
        const base64ForApi = selectedImage.split(',')[1];
        const newImage = await generateTryOnImage(
            base64ForApi, 
            style.name, 
            preferences.gender,
            preferences.facialHair
        );
        setGeneratedImage(newImage);
    } catch (e) {
        console.error("Image generation failed", e);
        // Fallback or error toast could go here
    } finally {
        setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
      />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
             className="flex items-center gap-2 font-bold text-xl cursor-pointer"
             onClick={() => { setAppState(AppState.IDLE); setSelectedImage(null); setResult(null); }}
          >
             <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg">
                <Upload className="w-5 h-5 text-white" />
             </div>
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">StyleCut AI</span>
          </div>
          {appState === AppState.RESULTS && (
             <button 
                onClick={handleStart}
                className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2"
             >
                <Camera className="w-4 h-4" /> New Photo
             </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            {appState === AppState.IDLE && (
                <Hero onStart={handleStart} />
            )}

            {appState === AppState.ANALYZING && !result && (
                <PreferencesForm 
                    preferences={preferences}
                    setPreferences={setPreferences}
                    onAnalyze={executeAnalysis}
                    imagePreview={selectedImage}
                />
            )}
            
            {appState === AppState.ANALYZING && result && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                    <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Analyzing Face Shape...</h2>
                        <p className="text-slate-400">Comparing features with our style database.</p>
                    </div>
                </div>
            )}

            {appState === AppState.RESULTS && result && (
                <div className="animate-fade-in space-y-8">
                    <AnalysisView analysis={result.analysis} />
                    
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-purple-500">Recommended Styles For You</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {result.recommendations.map((style, index) => (
                                <StyleCard 
                                    key={style.id || index} 
                                    style={style} 
                                    onTryOn={handleTryOn} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Custom Style Generator Section */}
                    <div className="mt-12 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700">
                                <Wand2 className="w-8 h-8 text-amber-400" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-white mb-2">Not seeing the perfect cut?</h3>
                                <p className="text-slate-400 mb-4">
                                    Describe your dream hairstyle below, and our AI will analyze how it fits your face shape and let you try it on.
                                </p>
                                <div className="flex gap-3">
                                    <input 
                                        type="text" 
                                        value={customStylePrompt}
                                        onChange={(e) => setCustomStylePrompt(e.target.value)}
                                        placeholder="e.g., 'Messy textured fringe with faded sides' or 'Bob cut with purple highlights'"
                                        className="flex-grow bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomStyle()}
                                    />
                                    <button 
                                        onClick={handleGenerateCustomStyle}
                                        disabled={isGeneratingCustom || !customStylePrompt.trim()}
                                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                        {isGeneratingCustom ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Generate <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="mb-2">&copy; {new Date().getFullYear()} StyleCut AI. Powered by TheProof.</p>
          <p>Images uploaded are processed in real-time and not stored.</p>
        </div>
      </footer>

      {/* Try On Modal */}
      {selectedImage && (
        <VirtualTryOn 
            isOpen={isTryOnOpen}
            onClose={() => setIsTryOnOpen(false)}
            style={currentTryOnStyle}
            originalImage={selectedImage}
            generatedImage={generatedImage}
            isGenerating={isGeneratingImage}
        />
      )}
    </div>
  );
};

export default App;