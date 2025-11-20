'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary to-sky">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
              Know who's at your door before they knock.
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Knock² lets customers see a verified technician profile—photo, name, and experience—before the visit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('cta')}
                className="bg-teal text-white px-8 py-4 rounded-lg hover:bg-teal/90 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Start a Pilot
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-lg hover:bg-white/20 transition-all font-semibold text-lg flex items-center justify-center gap-2">
                <Play size={20} />
                Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal to-sky rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-gray-900">John Daniels</h3>
                  <p className="text-gray-600">Senior HVAC Technician</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-semibold text-gray-900">12 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certifications:</span>
                  <span className="font-semibold text-gray-900">EPA, NATE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-semibold text-gray-900">4.9/5.0 ⭐</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Arriving today between:</p>
                <p className="text-2xl font-bold text-primary">2:00 PM - 4:00 PM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
