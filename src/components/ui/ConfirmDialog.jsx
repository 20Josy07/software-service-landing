import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
}) => {
  const confirmStyles =
    variant === 'danger'
      ? 'bg-red-500/90 hover:bg-red-500 text-white shadow-[0_0_24px_rgba(239,68,68,0.25)]'
      : 'bg-gradient-brand text-void shadow-glow-green hover:shadow-glow-cyan';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      accent={variant === 'danger' ? 'amber' : 'electric'}
      showHandle={false}
      title={title}
      description={message}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${confirmStyles}`}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex justify-center py-2">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            variant === 'danger'
              ? 'bg-red-500/15 border border-red-400/30 text-red-400'
              : 'bg-electric-500/15 border border-electric-400/30 text-electric-300'
          }`}
        >
          {variant === 'danger' ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
