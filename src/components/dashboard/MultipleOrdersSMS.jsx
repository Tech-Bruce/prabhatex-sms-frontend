import React, { useState, useEffect } from 'react';
import { Users, Search, Loader2, CheckCircle2, XCircle, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const MultipleOrdersSMS = () => {
  const getThreeDaysAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    return d.toISOString().split('T')[0];
  };

  const [rawLogs, setRawLogs] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [fromDate, setFromDate] = useState(getThreeDaysAgo());
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/couriers/sms-logs`);
        const result = await response.json();
        
        if (result.success) {
          setRawLogs(result.data);
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

  useEffect(() => {
    let filtered = rawLogs;
    if (fromDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => new Date(item.createdAt) >= start);
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => new Date(item.createdAt) <= end);
    }

    const groups = filtered.reduce((acc, item) => {
      if (!item.phoneNumber) return acc;
      
      if (!acc[item.phoneNumber]) {
        acc[item.phoneNumber] = [];
      }
      acc[item.phoneNumber].push(item);
      return acc;
    }, {});

    const multiOrderGroups = Object.entries(groups)
      .filter(([_, logs]) => logs.length > 1)
      .map(([phoneNumber, logs]) => ({
        phoneNumber,
        logs: logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }));
      
    setGroupedData(multiOrderGroups);
  }, [rawLogs, fromDate, toDate]);

  const toggleGroup = (phoneNumber) => {
    setExpandedGroups(prev => ({
      ...prev,
      [phoneNumber]: !prev[phoneNumber]
    }));
  };

  const handleDeleteAllData = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all SMS logs? This action cannot be undone.")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/couriers/sms-logs/all`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        setRawLogs([]);
        setGroupedData([]);
      } else {
        alert(result.message || 'Failed to delete data');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const filteredData = groupedData.filter(group => 
    group.phoneNumber.includes(searchTerm) ||
    group.logs.some(log => log.awbNo && log.awbNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-slate-500 font-medium">Analyzing multiple orders...</p>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Multi Order SMS</h1>
          <p className="text-slate-500 text-sm mt-1">View SMS history for customers who have multiple orders.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center flex-wrap sm:flex-nowrap gap-3">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
            />
            <span className="text-slate-400 text-sm">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
            />
          </div>
          <div className="relative flex-1 sm:w-72 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by Phone or AWB No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => {
              setFromDate('');
              setToDate('');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
          >
            Reset
          </button>
          <button 
            onClick={handleDeleteAllData}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
          >
            Erase All Data
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Users className="h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            {groupedData.length === 0 ? "No multiple orders found." : "No results match your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map((group) => {
            const isExpanded = expandedGroups[group.phoneNumber];
            
            return (
              <div 
                key={group.phoneNumber} 
                className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                {/* Group Header */}
                <div 
                  onClick={() => toggleGroup(group.phoneNumber)}
                  className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                      <h3 className="text-lg font-bold text-slate-900">{group.phoneNumber}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg">
                        {group.logs.length} Orders
                      </span>
                    </div>
                    <div className="p-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Logs */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {group.logs.map((item, idx) => (
                        <div 
                          key={item.id || idx} 
                          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex flex-col">
                               {item.awbNo && (
                                <div className="flex items-center gap-2 text-sm">
                                  <FileText className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-800 font-bold">{item.awbNo}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-xs mt-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-slate-500 font-medium">
                                  {new Date(item.createdAt).toLocaleString('en-IN', {
                                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                            
                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold border ${
                              item.status === 'Sent'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                : 'bg-red-50 text-red-600 border-red-200/60'
                            }`}>
                              {item.status === 'Sent' ? (
                                <><CheckCircle2 className="w-3 h-3 mr-1" /> Sent</>
                              ) : (
                                <><XCircle className="w-3 h-3 mr-1" /> Failed</>
                              )}
                            </span>
                          </div>

                          {item.message && (
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 line-clamp-3 hover:line-clamp-none transition-all">
                              {item.message}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-500 px-1">
          <span>Showing <span className="font-medium text-slate-700">{filteredData.length}</span> numbers with multiple orders</span>
        </div>
      )}
    </div>
  );
};

export default MultipleOrdersSMS;
