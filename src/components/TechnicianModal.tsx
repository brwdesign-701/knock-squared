import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { X, Save, Upload, Plus } from 'lucide-react';

interface TechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  technicianId?: string | null;
}

export default function TechnicianModal({ isOpen, onClose, onSave, technicianId }: TechnicianModalProps) {
  const { company } = useAuth();
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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (isOpen && technicianId) {
      fetchTechnician();
    } else if (isOpen && !technicianId) {
      resetForm();
    }
  }, [isOpen, technicianId]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setTitle('');
    setPhotoUrl('');
    setBio('');
    setYearsExperience('');
    setCertifications([]);
    setNewCert('');
    setIsActive(true);
    setError('');
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const fetchTechnician = async () => {
    if (!technicianId) return;

    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('id', technicianId)
      .maybeSingle();

    if (error) {
      setError('Failed to load technician');
      return;
    }

    if (data) {
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setTitle(data.title);
      setPhotoUrl(data.photo_url || '');
      setPhotoPreview(data.photo_url || '');
      setBio(data.bio || '');
      setYearsExperience(data.years_experience?.toString() || '');
      setCertifications(data.certifications || []);
      setIsActive(data.is_active);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;

    setUploadingPhoto(true);
    try {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          setUploadingPhoto(false);
          resolve(reader.result as string);
        };
        reader.readAsDataURL(photoFile);
      });
    } catch (err) {
      console.error('Error processing photo:', err);
      setUploadingPhoto(false);
      return null;
    }
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

    try {
      let finalPhotoUrl = photoUrl;

      if (photoFile) {
        const uploadedUrl = await uploadPhoto();
        if (uploadedUrl) {
          finalPhotoUrl = uploadedUrl;
        }
      }

      const technicianData = {
        company_id: company.id,
        first_name: firstName,
        last_name: lastName,
        title,
        photo_url: finalPhotoUrl || null,
        bio: bio || null,
        years_experience: yearsExperience ? parseInt(yearsExperience) : null,
        certifications: certifications.length > 0 ? certifications : null,
        is_active: isActive,
      };

      if (technicianId) {
        const { error } = await supabase
          .from('technicians')
          .update(technicianData)
          .eq('id', technicianId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('technicians').insert(technicianData);

        if (error) throw error;
      }

      resetForm();
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save technician');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#0B2E51]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {technicianId ? 'Edit Technician' : 'Add New Technician'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Role/Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Senior HVAC Technician"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo
                </label>
                <div className="flex items-center gap-4">
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <label
                      htmlFor="photoUpload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-sm font-medium"
                    >
                      <Upload size={16} />
                      {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <input
                      id="photoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Short Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell customers about this technician's background and expertise..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    placeholder="Add certification"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-3 py-2 bg-[#0B2E51] hover:bg-[#0a2642] text-white rounded-lg transition-all flex items-center gap-1 text-sm"
                  >
                    <Plus size={16} />
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
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#39C0C3] border-gray-300 rounded focus:ring-[#39C0C3]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (visible to customers)
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || uploadingPhoto}
                className="flex-1 bg-[#39C0C3] hover:bg-[#2da5a8] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {loading || uploadingPhoto ? 'Saving...' : technicianId ? 'Update' : 'Add Technician'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all font-semibold"
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
