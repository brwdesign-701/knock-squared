'use client';

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-heading font-bold mb-4">
              Knock<sup className="text-lg">2</sup>
            </div>
            <p className="text-white/80 text-sm">
              Building trust between service companies and their customers.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => scrollToSection('features')} className="text-white/80 hover:text-white transition-colors">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('pricing')} className="text-white/80 hover:text-white transition-colors">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('security')} className="text-white/80 hover:text-white transition-colors">
                  Security
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => scrollToSection('faq')} className="text-white/80 hover:text-white transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="mailto:support@knocksquared.com" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} Knock² (Knock Squared). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
