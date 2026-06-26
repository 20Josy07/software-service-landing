import React from 'react';
import { getWhatsAppUrl } from '../constants/contact';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const policies = [
  {
    id: 'cero-reportes',
    title: 'Política de Cero Reportes',
    badge: 'Obligatorio',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    icon: (
      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    content: (
      <>
        <p className="mb-3">
          Antes de conectar cualquier dispositivo, verificamos el{' '}
          <strong className="text-slate-200">IMEI en las bases oficiales de la CRC</strong> (Comisión
          de Regulación de Comunicaciones).
        </p>
        <p>
          <strong className="text-slate-200">No admitimos teléfonos reportados</strong> por pérdida,
          hurto o de dudosa procedencia. Esta política protege a nuestros clientes y garantiza que solo
          trabajamos con equipos de origen legítimo.
        </p>
      </>
    ),
  },
  {
    id: 'riesgo-hardware',
    title: 'Riesgo de Hardware',
    badge: 'Aviso técnico',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    content: (
      <>
        <p className="mb-3">
          Los procesos de <strong className="text-slate-200">flasheo profundo</strong> (reinstalación
          de firmware, unbrick, downgrade) implican escritura intensiva en la memoria interna (eMMC/UFS).
        </p>
        <p>
          Si la placa base presenta{' '}
          <strong className="text-slate-200">desgaste previo, sectores dañados o fallos de soldadura</strong>,
          existe riesgo de que el equipo no responda tras el procedimiento. Al solicitar el servicio, el
          cliente declara conocer y aceptar este riesgo inherente al hardware.
        </p>
      </>
    ),
  },
  {
    id: 'garantia-software',
    title: 'Alcance de la Garantía',
    badge: 'Transparencia',
    badgeColor: 'bg-electric-500/10 text-electric-400 border-electric-500/30',
    icon: (
      <svg className="w-6 h-6 text-electric-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
    content: (
      <>
        <p className="mb-3">
          Las tarifas cubren soluciones estándar para modelos y parches habituales. Casos con{' '}
          <strong className="text-slate-200">bloqueos de servidor externos</strong>, parches muy
          recientes o modelos poco documentados se cotizan con presupuesto previo.
        </p>
        <p>
          Garantizamos el trabajo de software durante{' '}
          <strong className="text-slate-200">7 días calendario</strong> post-entrega, siempre que no
          modifiques el sistema ni actualices el firmware por tu cuenta.
        </p>
      </>
    ),
  },
  {
    id: 'piezas-cliente',
    title: 'Política de Repuestos',
    badge: 'Importante',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    content: (
      <>
        <p className="mb-3">
          Ofrecemos <strong className="text-slate-200">instalación de repuestos</strong> (pantalla,
          batería, conector de carga, cámara, etc.), pero{' '}
          <strong className="text-slate-200">no vendemos ni gestionamos la compra de piezas</strong>.
          No contamos con proveedor propio y las piezas adquiridas por internet pueden llegar
          defectuosas, ser incompatibles o de calidad inconsistente.
        </p>
        <p className="mb-3">
          El cliente debe <strong className="text-slate-200">traer su propia pieza</strong>, nueva o
          de su confianza. La tarifa cubre únicamente la{' '}
          <strong className="text-slate-200">mano de obra de instalación</strong>.
        </p>
        <p>
          No asumimos responsabilidad por fallos, daños o defectos de fábrica en repuestos de
          terceros. Antes de instalar, verificamos compatibilidad básica por modelo; si la pieza no
          es adecuada, te lo informamos antes de proceder.
        </p>
      </>
    ),
  },
  {
    id: 'forma-pago',
    title: 'Forma de Pago',
    badge: '50% / 50%',
    badgeColor: 'bg-electric-500/10 text-electric-400 border-electric-500/30',
    icon: (
      <svg className="w-6 h-6 text-electric-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    content: (
      <>
        <p className="mb-3">
          Para iniciar cualquier servicio se requiere un{' '}
          <strong className="text-slate-200">abono del 50% del valor acordado</strong> antes de
          recibir el equipo en taller.
        </p>
        <p className="mb-3">
          El <strong className="text-slate-200">saldo restante (50%)</strong> se cancela al momento
          de la entrega del dispositivo, una vez finalizado el trabajo y verificado por el cliente.
        </p>
        <p>
          La tarifa publicada es referencial. Si se acuerda un valor distinto (por promoción o
          descuento), el abono y el saldo se calculan sobre el{' '}
          <strong className="text-slate-200">precio final acordado</strong>.
        </p>
      </>
    ),
  },
];

const PoliciesSection = () => (
  <section id="politicas" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-void-900/60 relative">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-400/35 to-transparent" />

    <div className="max-w-5xl mx-auto">
      <Reveal>
        <SectionHeading
          eyebrow="Confianza y transparencia"
          title="Políticas que protegen a ambas partes"
          description="Estándares técnicos claros. Conoce nuestras condiciones antes de solicitar cualquier servicio."
          light
        />
      </Reveal>

      <div className="space-y-5">
        {policies.map((policy, index) => (
          <Reveal key={policy.id} delay={index * 80}>
            <article className="p-6 sm:p-8 glass-card rounded-2xl hover:border-slate-700 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0 p-3 bg-slate-950 rounded-xl border border-slate-800 w-fit">
                  {policy.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-slate-100">{policy.title}</h3>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${policy.badgeColor}`}
                    >
                      {policy.badge}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 leading-relaxed">{policy.content}</div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={300}>
        <div className="mt-10 p-5 glass-card rounded-xl text-center">
          <p className="text-sm text-slate-400">
            ¿Tienes dudas sobre alguna política?{' '}
            <a
              href={getWhatsAppUrl('Hola, tengo una duda sobre sus políticas de servicio.')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric-400 hover:text-electric-300 font-semibold underline underline-offset-2"
            >
              Escríbenos por WhatsApp
            </a>{' '}
            y te aclaramos todo antes de iniciar.
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);

export default PoliciesSection;
