import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import TechnicianModal from '../components/TechnicianModal';
import ShareModal from '../components/ShareModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { Plus, User, ExternalLink, Pencil, Trash2, Copy, CheckCircle2, Calendar, Share2, Sparkles } from 'lucide-react';

interface Technician {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  photo_url: string | null;
  bio: string | null;
  certifications: string[] | null;
  years_experience: number | null;
  is_active: boolean;
  updated_at: string;
}

export default function Dashboard() {
  const { company } = useAuth();
  const { showToast } = useToast();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnicianId, setEditingTechnicianId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingTechnician, setSharingTechnician] = useState<{ id: string; name: string } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    fetchTechnicians();
  }, [company]);

  const fetchTechnicians = async () => {
    if (!company) return;

    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTechnicians(data);
    }
    setLoading(false);
  };

  const deleteTechnician = async (id: string) => {
    if (!confirm('Are you sure you want to delete this technician?')) return;

    const { error } = await supabase.from('technicians').delete().eq('id', id);

    if (!error) {
      setTechnicians(technicians.filter((t) => t.id !== id));
      showToast('Technician deleted successfully', 'success');
    } else {
      showToast('Failed to delete technician', 'error');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('technicians')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      setTechnicians(
        technicians.map((t) => (t.id === id ? { ...t, is_active: !currentStatus } : t))
      );
      showToast(`Technician ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
    } else {
      showToast('Failed to update status', 'error');
    }
  };

  const copyLink = (technicianId: string) => {
    const link = `${window.location.origin}/tech/${technicianId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(technicianId);
    showToast('Link copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddTechnician = () => {
    setEditingTechnicianId(null);
    setIsModalOpen(true);
  };

  const handleEditTechnician = (id: string) => {
    setEditingTechnicianId(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTechnicianId(null);
  };

  const handleModalSave = () => {
    fetchTechnicians();
  };

  const handleShareTechnician = (id: string, firstName: string, lastName: string) => {
    setSharingTechnician({ id, name: `${firstName} ${lastName}` });
    setIsShareModalOpen(true);
  };

  const handleShareModalClose = () => {
    setIsShareModalOpen(false);
    setSharingTechnician(null);
  };

  const populateDemoData = async () => {
    if (!company) return;

    setIsDemoMode(true);
    setLoading(true);

    const demoTechnicians = [
      {
        first_name: 'Sarah',
        last_name: 'Johnson',
        title: 'Senior HVAC Technician',
        photo_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'With 12 years of experience in heating and cooling systems, Sarah specializes in residential and commercial HVAC installations and repairs. She holds multiple EPA certifications and is known for her attention to detail and customer service excellence.',
        certifications: ['EPA Universal Certification', 'NATE Certified', 'OSHA Safety Certified', 'Residential Load Calculation'],
        years_experience: 12,
        is_active: true,
        company_id: company.id,
      },
      {
        first_name: 'Michael',
        last_name: 'Chen',
        title: 'Master Plumber',
        photo_url: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Michael is a licensed master plumber with extensive experience in both residential and commercial plumbing. He specializes in complex pipe installations, water heater repairs, and emergency plumbing services.',
        certifications: ['Master Plumber License', 'Backflow Prevention Certified', 'Gas Line Installation Certified'],
        years_experience: 15,
        is_active: true,
        company_id: company.id,
      },
      {
        first_name: 'Jessica',
        last_name: 'Martinez',
        title: 'Licensed Electrician',
        photo_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Jessica brings 8 years of electrical expertise to every job. She specializes in residential wiring, panel upgrades, and smart home installations. Safety and code compliance are her top priorities.',
        certifications: ['Journeyman Electrician License', 'Smart Home Installation Certified', 'Solar Panel Installation'],
        years_experience: 8,
        is_active: true,
        company_id: company.id,
      },
    ];

    try {
      const { error } = await supabase
        .from('technicians')
        .insert(demoTechnicians);

      if (error) throw error;

      await fetchTechnicians();
      showToast('Demo technicians added successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add demo data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearDemoData = async () => {
    if (!company) return;
    if (!confirm('Are you sure you want to remove all technicians?')) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('company_id', company.id);

      if (error) throw error;

      setTechnicians([]);
      setIsDemoMode(false);
      showToast('All technicians removed', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to clear data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500">Loading technicians...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0B2E51]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Technicians
            </h1>
            <p className="text-gray-600 mt-1">Manage your team and share profiles with customers</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {technicians.length === 0 && (
              <button
                onClick={populateDemoData}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-5 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={20} />
                Try Demo Mode
              </button>
            )}

            {technicians.length > 0 && isDemoMode && (
              <button
                onClick={clearDemoData}
                disabled={loading}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-5 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Demo Data
              </button>
            )}

            <button
              onClick={handleAddTechnician}
              className="flex items-center gap-2 bg-[#39C0C3] hover:bg-[#2da5a8] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add Technician
            </button>
          </div>
        </div>

        {technicians.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <User size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No technicians yet</h2>
            <p className="text-gray-500 mb-6">
              Add your first technician to start sharing profiles with customers
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={populateDemoData}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={20} />
                Try Demo Mode
              </button>
              <button
                onClick={handleAddTechnician}
                className="inline-flex items-center gap-2 bg-[#39C0C3] hover:bg-[#2da5a8] text-white font-semibold px-6 py-3 rounded-lg transition-all"
              >
                <Plus size={20} />
                Add Your First Technician
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {isDemoMode && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 flex items-center gap-2">
                <Sparkles size={20} />
                <span className="font-semibold">Demo Mode Active</span>
                <span className="text-white text-opacity-90">- These are sample technicians for demonstration purposes</span>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Technician
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {technicians.map((tech) => (
                    <tr key={tech.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {tech.photo_url ? (
                            <img
                              src={tech.photo_url}
                              alt={`${tech.first_name} ${tech.last_name}`}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#39C0C3]"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#0B2E51] flex items-center justify-center text-white font-bold">
                              {tech.first_name[0]}
                              {tech.last_name[0]}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {tech.first_name} {tech.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tech.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tech.years_experience ? `${tech.years_experience} years` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(tech.updated_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(tech.id, tech.is_active)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            tech.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tech.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleShareTechnician(tech.id, tech.first_name, tech.last_name)}
                            className="text-[#39C0C3] hover:text-[#2da5a8] transition-colors"
                            title="Share with customer"
                          >
                            <Share2 size={18} />
                          </button>
                          <button
                            onClick={() => copyLink(tech.id)}
                            className="text-[#0B2E51] hover:text-[#39C0C3] transition-colors"
                            title="Copy link"
                          >
                            {copiedId === tech.id ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                          </button>
                          <Link
                            to={`/tech/${tech.id}`}
                            target="_blank"
                            className="text-[#0B2E51] hover:text-[#39C0C3] transition-colors"
                            title="View profile"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <button
                            onClick={() => handleEditTechnician(tech.id)}
                            className="text-gray-600 hover:text-[#39C0C3] transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => deleteTechnician(tech.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <TechnicianModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        technicianId={editingTechnicianId}
      />

      {sharingTechnician && company && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={handleShareModalClose}
          technicianId={sharingTechnician.id}
          technicianName={sharingTechnician.name}
          companyId={company.id}
        />
      )}
    </div>
  );
}
