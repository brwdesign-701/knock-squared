import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, Settings, BarChart3, CreditCard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { company, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', icon: Users, label: 'Technicians' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/plans', icon: CreditCard, label: 'Plans' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center">
            <h1 className="text-2xl font-bold text-[#0B2E51]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Knock²
            </h1>
          </Link>

          <div className="hidden lg:flex items-center gap-4">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive(path)
                    ? 'bg-[#39C0C3] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}

            <div className="border-l border-gray-300 pl-4 flex items-center gap-3">
              <div className="text-right hidden xl:block">
                <p className="text-sm font-semibold text-gray-800">{company?.company_name}</p>
                <p className="text-xs text-gray-500">{company?.email}</p>
              </div>

              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(path)
                      ? 'bg-[#39C0C3] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}

              <div className="border-t border-gray-200 mt-2 pt-4 px-4">
                <p className="text-sm font-semibold text-gray-800 mb-1">{company?.company_name}</p>
                <p className="text-xs text-gray-500 mb-3">{company?.email}</p>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all w-full"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
