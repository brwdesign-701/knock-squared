import { useState } from 'react';
import { X, Mail, MessageSquare, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicianId: string;
  technicianName: string;
  companyId: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  technicianId,
  technicianName,
  companyId,
}: ShareModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'sms'>('email');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = crypto.randomUUID();
      const shareUrl = `${window.location.origin}/tech/${technicianId}?token=${token}`;

      const { error: insertError } = await supabase
        .from('share_events')
        .insert({
          technician_id: technicianId,
          company_id: companyId,
          customer_name: customerName,
          delivery_method: deliveryMethod,
          contact_info: contact,
          share_token: token,
        });

      if (insertError) throw insertError;

      const functionName = deliveryMethod === 'email' ? 'send-email' : 'send-sms';
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const payload = deliveryMethod === 'email'
        ? {
            to: contact,
            subject: `Meet Your Technician: ${technicianName}`,
            html: `
              <h2>Hello ${customerName},</h2>
              <p>Your technician <strong>${technicianName}</strong> is ready to serve you!</p>
              <p>View their profile and qualifications here:</p>
              <p><a href="${shareUrl}" style="background-color: #39C0C3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Technician Profile</a></p>
              <p>We look forward to providing you with excellent service.</p>
            `,
          }
        : {
            to: contact,
            message: `Hello ${customerName}! Your technician ${technicianName} is ready to serve you. View their profile: ${shareUrl}`,
          };

      const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send');
      }

      setSuccess(`Profile shared successfully via ${deliveryMethod}!`);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCustomerName('');
    setContact('');
    setDeliveryMethod('email');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Share Technician Profile</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <p className="text-gray-600 mb-4">
              Share <span className="font-semibold text-gray-800">{technicianName}</span>'s profile with a customer
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent"
              placeholder="Enter customer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Delivery Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('email')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  deliveryMethod === 'email'
                    ? 'border-[#39C0C3] bg-[#39C0C3] bg-opacity-10 text-[#39C0C3]'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Mail size={20} />
                <span className="font-medium">Email</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod('sms')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  deliveryMethod === 'sms'
                    ? 'border-[#39C0C3] bg-[#39C0C3] bg-opacity-10 text-[#39C0C3]'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <MessageSquare size={20} />
                <span className="font-medium">SMS</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {deliveryMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={deliveryMethod === 'email' ? 'email' : 'tel'}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#39C0C3] focus:border-transparent"
              placeholder={deliveryMethod === 'email' ? 'customer@example.com' : '+1234567890'}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#39C0C3] text-white px-4 py-2 rounded-lg hover:bg-[#2da5a8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send size={18} />
                  Send Link
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
