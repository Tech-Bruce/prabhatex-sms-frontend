import React, { useState, useEffect } from 'react';
import { Search, Loader2, Trash2, Package, MapPin, Calendar, Weight, IndianRupee, CheckSquare, Square } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const ProfessionalData = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const filteredData = data.filter(item => 
    (item.consignmentNo && item.consignmentNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.destination && item.destination.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(item => item.id));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSendSMS = async () => {
    if (!window.confirm(`Are you sure you want to send SMS to ${selectedIds.length} customers?`)) return;
    setIsSendingSMS(true);
    try {
      const res = await fetch(`${API_BASE_URL}/couriers/professional/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const resData = await res.json();
      if (resData.success) {
        alert(resData.message || "SMS sent successfully");
        setSelectedIds([]);
      } else {
        alert(resData.message || "Failed to send SMS");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      alert("Error connecting to server");
    } finally {
      setIsSendingSMS(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you absolutely sure you want to delete ALL Professional Courier records? This action cannot be undone.")) return;
    setIsDeletingAll(true);
    try {
      const res = await fetch(`${API_BASE_URL}/couriers/professional/all`, {
        method: "DELETE",
      });
      const resData = await res.json();
      if (resData.success) {
        setData([]);
        setSelectedIds([]);
      } else {
        alert(resData.message || "Failed to delete all records");
      }
    } catch (error) {
      console.error("Error deleting all records:", error);
      alert("Error connecting to server");
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} records? This action cannot be undone.`)) return;
    setIsDeletingBulk(true);
    try {
      const res = await fetch(`${API_BASE_URL}/couriers/professional/delete-bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const resData = await res.json();
      if (resData.success) {
        setData(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
      } else {
        alert(resData.message || "Failed to delete records");
      }
    } catch (error) {
      console.error("Error deleting records:", error);
      alert("Error connecting to server");
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/couriers/professional/${id}`, {
        method: "DELETE",
      });
      const resData = await res.json();
      if (resData.success) {
        setData(prev => prev.filter(item => item.id !== id));
      } else {
        alert(resData.message || "Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error connecting to server");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/couriers/professional`);
        const resData = await response.json();
        if (resData.success) {
          setData(resData.data);
        } else {
          setError(resData.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Network error. Could not connect to backend.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Professional Courier Data</h2>
          <p className="text-slate-500 text-sm mt-1">View all data extracted from Professional Courier uploads.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Delete All Button */}
          {data.length > 0 && (
            <button 
              onClick={handleDeleteAll}
              disabled={isDeletingAll || isDeletingBulk || isSendingSMS}
              className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors flex items-center gap-2 ${isDeletingAll ? 'opacity-70 cursor-not-allowed' : ''}`}
              title="Delete all records"
            >
              {isDeletingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span className="hidden sm:inline">Delete All</span>
            </button>
          )}
          
          {selectedIds.length > 0 && (
            <>
              <button 
                onClick={handleBulkDelete}
                disabled={isDeletingBulk || isSendingSMS}
                className={`px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${isDeletingBulk ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isDeletingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete ({selectedIds.length})
              </button>
              <button 
                onClick={handleSendSMS}
                disabled={isSendingSMS || isDeletingBulk}
                className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors flex items-center gap-2 ${isSendingSMS ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSendingSMS ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSendingSMS ? 'Sending...' : `Send SMS (${selectedIds.length})`}
              </button>
            </>
          )}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search consignment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Select All Bar */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
          >
            {selectedIds.length === filteredData.length ? (
              <CheckSquare className="w-4.5 h-4.5 text-indigo-600" />
            ) : (
              <Square className="w-4.5 h-4.5 text-slate-400" />
            )}
            {selectedIds.length === filteredData.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-slate-500">
            {selectedIds.length > 0 ? (
              <span className="text-indigo-600 font-medium">{selectedIds.length} selected</span>
            ) : (
              `${filteredData.length} records`
            )}
          </span>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-indigo-500" />
          <p className="text-slate-500 font-medium">Loading data...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No data found.</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or upload new data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-50/30 shadow-indigo-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleSelectRow(item.id)}
                      className="flex-shrink-0 mt-0.5"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">Consignment</p>
                      <p className="text-base font-bold text-slate-900 tracking-tight break-all">{item.consignmentNo || 'N/A'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* COD Amount - Prominent */}
                <div className="px-6 pb-4">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-3 py-1.5 rounded-lg">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span className="text-sm font-bold">{item.amount ? parseFloat(item.amount).toFixed(2) : '0.00'}</span>
                    <span className="text-xs text-emerald-500 font-medium ml-0.5">COD</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-slate-100"></div>

                {/* Card Details */}
                <div className="p-6 pt-4 space-y-3">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 w-16 flex-shrink-0">Date</span>
                    <span className="text-slate-800 font-medium">
                      {item.bookingDate ? new Date(item.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 w-16 flex-shrink-0">To</span>
                    <span className="text-slate-800 font-medium break-words">
                      {item.toAddress || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 w-16 flex-shrink-0">Dest.</span>
                    <span className="text-slate-800 font-medium break-words">{item.destination || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-sm">
                    <Weight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 w-16 flex-shrink-0">Weight</span>
                    <span className="text-slate-800 font-medium">{item.weight || 'N/A'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-500 px-1">
          <span>Showing <span className="font-medium text-slate-700">{filteredData.length}</span> records</span>
        </div>
      )}
    </div>
  );
};

export default ProfessionalData;
