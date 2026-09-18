import React, { useState } from 'react';
import { Send, Loader2, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const COURIER_OPTIONS = [
  { name: 'India Post', link: 'https://www.indiapost.gov.in/' },
  { name: 'DTDC', link: 'https://www.dtdc.com/track-your-shipment/' },
  { name: 'AKR Lorry Transports', link: 'https://akrexpress.com/' },
  { name: 'MSS (Mettur Transports)', link: 'https://metturtransports.com/' },
  { name: 'A1 Parcel Service (Lorry Transports)', link: 'https://www.a1parcel.in/' },
  { name: 'VRL Lorry Transport', link: 'https://www.vrlgroup.in/' }
];

const CustomSMS = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    awbNo: '',
    courierName: '',
    trackingLink: '',
    phoneNumber: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleCourierChange = (e) => {
    const selected = COURIER_OPTIONS.find(c => c.name === e.target.value);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        courierName: selected.name,
        trackingLink: selected.link
      }));
    } else {
      setFormData(prev => ({ ...prev, courierName: '', trackingLink: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.awbNo || !formData.courierName || !formData.phoneNumber) {
      setStatus({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/couriers/custom/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus({ type: 'success', message: 'SMS sent successfully!' });
        setFormData({
          customerName: '',
          awbNo: '',
          courierName: '',
          trackingLink: '',
          phoneNumber: ''
        });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to send SMS.' });
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      setStatus({ type: 'error', message: error.message || 'An error occurred while sending SMS.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Send Custom SMS</h3>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Send an order booking SMS to a customer manually.</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {status.message && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
                status.type === 'error' ? 'bg-red-50/50 border-red-100 text-red-700' : 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
              }`}>
                {status.type === 'error' ? (
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">AWB Number</label>
                <input
                  type="text"
                  name="awbNo"
                  value={formData.awbNo}
                  onChange={handleChange}
                  placeholder="e.g. 123456789"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Courier Partner</label>
                <div className="relative">
                  <select
                    name="courierName"
                    value={formData.courierName}
                    onChange={handleCourierChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 appearance-none"
                    required
                  >
                    <option value="">Select a courier</option>
                    {COURIER_OPTIONS.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {formData.trackingLink && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tracking Link</label>
                <div className="relative">
                  <input
                    type="text"
                    name="trackingLink"
                    value={formData.trackingLink}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100/50 text-slate-500 cursor-not-allowed"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-indigo-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send SMS
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomSMS;
