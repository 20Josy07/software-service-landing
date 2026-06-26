import React, { useEffect, useState } from 'react';
import { WhatsAppIcon } from './WhatsAppButton';
import { useQuote } from '../context/QuoteContext';

const FloatingWhatsApp = () => {
  const [visible, setVisible] = useState(false);
  const { openQuote } = useQuote();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => openQuote()}
      aria-label="Cotizar por WhatsApp"
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 pl-4 pr-5 py-3.5 bg-gradient-brand text-void font-bold rounded-full shadow-glow-green hover:shadow-glow-cyan transition-all duration-500 hover:scale-105 active:scale-95 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <WhatsAppIcon className="w-5 h-5" />
      <span className="text-sm hidden sm:inline">WhatsApp</span>
    </button>
  );
};

export default FloatingWhatsApp;
