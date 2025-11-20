import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { Save, Palette, Building2 } from 'lucide-react';

interface CompanySettings {
  id: string;
  company_id: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
}

export default function Settings() {
  const { company } = useAuth();
  const { showToast } = useToast();
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0B2E51');
  const [secondaryColor, setSecondaryColor] = useState('#39C0C3');
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (company) {
      setCompanyName(company.company_name);
      setEmail(company.email);
      setPhone(company.phone || '');
      fetchSettings();
    }
  }, [company]);

  const fetchSettings = async () => {
    if (!company) return;

    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('company_id', company.id)
      .maybeSingle();

    if (!error && data) {
      setSettings(data);
      setLogoUrl(data.logo_url || '');
      setPrimaryColor(data.primary_color);
      setSecondaryColor(data.secondary_color);
    } else if (!data && !error) {
      const { data: newSettings } = await supabase
        .from('company_settings')
        .insert({
          company_id: company.id,
        })
        .select()
        .single();

      if (newSettings) {
        setSettings(newSettings);
      }
    }

    setFetchLoading(false);
  };

  const handleCompanyUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('companies')
        .update({
          company_name: companyName,
          email,
          phone: phone || null,
        })
        .eq('id', company.id);

      if (error) throw error;

      showToast('Company information updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update company information', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandingUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!company || !settings) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('company_settings')
        .update({
          logo_url: logoUrl || null,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
        })
        .eq('company_id', company.id);

      if (error) throw error;

      showToast('Branding settings updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update branding settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500">Loading settings...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#0B2E51] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Settings
        </h1>


        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Building2 size={24} className="text-[#39C0C3]" />
              <h2 className="text-2xl font-bold text-gray-800">Company Information</h2>
            </div>

            <form onSubmit={handleCompanyUpdate} className="space-y-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#39C0C3] hover:bg-[#2da5a8] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                Save Company Info
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Palette size={24} className="text-[#39C0C3]" />
              <h2 className="text-2xl font-bold text-gray-800">Branding</h2>
            </div>

            <form onSubmit={handleBrandingUpdate} className="space-y-6">
              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  id="logoUrl"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This logo will appear on customer-facing technician profiles
                </p>
                {logoUrl && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img src={logoUrl} alt="Logo preview" className="h-16 object-contain" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">Preview:</p>
                <div
                  className="h-24 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                  }}
                >
                  {companyName || 'Your Company'}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#39C0C3] hover:bg-[#2da5a8] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                Save Branding
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
