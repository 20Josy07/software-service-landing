import React, { useState } from 'react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const faqs = [
  {
    question: '¿Cuánto tarda el servicio?',
    answer:
      'Depende del caso. Un Bypass FRP básico puede tomar 30–90 minutos; un unbrick complejo puede requerir 2–3 horas. Te damos un estimado exacto al recibir los datos de tu equipo.',
  },
  {
    question: '¿Pierdo mis datos con el flasheo?',
    answer:
      'En la mayoría de intervenciones de flasheo profundo sí se borran los datos. Si el equipo enciende, intentamos respaldo previo. Para migración de datos, ofrecemos un servicio dedicado que preserva WhatsApp, fotos y más.',
  },
  {
    question: '¿Qué pasa si mi teléfono está reportado?',
    answer:
      'No realizamos ningún servicio. Verificamos el IMEI en bases CRC antes de conectar el dispositivo. Esta política es innegociable y protege tanto al cliente como a nuestro taller.',
  },
  {
    question: '¿Ofrecen garantía?',
    answer:
      'Sí. Garantizamos el trabajo de software por 7 días calendario post-entrega, siempre que no modifiques el sistema ni actualices el firmware por tu cuenta después del servicio.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-void">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Preguntas frecuentes"
            title="Resolvemos tus dudas antes de empezar"
            description="Lo que más nos preguntan nuestros clientes, respondido de forma directa."
          />
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={faq.question} delay={index * 60}>
                <div className="rounded-xl border border-electric-500/20 bg-void-900/70 overflow-hidden transition-colors hover:border-electric-400/40">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-slate-100 text-sm sm:text-base">
                      {faq.question}
                    </span>
                    <span
                      className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-void-800 text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-electric-500/20 text-electric-300' : ''
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
