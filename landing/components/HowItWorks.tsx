'use client';

import { motion } from 'framer-motion';
import { UserPlus, Send, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Profiles',
    description: 'Add your technicians with photos, experience, and certifications.',
  },
  {
    icon: Send,
    title: 'Send Secure Link',
    description: 'Share via SMS or email before the appointment.',
  },
  {
    icon: CheckCircle,
    title: 'Customer Confirms',
    description: 'Customers see who is coming and feel confident about the visit.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to build customer trust
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal to-sky rounded-full mb-6 shadow-lg">
                  <step.icon className="text-white" size={32} />
                </div>
                <div className="absolute top-10 left-1/2 transform translate-x-12 hidden md:block">
                  {index < steps.length - 1 && (
                    <div className="w-24 h-0.5 bg-gradient-to-r from-teal to-sky"></div>
                  )}
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
