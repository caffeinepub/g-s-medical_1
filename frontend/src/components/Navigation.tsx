import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Medicines', id: 'medicines' },
    { label: 'Sellers', id: 'sellers' },
    { label: 'Team', id: 'team' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-emerald border-b border-emerald-100'
          : 'bg-transparent'
      }`}
    >
      {/* Top bar */}
      <div className={`hidden md:block transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden' : 'h-auto'}`}>
        <div className="bg-emerald-900 text-white py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
              <a href="tel:+919766343454" className="flex items-center gap-1 hover:text-gold-300 transition-colors">
                <Phone size={11} />
                <span>Customer Care: +91 9766343454</span>
              </a>
              <a href="mailto:gauravsaswade@gsgroupswebstore.in" className="flex items-center gap-1 hover:text-gold-300 transition-colors">
                <Mail size={11} />
                <span>gauravsaswade@gsgroupswebstore.in</span>
              </a>
            </div>
            <div className="text-gold-300 font-medium">
              🌿 Trusted Healthcare Since Day One
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 flex-shrink-0">
              <img
                src="/assets/generated/gs-medical-logo.dim_512x512.png"
                alt="G&S Medical Logo"
                className="w-10 h-10 rounded-full object-cover shadow-emerald group-hover:shadow-emerald-hover transition-shadow"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className={`font-display font-bold text-lg leading-none transition-colors ${isScrolled ? 'text-emerald-800' : 'text-white'}`}>
                G&S MEDICAL
              </span>
              <span className={`text-xs font-medium transition-colors ${isScrolled ? 'text-gold-600' : 'text-gold-300'}`}>
                Your Health, Our Priority
              </span>
            </div>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 ${
                  isScrolled ? 'text-emerald-800' : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Admin button */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => navigate({ to: '/admin' })}
              size="sm"
              className={`text-xs font-semibold transition-all ${
                isScrolled
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
              }`}
            >
              Admin Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-md transition-colors ${
              isScrolled ? 'text-emerald-800 hover:bg-emerald-50' : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-emerald-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-emerald-100">
              <Button
                onClick={() => { navigate({ to: '/admin' }); setIsMobileMenuOpen(false); }}
                size="sm"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
