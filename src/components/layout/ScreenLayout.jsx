import React, { useEffect } from 'react';
import logo from '../../assets/logo.png';
import bgImage from '../../assets/login-bg.png';

/**
 * Loads the two brand typefaces used by this layout:
 * Fraunces (serif, headline) + Inter (sans, everything else).
 * If your project already loads fonts globally (e.g. in index.html
 * or a global stylesheet), remove this hook and add the same
 * <link> tags there instead — it's included here just so this
 * component works out of the box.
 */
const useBrandFonts = () => {
  useEffect(() => {
    const id = 'prabha-tex-brand-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);
};

const ScreenLayout = ({ children, title, subtitle }) => {
  useBrandFonts();

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1C2541] flex flex-col md:flex-row relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Left Panel: Branding */}
      <div 
        className="w-full lg:w-1/2 relative flex flex-col justify-between p-8 md:p-12 lg:p-16 z-10 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <img src={logo} alt="Prabha Tex Logo" className="h-20 w-auto mb-12 object-contain" />

          {(title || subtitle) && (
            <div className="mt-auto max-w-md">
              {title && (
                <>
                  <h1
                    className="text-4xl lg:text-[3.25rem] leading-[1.1] font-medium tracking-tight mb-4"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    <span className="text-[#D4AF37]">Prabha Tex</span> <span className="text-white">Admin</span>
                  </h1>
                  <div className="flex items-center gap-2 mb-6 opacity-80">
                    <div className="h-px bg-[#D4AF37] w-8" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
                    <div className="h-px bg-[#D4AF37] w-8" />
                  </div>
                </>
              )}
              {subtitle && (
                <p className="text-base lg:text-lg text-slate-200 leading-relaxed font-light mb-8">
                  {subtitle}
                </p>
              )}
              <div className="text-[#D4AF37] tracking-[0.3em] text-xs font-semibold leading-loose">
                TRADITION<br/>WEAVES<br/>TRUST
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 mt-16 text-xs text-slate-300 font-light">
          &copy; {new Date().getFullYear()} Prabha Tex. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex-1 flex flex-col justify-center items-center p-6 sm:p-10 relative bg-[#F9F6F0]">
        <div className="w-full max-w-md bg-white rounded-xl border border-[#D4AF37]/40 shadow-2xl p-8 sm:p-10 relative z-10">
          {children}
        </div>
      </div>

    </div>
  );
};

export default ScreenLayout;