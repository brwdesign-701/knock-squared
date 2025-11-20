'use client';

import { motion } from 'framer-motion';
import { Users, Link2, Palette, Eye } from 'lucide-react';

export default function ProductPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-sky/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            A simple system designed for trust
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to share verified technician profiles
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <div className="aspect-video bg-gradient-to-br from-primary to-sky rounded-lg mb-4 flex items-center justify-center text-white font-bold text-2xl">
              Dashboard View
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              Manage Your Team
            </h3>
            <p className="text-gray-600">
              Simple dashboard to add technicians, update profiles, and track engagement
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <div className="aspect-video bg-gradient-to-br from-teal to-sky rounded-lg mb-4 flex items-center justify-center text-white font-bold text-2xl">
              Customer View
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              Beautiful Profiles
            </h3>
            <p className="text-gray-600">
              White-labeled pages that match your brand and build customer confidence
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Users className="text-teal mb-4" size={32} />
              <h4 className="font-heading font-bold text-gray-900 mb-2">Technician Gallery</h4>
              <p className="text-gray-600 text-sm">Centralized team directory</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Link2 className="text-sky mb-4" size={32} />
              <h4 className="font-heading font-bold text-gray-900 mb-2">One-Click Share</h4>
              <p className="text-gray-600 text-sm">Instant link generation</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Palette className="text-teal mb-4" size={32} />
              <h4 className="font-heading font-bold text-gray-900 mb-2">White-Label Pages</h4>
              <p className="text-gray-600 text-sm">Your brand, your colors</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Eye className="text-sky mb-4" size={32} />
              <h4 className="font-heading font-bold text-gray-900 mb-2">Link Insights</h4>
              <p className="text-gray-600 text-sm">Track views and engagement</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
