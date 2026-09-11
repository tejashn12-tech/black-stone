import React, { useState, useEffect } from 'react';
import { BSFLogo } from '../common/BSFLogo';
import {
  Menu,
  X,
  User,
  ShieldCheck,
  Phone,
  Sparkles,
  Dumbbell,
  Calculator,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  onOpenTrialModal: () => void;
  onNavigateSection: (sectionId: string) => void;
  currentView: string;
  onSetView: (view: 'home' | 'exercises' | 'calculators') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdminLogin,
  onOpenTrialModal,
  onNavigateSection,
  currentView,
  onSetView
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    onSetView('home');
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      onNavigateSection(sectionId);
    }, 50);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
      id="bsf-main-navigation-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => {
            onSetView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="focus:outline-none"
        >
          <BSFLogo size="md" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-zinc-300">
          <button
            onClick={() => handleNavClick('about')}
            className="hover:text-orange-400 transition"
          >
            About BSF
          </button>

          <button
            onClick={() => handleNavClick('amenities')}
            className="hover:text-orange-400 transition"
          >
            Facilities & Gear
          </button>

          <button
            onClick={() => handleNavClick('pricing')}
            className="hover:text-orange-400 transition"
          >
            Membership Plans
          </button>

          {/* Exercises Submenu / Page */}
          <button
            onClick={() => {
              onSetView('exercises');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 transition ${
              currentView === 'exercises' ? 'text-orange-400 font-black' : 'hover:text-orange-400'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Exercises</span>
          </button>

          {/* Fitness Calculators */}
          <button
            onClick={() => {
              onSetView('calculators');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 transition ${
              currentView === 'calculators' ? 'text-orange-400 font-black' : 'hover:text-orange-400'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>BMI & BMR</span>
          </button>

          <button
            onClick={() => handleNavClick('trainers')}
            className="hover:text-orange-400 transition"
          >
            Coaches
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="hover:text-orange-400 transition"
          >
            Mysuru Location
          </button>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Free Trial CTA */}
          <button
            onClick={onOpenTrialModal}
            className="px-4 py-2 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free Trial Pass</span>
          </button>

          {/* Staff Admin Portal */}
          <button
            onClick={onOpenAdminLogin}
            className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-zinc-900 rounded-xl transition border border-transparent hover:border-zinc-800"
            title="Gym Management & Owner Dashboard"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/98 border-b border-zinc-800 px-6 py-6 space-y-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 text-sm font-bold uppercase tracking-wider text-zinc-300">
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2 hover:text-orange-400 transition border-b border-zinc-900"
            >
              About Black Stone Fitness
            </button>
            <button
              onClick={() => handleNavClick('amenities')}
              className="text-left py-2 hover:text-orange-400 transition border-b border-zinc-900"
            >
              Gym Facilities & Machinery
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className="text-left py-2 hover:text-orange-400 transition border-b border-zinc-900"
            >
              Membership Packages
            </button>
            <button
              onClick={() => {
                onSetView('exercises');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left py-2 text-orange-400 font-extrabold flex items-center justify-between border-b border-zinc-900"
            >
              <span>Exercises</span>
              <span className="text-[10px] bg-orange-400 text-black px-2 py-0.5 rounded font-mono">1,000</span>
            </button>
            <button
              onClick={() => {
                onSetView('calculators');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left py-2 hover:text-orange-400 transition border-b border-zinc-900 flex items-center justify-between"
            >
              <span>BMI & BMR Fitness Calculators</span>
              <Calculator className="w-4 h-4 text-orange-400" />
            </button>
            <button
              onClick={() => handleNavClick('trainers')}
              className="text-left py-2 hover:text-orange-400 transition border-b border-zinc-900"
            >
              Certified Coaches
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-2 hover:text-orange-400 transition"
            >
              Mysuru Branch Location & Hours
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-2.5">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenTrialModal();
              }}
              className="w-full py-3 bg-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book 1-Day Free Workout Trial</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdminLogin();
              }}
              className="w-full py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Gym Staff / Owner Portal</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
