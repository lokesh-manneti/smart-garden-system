import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Droplets, Activity, Sparkles, Scan, CalendarClock, BookOpen, UserPlus, Camera, Zap } from 'lucide-react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80';

export default function Home() {
  return (
    <div className="min-h-screen surface-floor">

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden">
        {/* Ambient Background Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-garden-100/20 blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-teal-100/15 blur-3xl translate-y-1/4 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — Editorial Copy */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 surface-card rounded-full text-sm font-medium text-botanical-primary ghost-border mb-8 shadow-soft">
                <Sparkles className="w-4 h-4" />
                Powered by Google Gemini AI
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-botanical-primary tracking-editorial leading-[1.05] mb-6">
                Revolutionize Your Plant Care
                <span className="block botanical-gradient-text">with AI</span>
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed max-w-lg mb-10">
                The ultimate companion for the modern indoor gardener. AI diagnostics, smart scheduling, and expert insights — all in one living dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login?mode=register"
                  className="btn-primary !px-8 !py-4 !text-base shadow-lg hover:shadow-xl"
                >
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a href="#features" className="btn-secondary !px-8 !py-4 !text-base">
                  See How It Works
                </a>
              </div>
            </div>

            {/* Right — App Preview Card */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-premium overflow-hidden ghost-border">
                {/* Preview image — full bleed */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={HERO_IMAGE}
                    alt="Lush garden plants"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>

                {/* Floating Stats */}
                <div className="p-6 -mt-8 relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="badge-success">
                      <Activity className="w-3 h-3 mr-1" /> Active Monitoring
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="surface-section rounded-2xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">Diagnosis</p>
                      <p className="text-sm font-bold text-botanical-primary">Ficus Lyrata: 98% Healthy</p>
                    </div>
                    <div className="surface-section rounded-2xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">Next Water</p>
                      <p className="text-sm font-bold text-blue-600">In 4 Hours (Humidity 62%)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative floating element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 botanical-gradient rounded-3xl opacity-10 blur-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" className="py-28 surface-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-20 animate-fade-in">
            <p className="text-sm font-semibold text-botanical-primary tracking-widest uppercase mb-3">Capabilities</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-botanical-primary tracking-editorial mb-4">
              The Future of Growth
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Precision engineering for organic life. Our features bridge the gap between human intuition and data-driven results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Scan,
                title: 'AI Plant Doctor',
                description: 'Instant structural and chlorophyll analysis for every specimen using high-resolution neural mapping.',
                image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
              },
              {
                icon: CalendarClock,
                title: 'Smart Schedule',
                description: 'Precision hydration based on real-time local weather, indoor humidity, and seasonal metabolic shifts.',
                image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80',
              },
              {
                icon: BookOpen,
                title: 'Daily Garden Digest',
                description: 'Personalized growth tips and curated gardening wisdom delivered daily to your fingertips.',
                image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&q=80',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="card-premium overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Full-bleed image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="botanical-gradient w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-botanical-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THREE STEPS SECTION ═══ */}
      <section className="py-28 surface-floor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-20 animate-fade-in">
            <p className="text-sm font-semibold text-botanical-primary tracking-widest uppercase mb-3">Getting Started</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-botanical-primary tracking-editorial mb-4">
              Three Steps to a Thriving Oasis
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              We've simplified plant management so you can spend less time guessing and more time enjoying the green.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: UserPlus,
                step: '01',
                title: 'Seamless Signup',
                description: 'Create your botanical profile in seconds. Connect your space and set your gardening goals—from beginner to pro collector.',
              },
              {
                icon: Camera,
                step: '02',
                title: 'Add Your Collection',
                description: 'Snap a photo or search our database of 75+ Indian species. Our AI identifies your plants instantly and maps their specific biological needs.',
              },
              {
                icon: Zap,
                step: '03',
                title: 'Receive Smart Insights',
                description: 'Get notifications for watering, fertilizing, and pruning. Watch your garden flourish with precise, automated care guidance.',
              },
            ].map((step, i) => (
              <div
                key={step.step}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Step number watermark */}
                <span className="text-8xl font-black text-garden-100/50 absolute -top-6 -left-2 select-none pointer-events-none">
                  {step.step}
                </span>

                <div className="relative pt-12">
                  <div className="botanical-gradient w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-botanical-primary mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FOOTER SECTION ═══ */}
      <section className="py-28 surface-section">
        <div className="max-w-3xl mx-auto px-4 text-center animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-botanical-primary tracking-editorial mb-6">
            Ready to grow?
          </h2>
          <p className="text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
            Join 50,000+ indoor gardeners who have transformed their homes into thriving living sanctuaries.
          </p>
          <Link
            to="/login?mode=register"
            className="btn-primary !px-10 !py-4 !text-lg shadow-xl"
          >
            Start Growing <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="surface-floor py-10 ghost-border border-l-0 border-r-0 border-b-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="botanical-gradient p-1.5 rounded-lg">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-botanical-primary">SmartGarden</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-botanical-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-botanical-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-botanical-primary transition-colors">Contact</a>
            </div>
            <p className="text-xs text-gray-300">© 2026 SmartGarden. Built with 🌿 for Indian homes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}