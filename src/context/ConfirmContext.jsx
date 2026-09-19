import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
    onCancel: null
  });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        message,
        onConfirm: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 transform transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-full border border-amber-100 text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Confirm Action</h3>
              </div>
              <button onClick={modalState.onCancel} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-600 mb-6 pl-[3.25rem] text-sm leading-relaxed">{modalState.message}</p>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
              <button 
                onClick={modalState.onCancel}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={modalState.onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
