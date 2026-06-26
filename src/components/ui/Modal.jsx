import React, { useEffect, useId, useRef } from 'react';

const SIZES = {
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-xl',
  xl: 'sm:max-w-2xl',
  full: 'sm:max-w-3xl',
};

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  eyebrow,
  children,
  footer,
  headerExtra,
  size = 'lg',
  accent = 'electric',
  showHandle = true,
  closeOnBackdrop = true,
  className = '',
}) => {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return undefined;

    const panel = panelRef.current;
    const focusables = panel.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [href]',
    );
    const first = focusables[0];
    if (first instanceof HTMLElement) {
      window.setTimeout(() => first.focus(), 50);
    }

    const trapFocus = (e) => {
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener('keydown', trapFocus);
    return () => panel.removeEventListener('keydown', trapFocus);
  }, [isOpen]);

  if (!isOpen) return null;

  const accentGlow =
    accent === 'cyber'
      ? 'from-cyber-400/20 via-electric-400/10 to-transparent'
      : accent === 'amber'
        ? 'from-amber-400/20 via-orange-400/10 to-transparent'
        : 'from-electric-400/25 via-cyber-400/10 to-transparent';

  return (
    <div
      className="modal-root fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-5"
      role="presentation"
    >
      <button
        type="button"
        className="modal-backdrop absolute inset-0 bg-[#030508]/80 backdrop-blur-xl"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-label="Cerrar"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        className={`modal-panel relative w-full ${SIZES[size]} max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden rounded-t-[1.75rem] sm:rounded-[1.75rem] border border-white/10 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_25px_80px_-12px_rgba(0,0,0,0.75),0_0_60px_rgba(34,211,238,0.12)] ${className}`}
      >
        {/* Fondo glass */}
        <div className="absolute inset-0 bg-void-900/95 backdrop-blur-2xl" />
        <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${accentGlow} pointer-events-none`} />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-electric-400/60 to-transparent" />
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-electric-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-cyber-400/8 blur-3xl pointer-events-none" />

        {showHandle && (
          <div className="sm:hidden relative flex justify-center pt-3 pb-0.5">
            <div className="w-12 h-1 rounded-full bg-white/15" />
          </div>
        )}

        {(title || eyebrow) && (
          <header className="relative flex-shrink-0 px-5 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-white/5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 pr-2">
                {eyebrow && (
                  <p className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-electric-300 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-400 animate-pulse" />
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h2 id={titleId} className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descId} className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                    {description}
                  </p>
                )}
                {headerExtra && <div className="mt-4">{headerExtra}</div>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 p-2.5 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-electric-400/30 transition-all"
                aria-label="Cerrar"
              >
                <CloseIcon />
              </button>
            </div>
          </header>
        )}

        <div className="relative flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 modal-scroll">
          {children}
        </div>

        {footer && (
          <footer className="relative flex-shrink-0 px-5 sm:px-6 py-4 border-t border-white/5 bg-void-950/60 backdrop-blur-md">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export default Modal;
