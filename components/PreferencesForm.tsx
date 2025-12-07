import React from 'react';
import { UserPreferences } from '../types';
import { User, Ruler, Palette, Sparkles, Scissors } from 'lucide-react';

interface PreferencesFormProps {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  onAnalyze: () => void;
  imagePreview: string | null;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, setPreferences, onAnalyze, imagePreview }) => {
  const handleChange = (key: keyof UserPreferences, value: string) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const facialHairOptions = [
    { value: 'none', label: 'Keep Current' },
    { value: 'clean_shave', label: 'Clean Shave' },
    { value: 'stubble', label: 'Italian / Stubble' },
    { value: 'full_beard', label: 'Full Beard' },
    { value: 'goatee', label: 'Goatee' },
    { value: 'mustache', label: 'Mustache' },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Image Preview Side */}
        <div className="bg-slate-800 rounded-3xl p-4 border border-slate-700 shadow-2xl">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden relative bg-slate-900">
             {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
             )}
             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-center text-sm font-medium">Your Photo</p>
             </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Customize Your Look</h2>
            <p className="text-slate-400">Tell us a bit about your style goals so we can tailor the AI results.</p>
          </div>

          <div className="space-y-6">
            {/* Gender Identity */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-purple-400 w-5 h-5" />
                <label className="text-slate-200 font-semibold">Style Preference</label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['masculine', 'feminine', 'neutral'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleChange('gender', opt)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                      preferences.gender === opt
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Facial Hair */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Scissors className="text-emerald-400 w-5 h-5" />
                <label className="text-slate-200 font-semibold">Beard / Facial Hair</label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {facialHairOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChange('facialHair', opt.value)}
                    className={`py-2 px-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                      preferences.facialHair === opt.value
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Preference */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Ruler className="text-pink-400 w-5 h-5" />
                <label className="text-slate-200 font-semibold">Desired Length</label>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {['short', 'medium', 'long', 'any'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleChange('lengthPreference', opt)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                      preferences.lengthPreference === opt
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Vibe */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="text-amber-400 w-5 h-5" />
                <label className="text-slate-200 font-semibold">Vibe</label>
              </div>
              <div className="flex flex-wrap gap-3">
                {['professional', 'casual', 'trendy', 'edgy', 'classic'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleChange('styleCategory', opt)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                      preferences.styleCategory === opt
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onAnalyze}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Analyze & Generate Styles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesForm;