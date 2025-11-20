import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, Zap, TrendingUp, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: any;
  color: string;
  buttonText: string;
  popular?: boolean;
}

export default function Plans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      price: '$199',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 10 technicians',
        'Unlimited profile views',
        'Basic analytics',
        'Email support',
        'Custom branding',
        'Share links',
      ],
      icon: Zap,
      color: '#39C0C3',
      buttonText: 'Contact Sales',
    },
    {
      name: 'Growth',
      price: '$499',
      description: 'For growing teams that need more',
      features: [
        'Up to 50 technicians',
        'Unlimited profile views',
        'Advanced analytics',
        'Priority email support',
        'Custom branding',
        'Share links',
        'API access',
        'Custom domains',
      ],
      icon: TrendingUp,
      color: '#0B2E51',
      buttonText: 'Upgrade',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with custom needs',
      features: [
        'Unlimited technicians',
        'Unlimited profile views',
        'Enterprise analytics',
        'Dedicated account manager',
        'Custom branding',
        'Share links',
        'API access',
        'Custom domains',
        'SSO integration',
        'White-label options',
        'SLA guarantee',
      ],
      icon: Building2,
      color: '#E0505F',
      buttonText: 'Contact Sales',
    },
  ];

  const handleUpgrade = (tierName: string) => {
    alert(`Thank you for your interest in the ${tierName} plan! Our sales team will contact you shortly.`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plans & Billing
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Choose the perfect plan for your business needs
            </p>

            <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#39C0C3] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-[#39C0C3] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pricingTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                    tier.popular ? 'ring-4 ring-[#39C0C3] ring-opacity-50' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-[#39C0C3] text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="p-8">
                    <div
                      className="inline-flex p-3 rounded-xl mb-4"
                      style={{ backgroundColor: `${tier.color}20` }}
                    >
                      <Icon size={32} style={{ color: tier.color }} />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{tier.description}</p>

                    <div className="mb-6">
                      <span className="text-5xl font-bold text-gray-900">
                        {tier.price}
                      </span>
                      {tier.price !== 'Custom' && (
                        <span className="text-gray-600 ml-2">/month</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleUpgrade(tier.name)}
                      className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-105 mb-8"
                      style={{ backgroundColor: tier.color }}
                    >
                      {tier.buttonText}
                    </button>

                    <div className="space-y-4">
                      <p className="font-semibold text-gray-900 mb-3">
                        Everything included:
                      </p>
                      {tier.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <Check size={20} className="text-green-500" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#0B2E51] to-[#39C0C3] rounded-2xl p-8 md:p-12 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">
              Not sure which plan is right for you?
            </h2>
            <p className="text-white text-opacity-90 text-lg mb-6">
              Our team is here to help you find the perfect fit for your business needs.
            </p>
            <button
              onClick={() => handleUpgrade('consultation')}
              className="bg-white text-[#0B2E51] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Schedule a Consultation
            </button>
          </motion.div>

          <div className="mt-12 text-center text-gray-600">
            <p className="text-sm">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-sm mt-2">
              Enterprise plans can be customized to fit your specific requirements.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
