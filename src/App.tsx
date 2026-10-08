import React, { useState, Suspense, lazy } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { Navbar } from './components/public/Navbar';
import { HeroSection } from './components/public/HeroSection';
import { AboutSection } from './components/public/AboutSection';
import { AmenitiesSection } from './components/public/AmenitiesSection';
import { PricingSection } from './components/public/PricingSection';
import { TrainersSection } from './components/public/TrainersSection';
import { TransformationsSection } from './components/public/TransformationsSection';
import { ContactLocationSection } from './components/public/ContactLocationSection';
import { Footer } from './components/public/Footer';
import { TrialBookingModal } from './components/public/TrialBookingModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { PrivacyNoticeModal } from './components/common/PrivacyNoticeModal';
import { TermsOfServiceModal } from './components/common/TermsOfServiceModal';
import { DataRightsModal } from './components/common/DataRightsModal';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { MembershipPackage } from './types';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components to drastically reduce initial JS load
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ExerciseLibrary = lazy(() => import('./components/exercises/ExerciseLibrary').then(m => ({ default: m.ExerciseLibrary })));
const CalculatorsHub = lazy(() => import('./components/calculators/CalculatorsHub').then(m => ({ default: m.CalculatorsHub })));

const MainAppContent: React.FC = () => {
  const { isAdminAuthenticated } = useGym();

  // Navigation state: 'public' | 'admin' - supports URL hash (#admin) or persistent admin state
  const [mainView, setMainView] = useState<'public' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('admin') || path.includes('/admin') || search.includes('view=admin')) {
        return 'admin';
      }
    }
    return 'public';
  });
  const [publicSubview, setPublicSubview] = useState<'home' | 'exercises' | 'calculators'>('home');

  // Sync hash changes in host/published environments
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('admin')) {
        setMainView('admin');
      } else if (hash === '#home' || hash === '' || hash === '#public') {
        setMainView('public');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Modals state
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isPrivacyNoticeModalOpen, setIsPrivacyNoticeModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isDataRightsModalOpen, setIsDataRightsModalOpen] = useState(false);

  // Smooth scroll handler for anchor links
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Select package from pricing
  const handleSelectPackage = (pkg: MembershipPackage) => {
    setIsTrialModalOpen(true);
  };

  // If viewing admin dashboard
  if (mainView === 'admin') {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 text-white text-sm font-semibold">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          <span>Opening Blackstone Fitness Desk...</span>
        </div>
      }>
        <AdminDashboard
          onBackToPublicSite={() => {
            setMainView('public');
            if (typeof window !== 'undefined' && window.location.hash.includes('admin')) {
              history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
        <CookieConsentBanner onOpenPrivacyNotice={() => setIsPrivacyNoticeModalOpen(true)} />
        <PrivacyNoticeModal
          isOpen={isPrivacyNoticeModalOpen}
          onClose={() => setIsPrivacyNoticeModalOpen(false)}
        />
      </Suspense>
    );
  }

  // Public View (Home, 1,000 Exercises, or Calculators)
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      
      {/* Top Main Navbar */}
      <Navbar
        currentView={publicSubview}
        onSetView={setPublicSubview}
        onNavigateSection={handleScrollToSection}
        onOpenAdminLogin={() => {
          if (isAdminAuthenticated) {
            setMainView('admin');
          } else {
            setIsAdminLoginModalOpen(true);
          }
        }}
        onOpenTrialModal={() => setIsTrialModalOpen(true)}
      />

      {/* Main Public Content */}
      <main className="flex-1 w-full">
        {publicSubview === 'home' && (
          <>
            <HeroSection
              onOpenTrialModal={() => setIsTrialModalOpen(true)}
              onExplorePlans={() => handleScrollToSection('pricing')}
              onExploreExercises={() => {
                setPublicSubview('exercises');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <AboutSection />

            <AmenitiesSection />

            <PricingSection
              onSelectPlan={handleSelectPackage}
              onOpenTrialModal={() => setIsTrialModalOpen(true)}
            />

            <TrainersSection
              onOpenTrialModal={() => setIsTrialModalOpen(true)}
            />

            <TransformationsSection />

            <ContactLocationSection />
          </>
        )}

        {publicSubview === 'exercises' && (
          <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Suspense fallback={
              <div className="p-20 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-semibold">
                <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
                <span>Loading 1,000+ Exercise Directory...</span>
              </div>
            }>
              <ExerciseLibrary />
            </Suspense>
          </div>
        )}

        {publicSubview === 'calculators' && (
          <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Suspense fallback={
              <div className="p-20 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-semibold">
                <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
                <span>Loading Fitness Calculators...</span>
              </div>
            }>
              <CalculatorsHub />
            </Suspense>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenAdminLogin={() => {
          if (isAdminAuthenticated) {
            setMainView('admin');
          } else {
            setIsAdminLoginModalOpen(true);
          }
        }}
        onOpenTrialModal={() => setIsTrialModalOpen(true)}
        onNavigateSection={handleScrollToSection}
        onSetView={setPublicSubview}
        onOpenPrivacyNotice={() => setIsPrivacyNoticeModalOpen(true)}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenDataRights={() => setIsDataRightsModalOpen(true)}
      />

      {/* Modals */}
      <TrialBookingModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        onOpenPrivacyNotice={() => setIsPrivacyNoticeModalOpen(true)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={() => {
          setMainView('admin');
          if (typeof window !== 'undefined') {
            window.location.hash = 'admin';
          }
        }}
      />

      <PrivacyNoticeModal
        isOpen={isPrivacyNoticeModalOpen}
        onClose={() => setIsPrivacyNoticeModalOpen(false)}
      />

      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      <DataRightsModal
        isOpen={isDataRightsModalOpen}
        onClose={() => setIsDataRightsModalOpen(false)}
      />

      {/* DPDP Consent Managed Cookie Banner */}
      <CookieConsentBanner onOpenPrivacyNotice={() => setIsPrivacyNoticeModalOpen(true)} />

    </div>
  );
};

export default function App() {
  return (
    <GymProvider>
      <MainAppContent />
    </GymProvider>
  );
}
