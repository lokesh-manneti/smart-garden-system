import { Link } from 'react-router-dom';
import { Leaf, CloudRain, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-garden-50 via-white to-garden-100 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Your Digital <span className="text-garden-600">Green Thumb</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-10">
              The smart home gardening assistant that tracks your plants, analyzes local weather, and creates dynamic watering schedules so your garden always thrives.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/login" 
                className="flex items-center bg-garden-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-garden-700 transition-all shadow-lg hover:shadow-xl"
              >
                Create Your Garden <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-garden-200 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-garden-300 opacity-30 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything your plants need</h2>
            <p className="mt-4 text-gray-500">Built for both beginners and experienced botanists.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-garden-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="w-7 h-7 text-garden-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Localized Catalog</h3>
              <p className="text-gray-600">
                Pre-loaded with over 50 popular Indian household and garden plants, complete with exact sunlight and baseline watering needs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <CloudRain className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Weather Sync</h3>
              <p className="text-gray-600">
                Integrates with real-time weather APIs to dynamically adjust your watering schedules based on upcoming rain or extreme heat.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Growth Tracking</h3>
              <p className="text-gray-600">
                Log planting dates, track specific locations around your home, and keep detailed notes on your plant's health over time.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}