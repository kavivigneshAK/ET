import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AnalyzerPage from './pages/AnalyzerPage';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-background text-textPrimary font-sans antialiased selection:bg-primary/30 pt-16">
            <Navbar />
            <main>
              <Routes>
                {/* Public Endpoints */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<LoginPage isSignup={true} />} />
                
                {/* Secure Gateway */}
                <Route element={<ProtectedRoutes />}>
                  <Route path="/analyze" element={<AnalyzerPage />} />
                  <Route path="/report/:id" element={<ReportPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
