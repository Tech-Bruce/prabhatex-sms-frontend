
import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const UploadData = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [partner, setPartner] = useState('professional');
  const [stFormat, setStFormat] = useState('format2');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        original: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        original: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    // We'll upload the first file for now
    formData.append("file", files[0].original);
    formData.append("partner", partner);
    if (partner === 'st') {
      formData.append("stFormat", stFormat);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/couriers/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setFiles([]); // Clear on success
      } else {
        setMessage({ type: 'error', text: data.message || "Upload failed" });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage({ type: 'error', text: "Network error. Could not connect to backend." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-4 sm:space-y-6 w-full">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Courier Partner</h3>
        <div className="flex gap-4">
          <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${partner === 'professional' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
            <input type="radio" name="partner" value="professional" checked={partner === 'professional'} onChange={(e) => setPartner(e.target.value)} className="hidden" />
            <span className="font-medium">Professional Courier (CSV/Excel)</span>
          </label>
          <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${partner === 'st' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
            <input type="radio" name="partner" value="st" checked={partner === 'st'} onChange={(e) => setPartner(e.target.value)} className="hidden" />
            <span className="font-medium">ST Courier</span>
          </label>
        </div>
        
        {partner === 'st' && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Select ST Courier Format</h3>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${stFormat === 'format1' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                <input type="radio" name="stFormat" value="format1" checked={stFormat === 'format1'} onChange={(e) => setStFormat(e.target.value)} className="hidden" />
                <span className="font-medium text-sm">Format web</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${stFormat === 'format2' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                <input type="radio" name="stFormat" value="format2" checked={stFormat === 'format2'} onChange={(e) => setStFormat(e.target.value)} className="hidden" />
                <span className="font-medium text-sm">Format whatsapp</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div 
        className={`bg-white border-2 border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-12 flex flex-col items-center justify-center transition-all duration-200 ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="h-16 w-16 sm:h-20 sm:w-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
          <UploadCloud className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-center text-slate-900">Upload Customer Data</h3>
        <p className="text-slate-500 text-center text-sm sm:text-base max-w-md mb-6 sm:mb-8">
          Drag and drop your CSV, Excel, or PDF file here, or click to browse your computer.
        </p>
        
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf"
          onChange={handleFileSelect}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-slate-900 text-white hover:bg-slate-800 font-medium py-2 sm:py-2.5 px-6 rounded-xl transition-colors"
        >
          Browse Files
        </button>
      </div>

      {files.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <h4 className="font-semibold mb-4 text-lg text-slate-900">Uploaded Files</h4>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <File className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">{file.size}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(index)}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div>
              {message && (
                <p className={`text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {message.text}
                </p>
              )}
            </div>
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-2"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isUploading ? 'Processing...' : 'Process Files'}
            </button>
          </div>
        </div>
      )}
      {message && files.length === 0 && (
        <div className={`p-4 rounded-xl border ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
           {message.text}
        </div>
      )}
    </div>
  );
};

export default UploadData;
