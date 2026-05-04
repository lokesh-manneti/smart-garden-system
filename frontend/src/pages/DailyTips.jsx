import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Sparkles, Sun, Droplets, Leaf, Bug, Flower2, Quote } from 'lucide-react';

export default function DailyTips() {
  const [data, setData] = useState({ ai_tips: [], general_tips: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await api.get('/tips/');
        setData(response.data);
      } catch (error) {
        toast.error("Failed to load your daily tips.");
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  const getIconAndColor = (category) => {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('water')) return { icon: <Droplets className="w-5 h-5 text-blue-500" />, bg: 'from-blue-500 to-sky-500', light: 'bg-blue-50' };
    if (lower.includes('sun') || lower.includes('light')) return { icon: <Sun className="w-5 h-5 text-amber-500" />, bg: 'from-amber-500 to-orange-500', light: 'bg-amber-50' };
    if (lower.includes('pest') || lower.includes('disease')) return { icon: <Bug className="w-5 h-5 text-red-500" />, bg: 'from-red-500 to-rose-500', light: 'bg-red-50' };
    if (lower.includes('soil') || lower.includes('fertiliz')) return { icon: <Flower2 className="w-5 h-5 text-purple-500" />, bg: 'from-purple-500 to-violet-500', light: 'bg-purple-50' };
    return { icon: <Leaf className="w-5 h-5 text-green-500" />, bg: 'from-garden-500 to-teal-500', light: 'bg-garden-50' };
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 surface-card rounded-full text-sm font-medium text-amber-700 ghost-border mb-5 shadow-soft">
            <Sparkles className="w-4 h-4 animate-pulse-soft" />
            Personalized by Gemini AI
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-botanical-primary tracking-editorial">
            Daily Garden Insights
          </h1>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Custom tips generated from your specific plants, local weather conditions, and general best practices.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-3 border-garden-200 border-t-botanical-primary rounded-full animate-spin"></div>
            <p className="text-sm text-gray-400 font-medium">Generating insights with AI...</p>
          </div>
        ) : (
          <>
            {/* AI Personalized Tips Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-bold text-botanical-primary">AI Personalized Insights</h2>
              </div>

              {data.ai_tips?.length === 0 ? (
                <div className="card-botanical p-12 text-center max-w-md mx-auto ghost-border">
                  <div className="surface-section w-16 h-16 rounded-4xl flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-garden-200" />
                  </div>
                  <h3 className="font-bold text-gray-500">No tips available</h3>
                  <p className="text-sm text-gray-300 mt-1">Add plants to your garden to receive personalized AI tips.</p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {data.ai_tips.map((t, idx) => {
                    const style = getIconAndColor(t.category);
                    return (
                      <div
                        key={`ai-${idx}`}
                        className="card-botanical overflow-hidden animate-fade-in-up ghost-border"
                        style={{ animationDelay: `${idx * 0.08}s` }}
                      >
                        {/* Top gradient accent bar */}
                        <div className={`h-1 bg-gradient-to-r ${style.bg}`}></div>

                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 ${style.light} p-3 rounded-xl`}>
                              {style.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-botanical-on-surface text-sm">{t.category}</h3>
                              </div>
                              <span className="badge-success !text-[10px] mb-3 inline-block bg-amber-50 text-amber-700 border-amber-200/50">
                                {t.plant_focus === 'General' ? '🌿 All Plants' : `🎯 ${t.plant_focus}`}
                              </span>
                              <p className="text-gray-500 leading-relaxed text-sm mt-2">
                                {t.tip}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* General Wisdom Section */}
            {data.general_tips?.length > 0 && (
              <div className="mt-12 pt-12 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Leaf className="w-5 h-5 text-garden-500" />
                  <h2 className="text-xl font-bold text-botanical-primary">General Gardening Wisdom</h2>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  {data.general_tips.map((t, idx) => (
                    <div
                      key={`general-${idx}`}
                      className="card-botanical p-6 animate-fade-in-up ghost-border bg-gradient-to-br from-white/80 to-gray-50/50"
                      style={{ animationDelay: `${(idx + data.ai_tips.length) * 0.08}s` }}
                    >
                      <Quote className="w-6 h-6 text-gray-200 mb-3" />
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {t.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}