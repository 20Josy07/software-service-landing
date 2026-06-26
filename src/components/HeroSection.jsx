import React from 'react';
import { BUSINESS_HOURS_SHORT } from '../constants/contact';
import { services } from '../data/services';
import WhatsAppButton from './WhatsAppButton';
import PhoneMockup from './PhoneMockup';
import Reveal from './Reveal';

const HeroSection = () => {
  const highlights = [
    { value: String(services.length), label: 'Servicios en catálogo' },
    { value: 'CRC', label: 'Consulta IMEI antes de trabajar' },
    { value: '50/50', label: 'Abono y saldo al entregar' },
  ];

  const brands = ['Samsung', 'Xiaomi', 'Motorola', 'Huawei', 'OPPO', 'Realme'];

  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8">
      {/* Fondo */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-electric-500/25 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyber-400/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Texto */}
          <div className="text-center lg:text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase rounded-full border border-electric-400/40 bg-electric-500/20 text-electric-300 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-400" />
                </span>
                Especialistas en Android
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-3xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
                <span className="block text-slate-100">
                  Revive tu smartphone o recupera tu acceso
                </span>
                <span className="block mt-2 text-gradient">con diagnóstico claro y precios visibles.</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg max-w-xl mx-auto lg:mx-0">
                Técnicos especializados en{' '}
                <strong className="text-slate-200 font-semibold">software Android</strong>. Te
                indicamos el procedimiento, el precio de referencia y el tiempo estimado antes de
                iniciar el trabajo.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
                <WhatsAppButton quote>Cotizar por WhatsApp</WhatsAppButton>
                <a
                  href="#servicios"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-electric-400 transition-colors"
                >
                  Ver servicios
                  <svg className="w-4 h-4 animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </Reveal>

            {/* Marcas compatibles */}
            <Reveal delay={400}>
              <div className="mt-10 pt-8 border-t border-electric-500/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-electric-500/70 mb-3">
                  Marcas que atendemos
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {brands.map((brand) => (
                    <span
                      key={brand}
                      className="px-3 py-1 text-xs font-semibold text-electric-300/90 bg-void-800/80 border border-electric-500/25 rounded-full hover:border-electric-400/50 hover:text-electric-200 transition-colors"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Mockup + stats */}
          <div className="flex flex-col items-center gap-10">
            <Reveal delay={200} className="w-full flex justify-center">
              <PhoneMockup />
            </Reveal>

            <Reveal delay={350} className="w-full">
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-3 rounded-xl bg-void-800/70 border border-electric-500/25 backdrop-blur-sm"
                  >
                    <p className="text-xl font-black text-electric-300 sm:text-2xl">{item.value}</p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500 leading-tight">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-[10px] text-slate-600 max-w-sm mx-auto">
                Horario: {BUSINESS_HOURS_SHORT}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
