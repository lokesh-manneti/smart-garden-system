import { Link } from 'react-router-dom';
import { Leaf, CloudRain, ShieldCheck, ArrowRight, Sparkles, Sprout, Droplets } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-garden-50 via-white to-teal-50/50"></div>
        <div className="absolute top-20 right-[10%] w-96 h-96 rounded-full bg-garden-200/40 blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-10 left-[5%] w-80 h-80 rounded-full bg-teal-200/30 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-garden-100/20 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-garden-50 border border-garden-200/60 rounded-full text-sm font-medium text-garden-700 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 animate-fade-in-up">
              Your Digital
              <br />
              <span className="bg-gradient-to-r from-garden-600 via-teal-600 to-garden-500 bg-clip-text text-transparent">
                Green Thumb
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              The intelligent home gardening companion that tracks 75+ Indian plants, syncs with local weather, and uses AI to keep your garden thriving.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link 
                to="/login" 
                className="btn-primary !px-8 !py-3.5 !text-base !rounded-2xl shadow-lg hover:shadow-xl"
              >
                Start Growing <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a href="#features" className="btn-secondary !px-8 !py-3.5 !text-base !rounded-2xl">
                Learn More
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex justify-center items-center gap-6 mt-12 text-sm text-gray-400 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-garden-400" />
                <span>75+ Plants</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-400" />
                <span>Weather Sync</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-garden-600 tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Everything your plants need</h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">Built for Indian homes — from balcony herb gardens to terrace-top fruit trees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-premium p-8 group">
              <div className="bg-gradient-to-br from-garden-500 to-teal-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Indian Plant Catalog</h3>
              <p className="text-gray-500 leading-relaxed">
                75+ curated plants — from Tulsi & Mogra to Money Plant & Areca Palm — with precise sunlight and watering needs for Indian climates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-premium p-8 group">
              <div className="bg-gradient-to-br from-blue-500 to-sky-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Weather Sync</h3>
              <p className="text-gray-500 leading-relaxed">
                Real-time weather integration dynamically adjusts watering schedules based on rain forecasts, heat waves, and humidity levels in your city.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-premium p-8 group">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Plant Doctor</h3>
              <p className="text-gray-500 leading-relaxed">
                Upload a photo of your sick plant and get an AI-powered diagnosis with treatment plans, powered by Google Gemini's multimodal vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>Smart Garden — Built with 🌿 for Indian homes</p>
        </div>
      </footer>

    </div>
  );
}