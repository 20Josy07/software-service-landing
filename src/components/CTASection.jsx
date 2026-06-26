import React from 'react';
import { BUSINESS_HOURS } from '../constants/contact';
import WhatsAppButton from './WhatsAppButton';
import Reveal from './Reveal';

const CTASection = () => (
  <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-electric-400/30 bg-gradient-to-br from-void-800 via-void-900 to-void p-8 sm:p-12 text-center shadow-glow-cyan">
          {/* Decoración */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-electric-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyber-400/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" aria-hidden="true" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-cyber-400 mb-4">
              ¿Listo para empezar?
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 max-w-xl mx-auto leading-tight">
              Cuéntanos tu caso y te orientamos{' '}
              <span className="text-gradient">por WhatsApp</span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-md mx-auto leading-relaxed">
              Envíanos marca, modelo y el servicio que necesitas. Cotización sin compromiso con el
              precio de referencia publicado en el sitio.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <WhatsAppButton quote className="w-full sm:w-auto text-lg !px-8 !py-4">
                Cotizar por WhatsApp
              </WhatsAppButton>
              <p className="text-xs text-slate-500 text-center sm:text-left max-w-[200px]">
                {BUSINESS_HOURS.weekdays}
                <br />
                {BUSINESS_HOURS.saturday}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default CTASection;
