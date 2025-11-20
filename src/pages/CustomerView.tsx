import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Shield, Award, Clock, CheckCircle, BadgeCheck } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';

interface Technician {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  photo_url: string | null;
  bio: string | null;
  certifications: string[] | null;
  years_experience: number | null;
  company_id: string;
}

interface CompanySettings {
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
}

interface Company {
  company_name: string;
}

export default function CustomerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechnicianProfile();
  }, [id]);

  const fetchTechnicianProfile = async () => {
    if (!id) return;

    const { data: techData, error: techError } = await supabase
      .from('technicians')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (techError || !techData) {
      navigate('/404');
      return;
    }

    setTechnician(techData);

    const { data: companyData } = await supabase
      .from('companies')
      .select('company_name')
      .eq('id', techData.company_id)
      .maybeSingle();

    if (companyData) {
      setCompany(companyData);
    }

    const { data: settingsData } = await supabase
      .from('company_settings')
      .select('*')
      .eq('company_id', techData.company_id)
      .maybeSingle();

    if (settingsData) {
      setSettings(settingsData);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!technician) {
    return null;
  }

  const primaryColor = settings?.primary_color || '#0B2E51';
  const secondaryColor = settings?.secondary_color || '#39C0C3';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-white py-8 md:py-12"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
            {settings?.logo_url && (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                src={settings.logo_url}
                alt={company?.company_name}
                className="h-14 md:h-16 w-auto object-contain bg-white rounded-xl p-3 shadow-lg"
              />
            )}
            <div className="text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-1"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {company?.company_name || 'Service Company'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-white text-opacity-95 text-base md:text-lg"
              >
                Your Scheduled Technician
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute top-6 right-6 z-10"
          >
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold text-sm shadow-lg"
              style={{ backgroundColor: secondaryColor }}
            >
              <BadgeCheck size={20} />
              <span>Verified Technician</span>
            </div>
          </motion.div>

          <div className="p-6 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.6, type: 'spring', stiffness: 100 }}
                  className="flex-shrink-0"
                >
                  {technician.photo_url ? (
                    <img
                      src={technician.photo_url}
                      alt={`${technician.first_name} ${technician.last_name}`}
                      className="w-56 h-56 md:w-64 md:h-64 rounded-3xl object-cover shadow-2xl border-4"
                      style={{ borderColor: secondaryColor }}
                    />
                  ) : (
                    <div
                      className="w-56 h-56 md:w-64 md:h-64 rounded-3xl flex items-center justify-center text-white text-7xl font-bold shadow-2xl"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {technician.first_name[0]}
                      {technician.last_name[0]}
                    </div>
                  )}
                </motion.div>

                <div className="flex-1 w-full text-center md:text-left">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {technician.first_name} {technician.last_name}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-xl md:text-2xl text-gray-600 mb-8 font-medium"
                  >
                    {technician.title}
                  </motion.p>

                  {technician.years_experience && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      className="flex items-center justify-center md:justify-start gap-4 mb-8"
                    >
                      <div
                        className="p-4 rounded-2xl"
                        style={{ backgroundColor: `${secondaryColor}15` }}
                      >
                        <Clock size={28} style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Experience</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {technician.years_experience} {technician.years_experience === 1 ? 'year' : 'years'}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {technician.bio && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="mb-8"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center md:justify-start gap-2">
                        <Shield size={22} style={{ color: secondaryColor }} />
                        About {technician.first_name}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg" style={{ lineHeight: '1.8' }}>
                        {technician.bio}
                      </p>
                    </motion.div>
                  )}

                  {technician.certifications && technician.certifications.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.5 }}
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center md:justify-start gap-2">
                        <Award size={22} style={{ color: secondaryColor }} />
                        Certifications & Qualifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {technician.certifications.map((cert, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                            className="flex items-center gap-3 p-4 rounded-xl border-2 bg-white shadow-sm hover:shadow-md transition-shadow"
                            style={{ borderColor: `${secondaryColor}40` }}
                          >
                            <CheckCircle size={22} style={{ color: secondaryColor }} className="flex-shrink-0" />
                            <span className="text-gray-800 font-medium text-sm md:text-base">{cert}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="px-6 md:px-12 py-6 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center justify-center md:justify-start gap-3">
              <CheckCircle size={26} className="flex-shrink-0" />
              <p className="text-base md:text-lg">
                <span className="font-bold">{technician.first_name}</span> is on their way to provide you with excellent service!
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm">
            Powered by <span className="font-bold text-[#39C0C3]">Knock²</span>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
