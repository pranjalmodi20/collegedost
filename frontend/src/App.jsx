import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AskModal from './components/AskModal';
import ShareModal from './components/ShareModal';
import AuthModal from './components/AuthModal';
import { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const PharmacyPage = lazy(() => import('./pages/PharmacyPage'));
const LawPage = lazy(() => import('./pages/LawPage'));
const JEEMainPredictor = lazy(() => import('./pages/JEEMainPredictor'));
const JEEMainRankPredictor = lazy(() => import('./pages/JEEMainRankPredictor'));
const InternationalColleges = lazy(() => import('./pages/InternationalColleges'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));



function App() {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Simple loading spinner
  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
        <Navbar
          onOpenAskModal={() => setIsAskModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
            <Route path="/pharmacy" element={<PharmacyPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
            <Route path="/law" element={<LawPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
            <Route path="/jee-main-predictor" element={<JEEMainPredictor onOpenAuthModal={() => setIsAuthModalOpen(true)} />} />
            <Route path="/jee-main-rank-predictor" element={<JEEMainRankPredictor onOpenAuthModal={() => setIsAuthModalOpen(true)} />} />
            <Route path="/international-colleges" element={<InternationalColleges />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Suspense>

        <Footer />
        <AskModal isOpen={isAskModalOpen} onClose={() => setIsAskModalOpen(false)} />
        <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </Router>
  )
}

export default App
