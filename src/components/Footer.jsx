import React from 'react';
import { BRAND_NAME, BUSINESS_HOURS, getWhatsAppUrl } from '../constants/contact';
import { useQuote } from '../context/QuoteContext';
import { WhatsAppIcon } from './WhatsAppButton';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openQuote } = useQuote();

  return (
    <footer id="footer" className="bg-void-900 border-t border-electric-500/20">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Marca */}
          <div>
            <p className="text-lg font-bold text-gradient mb-2">{BRAND_NAME}</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Servicios técnicos especializados en software Android. Diagnóstico, reparación y
              recuperación con procesos transparentes.
            </p>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-electric-300 mb-4">
              Horarios de atención
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-400 glow-green" />
                {BUSINESS_HOURS.weekdays}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-400 glow-green" />
                {BUSINESS_HOURS.saturday}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                {BUSINESS_HOURS.sunday}
              </li>
            </ul>
          </div>

          {/* Contacto WhatsApp */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-electric-300 mb-4">
              Contacto directo
            </h4>
            <button
              type="button"
              onClick={() => openQuote()}
              className="inline-flex items-center gap-3 w-full sm:w-auto px-5 py-3.5 bg-gradient-brand text-void font-bold rounded-xl shadow-glow-green hover:shadow-glow-cyan transition-all duration-300 hover:scale-[1.02]"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Escribir por WhatsApp
            </button>
            <p className="mt-3 text-xs text-slate-500">
              Atendemos por WhatsApp en horario de taller.
            </p>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 pt-6 border-t border-electric-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {BRAND_NAME}. Todos los derechos reservados.</p>
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#servicios" className="hover:text-slate-400 transition-colors">
              Servicios
            </a>
            <a href="#proceso" className="hover:text-slate-400 transition-colors">
              Proceso
            </a>
            <a href="#politicas" className="hover:text-slate-400 transition-colors">
              Políticas
            </a>
            <a href="#faq" className="hover:text-slate-400 transition-colors">
              FAQ
            </a>
            <a href="/admin" className="hover:text-slate-600 transition-colors">
              Admin
            </a>
            <button
              type="button"
              onClick={() => openQuote()}
              className="hover:text-electric-300 transition-colors"
            >
              WhatsApp
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
