import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    showToast('Logged out securely.', 'info');
    setIsProfileOpen(false);
    navigate('/');
  };

  // Hide standalone navlinks from landing page if desired, but user asked for global navbar across ALL pages.
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className="fixed w-full top-0 z-[80] border-b border-white/5 bg-[#03060D]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#03060D]/60">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Activity className="w-6 h-6 text-primary group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,0.8)] transition-all duration-500" />
          </div>
          <span className="font-display font-bold text-xl tracking-widest text-[#E8F4FD] group-hover:text-primary transition-colors duration-300">
            IPO_XRAY
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2 ml-8 flex-1">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`px-4 py-2 rounded-lg font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-300 font-semibold
                ${isActive(link.path) ? 'text-primary bg-primary/10 border border-primary/20 shadow-[inset_0_0_15px_rgba(0,212,255,0.1)]' : 'text-[#6B8CAE] hover:text-white hover:bg-white/5 border border-transparent'}
              `}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Profile / Auth Container */}
        <div className="hidden md:flex items-center">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 border border-primary/30 hover:border-primary hover:bg-primary/20 transition-all font-display font-bold text-primary shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:shadow-neon-cyan"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl glass-card border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5 bg-[#0A1320]/50">
                    <p className="text-sm font-semibold text-textPrimary truncate">{user.name}</p>
                    <p className="text-xs text-[#6B8CAE] truncate">{user.email}</p>
                  </div>
                  <div className="p-2 space-y-1 bg-[#02050A]">
                    <button className="w-full text-left px-3 py-2 rounded text-sm text-[#E8F4FD] hover:bg-white/5 flex items-center transition-colors">
                      <User className="w-4 h-4 mr-3 text-[#6B8CAE]" /> Profile Settings
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded text-sm text-danger hover:bg-danger/10 flex items-center transition-colors group">
                      <LogOut className="w-4 h-4 mr-3 text-danger/70 group-hover:text-danger" /> Sign Out Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4 flex items-center">
              <Link to="/login" className="text-[#6B8CAE] hover:text-white font-mono text-[11px] uppercase tracking-widest transition-colors">Sign In</Link>
              <Link to="/signup" className="px-5 py-2 bg-primary text-[#050B18] font-display font-bold uppercase tracking-wider rounded-md hover:bg-[#00e1ff] shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-neon-cyan transition-all text-xs">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden text-[#6B8CAE] hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-white/5 bg-[#02050A]">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-4 rounded-lg font-mono text-[11px] uppercase tracking-widest ${isActive(link.path) ? 'bg-primary/10 text-primary border border-primary/20' : 'text-[#6B8CAE] hover:bg-white/5 border border-transparent'}`}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <div className="pt-4 flex flex-col space-y-3 border-t border-white/5 mt-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full px-4 py-3 rounded-lg border border-white/10 text-center font-mono text-[11px] uppercase tracking-widest text-[#6B8CAE]">Sign In</Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full px-4 py-3 rounded-lg bg-primary text-[#050B18] text-center font-display font-bold text-xs uppercase tracking-widest transition-all">Get Started</Link>
              </div>
            )}
            {user && (
              <div className="pt-4 border-t border-white/5 mt-2">
                <div className="px-4 py-2 mb-4 bg-white/5 rounded-lg">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-[#6B8CAE]">{user.email}</p>
                </div>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full px-4 py-4 text-left rounded-lg bg-danger/10 border border-danger/20 text-danger font-mono text-[11px] font-bold tracking-widest uppercase flex items-center justify-center">
                   <ShieldAlert className="w-4 h-4 mr-2" /> Kill Active Session
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
