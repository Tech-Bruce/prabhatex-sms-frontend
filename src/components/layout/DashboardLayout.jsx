import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, UploadCloud, LogOut, Settings, Bell, Menu, X, Users, MessageSquare, ArrowUp } from 'lucide-react';
import logo from '../../assets/logo.png';

const DashboardLayout = ({ children, activePage, setActivePage, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef(null);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activePage]);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Prabha Tex
          </div>
          <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <button
            onClick={() => setActivePage('professional')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activePage === 'professional'
                ? 'bg-indigo-500/10 text-indigo-600 font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="h-5 w-5" />
            Professional Data
          </button>

          <button
            onClick={() => setActivePage('stcourier')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activePage === 'stcourier'
                ? 'bg-indigo-500/10 text-indigo-600 font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="h-5 w-5" />
            ST Courier Data
          </button>
          
          <button
            onClick={() => setActivePage('upload')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activePage === 'upload'
                ? 'bg-indigo-500/10 text-indigo-600 font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="h-5 w-5" />
            Upload Data
          </button>

          <button
            onClick={() => setActivePage('sms')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activePage === 'sms'
                ? 'bg-indigo-500/10 text-indigo-600 font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            SMS History
          </button>

          <button
            onClick={() => setActivePage('multiple-orders-sms')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activePage === 'multiple-orders-sms'
                ? 'bg-indigo-500/10 text-indigo-600 font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            Multi Order SMS
          </button>

          <button
            onClick={() => setActivePage('customsms')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activePage === 'customsms'
                ? 'bg-indigo-500/10 text-indigo-600 font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            Custom SMS
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden w-full">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold capitalize hidden sm:block">{activePage.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
          
            <div className="h-14 w-14 ml-2 flex items-center justify-center">
              <img src={logo} alt="Prabha Tex" className="h-full w-full object-contain drop-shadow-sm" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-auto p-4 sm:p-8 relative"
        >
          {/* Subtle Background Effect */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
          
          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all duration-300 z-50 hover:-translate-y-1"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
