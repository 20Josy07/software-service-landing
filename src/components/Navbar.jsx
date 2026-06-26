import React, { useEffect, useState } from 'react';
import { BRAND_NAME } from '../constants/contact';
import { useActiveSection } from '../hooks/useActiveSection';
import WhatsAppButton from './WhatsAppButton';

const navLinks = [
  { href: '#servicios', id: 'servicios', label: 'Servicios' },
  { href: '#proceso', id: 'proceso', label: 'Proceso' },
  { href: '#politicas', id: 'politicas', label: 'Políticas' },
  { href: '#faq', id: 'faq', label: 'FAQ' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const isActive = (id) => activeSection === id;

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Línea gradiente superior */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-electric-400 to-transparent opacity-80"
        aria-hidden="true"
      />

      <div
        className={`transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-void-900/85 backdrop-blur-xl shadow-glow-nav border-b border-electric-500/20'
            : 'bg-void-900/40 backdrop-blur-md border-b border-electric-500/10'
        }`}
      >
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[4.5rem]">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group" onClick={closeMenu}>
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-brand shadow-glow-cyan group-hover:shadow-glow-green transition-shadow duration-300">
                <svg
                  className="w-5 h-5 text-void"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyber-400 rounded-full animate-pulse glow-green" />
              </div>
              <div className="leading-tight">
                <span className="block font-black text-sm sm:text-base tracking-tight text-white">
                  {BRAND_NAME.split(' ')[0]}
                </span>
                <span className="block text-xs font-bold text-gradient tracking-wide">
                  {BRAND_NAME.split(' ').slice(1).join(' ')}
                </span>
              </div>
            </a>

            {/* Desktop nav — pill container */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-0.5 p-1 rounded-2xl bg-void-800/80 border border-electric-500/25 shadow-[inset_0_1px_0_rgba(34,211,238,0.1)]">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`nav-link ${isActive(link.id) ? 'nav-link-active' : ''}`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <WhatsAppButton variant="nav" quote>Cotizar</WhatsAppButton>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              className="md:hidden relative p-2.5 rounded-xl text-electric-300 bg-void-800 border border-electric-500/30 hover:border-electric-400/60 hover:bg-void-700 transition-all"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-void/95 backdrop-blur-2xl transition-all duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric-400/50 to-transparent"
          aria-hidden="true"
        />
        <div className="flex flex-col items-stretch justify-center gap-2 h-[calc(100vh-4rem)] px-6 max-w-sm mx-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl text-lg font-bold transition-all duration-300 border ${
                isActive(link.id)
                  ? 'text-electric-300 bg-electric-500/15 border-electric-400/40 shadow-glow-cyan'
                  : 'text-slate-200 bg-void-800/60 border-electric-500/15 hover:border-electric-400/40 hover:text-electric-300'
              }`}
            >
              {link.label}
              {isActive(link.id) && (
                <span className="w-2 h-2 rounded-full bg-cyber-400 glow-green" />
              )}
            </a>
          ))}
          <div className="mt-4 pt-4 border-t border-electric-500/20">
            <WhatsAppButton quote onClick={closeMenu} className="w-full !py-4">
              Cotizar por WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
