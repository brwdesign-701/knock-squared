'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Do customers need an app?',
    answer: 'No! Customers receive a simple link via SMS or email that opens directly in their browser. No app download required.',
  },
  {
    question: 'Can we use our own branding?',
    answer: 'Yes! All customer-facing profile pages are white-labeled with your company logo, colors, and branding.',
  },
  {
    question: 'How do integrations work?',
    answer: 'Knock² can integrate with your existing dispatch or CRM system via our API. We also offer standalone use—no integration required to get started.',
  },
  {
    question: 'How secure are technician profiles?',
    answer: 'All data is encrypted in transit and at rest. Profile links can be time-limited and are trackable. We\'re GDPR and CCPA compliant.',
  },
  {
    question: 'What is included in the pilot?',
    answer: 'A 30-day trial with up to 10 technicians, full feature access, onboarding support, and dedicated customer success check-ins.',
  },
  {
    question: 'Can technicians edit their own profiles?',
    answer: 'Yes! Technicians can update their bio, certifications, and photo through a simple portal. Admins maintain approval control.',
  },
  {
    question: 'Does this replace our dispatch system?',
    answer: 'No, Knock² works alongside your existing dispatch and scheduling tools. It focuses solely on pre-arrival communication and trust-building.',
  },
  {
    question: 'Is training needed?',
    answer: 'Most teams are up and running in under an hour. We provide onboarding videos, documentation, and live support to ensure success.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Knock²
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-heading font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
