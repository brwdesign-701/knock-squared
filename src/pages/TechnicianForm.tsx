import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';

export default function TechnicianForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const { company } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCert, setNewCert] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      fetchTechnician();
    }
  }, [id, isEdit]);

  const fetchTechnician = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      setError('Failed to load technician');
      setFetchLoading(false);
      return;
    }

    if (data) {
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setTitle(data.title);
      setPhotoUrl(data.photo_url || '');
      setBio(data.bio || '');
      setYearsExperience(data.years_experience?.toString() || '');
      setCertifications(data.certifications || []);
      setIsActive(data.is_active);
    }

    setFetchLoading(false);
  };

  const addCertification = () => {
    if (newCert.trim() && !certifications.includes(newCert.trim())) {
      setCertifications([...certifications, newCert.trim()]);
      setNewCert('');
    }
  };

  const removeCertification = (cert: string) => {
    setCertifications(certifications.filter((c) => c !== cert));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setError('');
    setLoading(true);

    const technicianData = {
      company_id: company.id,
      first_name: firstName,
      last_name: lastName,
      title,
      photo_url: photoUrl || null,
      bio: bio || null,
      years_experience: yearsExperience ? parseInt(yearsExperience) : null,
      certifications: certifications.length > 0 ? certifications : null,
      is_active: isActive,
    };

    try {
      if (isEdit && id) {
        const { error } = await supabase
          .from('technicians')
          .update(technicianData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('technicians').insert(technicianData);

        if (error) throw error;
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save technician');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#0B2E51] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {isEdit ? 'Edit Technician' : 'Add New Technician'}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Senior HVAC Technician"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Photo URL
              </label>
              <input
                id="photoUrl"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Paste a URL to the technician's photo</p>
            </div>

            <div>
              <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                id="yearsExperience"
                type="number"
                min="0"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell customers about this technician's background and expertise..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  placeholder="Add a certification"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-4 py-3 bg-[#0B2E51] hover:bg-[#0a2642] text-white rounded-lg transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>
              {certifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-[#39C0C3] bg-opacity-10 text-[#0B2E51] px-3 py-1 rounded-full text-sm"
                    >
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeCertification(cert)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 text-[#39C0C3] border-gray-300 rounded focus:ring-[#39C0C3]"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (visible to customers)
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#39C0C3] hover:bg-[#2da5a8] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {loading ? 'Saving...' : isEdit ? 'Update Technician' : 'Add Technician'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
