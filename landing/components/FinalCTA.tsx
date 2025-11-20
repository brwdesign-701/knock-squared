'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary to-sky">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">
            Ready to give customers a safer knock at the door?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join leading service companies using Knock² to build trust and reduce cancellations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-teal text-white px-8 py-4 rounded-lg hover:bg-teal/90 transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center justify-center gap-2">
              Start a Pilot
              <ArrowRight size={20} />
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-lg hover:bg-white/20 transition-all font-semibold text-lg flex items-center justify-center gap-2">
              <Mail size={20} />
              Contact Sales
            </button>
          </div>
          <p className="text-white/70 mt-6 text-sm">
            30-day pilot available • No credit card required • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
