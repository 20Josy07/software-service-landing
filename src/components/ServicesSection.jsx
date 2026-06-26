import React from 'react';
import { accentStyles } from '../data/services';
import { useServicePrices } from '../hooks/useServicePrices';
import SectionHeading from './SectionHeading';
import ServiceIcon from './ServiceIcon';
import WhatsAppButton from './WhatsAppButton';
import Reveal from './Reveal';

const ServicesSection = () => {
  const { services, loading } = useServicePrices();

  return (
    <section id="servicios" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-void-900/50 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric-400/50 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Catálogo técnico"
            title="Servicios Especializados de Software Móvil"
            description="Cada intervención incluye diagnóstico previo, informe del procedimiento y verificación funcional antes de la entrega."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const styles = accentStyles[service.accent];
            return (
              <Reveal key={service.id} delay={index * 80}>
                <article
                  className={`group flex flex-col h-full p-6 glass-card rounded-2xl transition-all duration-300 hover:shadow-lg ${styles.border} ${styles.glow}`}
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <ServiceIcon name={service.icon} accent={service.accent} />
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border ${styles.tag}`}
                      >
                        {service.duration}
                      </span>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      {service.subtitle}
                    </p>
                    <h3 className="text-xl font-bold text-slate-100 mb-2">{service.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{service.description}</p>
                    {service.note && (
                      <p className="mt-2 text-xs font-medium text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5">
                        {service.note}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Desde
                      </span>
                      <span
                        className={`text-2xl font-black text-cyber-400 transition-opacity ${loading ? 'opacity-50' : ''}`}
                      >
                        {service.price}
                      </span>
                    </div>
                    <WhatsAppButton
                      variant="ghost"
                      serviceId={service.id}
                      className="w-full !justify-center !py-2.5 border border-slate-800 hover:border-neon-500/30 rounded-lg"
                    >
                      Solicitar este servicio
                    </WhatsAppButton>
                  </div>
                </article>
              </Reveal>
            );
          })}

          <Reveal delay={400}>
            <article className="flex flex-col items-center justify-center h-full min-h-[280px] p-6 bg-gradient-to-br from-electric-500/20 via-void-800/50 to-cyber-400/15 border border-electric-400/30 rounded-2xl text-center shadow-glow-cyan">
              <div className="p-3 mb-4 rounded-full bg-electric-500/10 border border-electric-500/20">
                <svg className="w-6 h-6 text-electric-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-200 mb-2">¿Tu caso es diferente?</p>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-[220px]">
                Cuéntanos modelo y servicio. Te respondemos por WhatsApp.
              </p>
              <WhatsAppButton variant="secondary" quote className="w-full">
                Consultar ahora
              </WhatsAppButton>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
