import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Loader2, CheckCircle2, XCircle, Phone, Clock, FileText, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

const SMSHistory = () => {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFromDate('');
    setToDate('');
  };

  const handleClearHistory = async () => {
    if (!(await confirm('Are you sure you want to delete all SMS history? This action cannot be undone.'))) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/couriers/sms-logs/all`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setData([]);
      } else {
        showToast(result.message || 'Failed to delete SMS history', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/couriers/sms-logs`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Failed to fetch SMS logs');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(item => {
    const matchesSearch = 
      (item.phoneNumber && item.phoneNumber.includes(searchTerm)) ||
      (item.awbNo && item.awbNo.toLowerCase().includes(searchTerm.toLowerCase()));
      
    let matchesDate = true;
    if (fromDate || toDate) {
      const itemDate = new Date(item.createdAt);
      
      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        if (itemDate < from) matchesDate = false;
      }
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (itemDate > to) matchesDate = false;
      }
    }
    
    return matchesSearch && matchesDate;
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-slate-500 font-medium">Loading SMS history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-indigo-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SMS History</h1>
          <p className="text-slate-500 text-sm mt-1">View the delivery log of all SMS messages sent to customers.</p>
        </div>
        <div className="flex flex-col lg:flex-row w-full xl:w-auto items-stretch lg:items-center gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by Phone or AWB No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="flex-1 sm:w-36 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-slate-600"
                title="From Date"
              />
              <span className="text-slate-400 text-sm">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="flex-1 sm:w-36 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-slate-600"
                title="To Date"
              />
              {(searchTerm || fromDate || toDate) && (
                <button
                  onClick={handleResetFilters}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0"
                  title="Reset Filters"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleClearHistory}
            disabled={isDeleting || data.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 hover:text-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full lg:w-auto mt-2 lg:mt-0"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Clear All
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <MessageSquare className="h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            {data.length === 0 ? "No SMS logs found." : "No results match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`flex-shrink-0 p-2 rounded-xl ${
                    item.status === 'Sent' 
                      ? 'bg-emerald-50 border border-emerald-200/50' 
                      : 'bg-red-50 border border-red-200/50'
                  }`}>
                    {item.status === 'Sent' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="text-base font-bold text-slate-900 tracking-tight">{item.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  item.status === 'Sent'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                    : 'bg-red-50 text-red-600 border-red-200/60'
                }`}>
                  {item.status === 'Sent' ? 'Sent' : 'Failed'}
                </span>
              </div>

              {/* Divider */}
              <div className="mx-6 border-t border-slate-100"></div>

              {/* Card Details */}
              <div className="p-6 pt-4 space-y-3">
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-500 w-14 flex-shrink-0">Time</span>
                  <span className="text-slate-800 font-medium">
                    {new Date(item.createdAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {item.awbNo && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0">AWB</span>
                    <span className="text-slate-800 font-medium break-words">{item.awbNo}</span>
                  </div>
                )}

                {/* Message Preview */}
                {item.message && (
                  <div className="mt-2 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Message</p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-500 px-1">
          <span>Showing <span className="font-medium text-slate-700">{filteredData.length}</span> logs</span>
        </div>
      )}
    </div>
  );
};

export default SMSHistory;
