import React from 'react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const steps = [
  {
    number: '01',
    title: 'Consulta por WhatsApp',
    description:
      'Envíanos marca, modelo y síntoma por WhatsApp. Te respondemos con orientación, precio de referencia y tiempo estimado según el caso.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Verificación IMEI',
    description:
      'Antes de conectar tu equipo, validamos el IMEI en bases CRC. Solo avanzamos con dispositivos de origen legítimo.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Intervención técnica',
    description:
      'Aplicamos el procedimiento con herramientas profesionales (ADB, Fastboot, boxes autorizados). Te informamos cada paso.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Entrega y garantía',
    description:
      'Probamos todas las funciones en tu presencia. Recibes garantía de software por 7 días y recomendaciones de uso.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
];

const ProcessSection = () => (
  <section id="proceso" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-void-800/30 relative overflow-hidden">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-400/40 to-transparent" />
    <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64 bg-electric-500/15 rounded-full blur-3xl" aria-hidden="true" />

    <div className="max-w-5xl mx-auto relative">
      <Reveal>
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="Proceso claro, sin sorpresas"
          description="Desde la primera consulta hasta la entrega, cada paso está definido para que sepas exactamente qué esperar."
        />
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Reveal key={step.number} delay={index * 100}>
            <article className="relative h-full p-6 rounded-2xl bg-void-900/90 border border-electric-500/20 hover:border-electric-400/40 hover:shadow-glow-cyan transition-all group">
              {index < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-gradient-to-r from-slate-700 to-transparent"
                  aria-hidden="true"
                />
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-electric-500/20 border border-electric-400/30 text-electric-300 group-hover:bg-electric-500/30 group-hover:text-electric-200 transition-colors">
                  {step.icon}
                </div>
                <span className="text-2xl font-black text-slate-800 group-hover:text-slate-700 transition-colors">
                  {step.number}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSection;
