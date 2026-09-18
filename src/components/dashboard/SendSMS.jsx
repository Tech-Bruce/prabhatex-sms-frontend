import React, { useState } from 'react';
import { Send, Users, MessageSquare } from 'lucide-react';

const SendSMS = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">SMS Campaign</h2>
        <p className="text-slate-500">
          Create and send SMS messages to your uploaded customer list.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Compose Message</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Summer Promo 2026"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-slate-700">Message Content</label>
                  <span className="text-xs text-slate-400">{message.length}/160 characters</span>
                </div>
                <textarea 
                  rows="5"
                  placeholder="Type your SMS message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Tip: Use personalization tags like <code>{`{name}`}</code> to insert customer names.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Campaign Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Users className="h-5 w-5 text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Recipients</p>
                  <p className="text-xs text-slate-500">Sending to 4,520 verified active customers.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Estimated Cost</span>
                  <span className="font-medium text-slate-900">$45.20</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Account Balance</span>
                  <span className="font-medium text-emerald-600">$120.00</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)]">
              <Send className="h-4 w-4" />
              Send Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendSMS;
