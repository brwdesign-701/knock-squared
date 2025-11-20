'use client';

import { motion } from 'framer-motion';
import { Shield, TrendingDown, Zap, Palette } from 'lucide-react';

const pillars = [
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'Give customers peace of mind with verified technician profiles.',
  },
  {
    icon: TrendingDown,
    title: 'Fewer No-Shows',
    description: 'Reduce cancellations with pre-arrival transparency.',
  },
  {
    icon: Zap,
    title: 'Fast to Deploy',
    description: 'Start standalone today. Integrate later.',
  },
  {
    icon: Palette,
    title: 'Brand Consistency',
    description: 'Your logo and colors on every customer-facing profile.',
  },
];

export default function ValuePillars() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Why service teams choose Knock²
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build trust, reduce friction, and deliver a better customer experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-teal to-sky rounded-lg flex items-center justify-center mb-6">
                <pillar.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {pillar.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
