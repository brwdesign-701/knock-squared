'use client';

import { motion } from 'framer-motion';
import { Lock, Shield, FileCheck, Link2 } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Encrypted Data',
    description: 'All data encrypted in transit and at rest with industry-standard protocols.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Granular permissions to control who can view and edit technician profiles.',
  },
  {
    icon: FileCheck,
    title: 'GDPR/CCPA Ready',
    description: 'Compliant with major data privacy regulations out of the box.',
  },
  {
    icon: Link2,
    title: 'Secure Links',
    description: 'Time-limited, trackable profile links with optional access controls.',
  },
];

export default function Security() {
  return (
    <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Security you can trust
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enterprise-grade security to protect your team and customer data
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-sky rounded-xl mb-6 shadow-lg">
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-br from-primary/5 to-sky/5 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            Regular Security Audits
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We conduct regular third-party security audits and penetration testing to ensure your data stays protected. SOC 2 Type II certification in progress.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
