'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <button onClick={() => scrollToSection('hero')} className="text-2xl font-heading font-bold text-primary">
              Knock<sup className="text-lg">2</sup>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-primary transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-primary transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection('security')} className="text-gray-700 hover:text-primary transition-colors">
              Security
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-primary transition-colors">
              FAQ
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-primary transition-colors">
              Contact
            </button>
            <button
              onClick={() => scrollToSection('cta')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-md"
            >
              Start a Pilot
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-primary transition-colors text-left py-2">
                Features
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-primary transition-colors text-left py-2">
                Pricing
              </button>
              <button onClick={() => scrollToSection('security')} className="text-gray-700 hover:text-primary transition-colors text-left py-2">
                Security
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-primary transition-colors text-left py-2">
                FAQ
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-primary transition-colors text-left py-2">
                Contact
              </button>
              <button
                onClick={() => scrollToSection('cta')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-md text-left"
              >
                Start a Pilot
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
