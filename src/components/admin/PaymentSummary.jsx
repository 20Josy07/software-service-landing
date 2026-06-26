import React from 'react';
import { formatCOP, parseCOPInput } from '../../utils/formatPrice';
import { getDiscount, splitPayment } from '../../utils/paymentUtils';

const PaymentSummary = ({ listPrice, chargedPrice, compact = false }) => {
  const charged = parseCOPInput(chargedPrice);
  const discount = getDiscount(listPrice, charged);
  const { deposit, balance } = splitPayment(charged);

  if (!charged) return null;

  if (compact) {
    return (
      <div className="text-xs space-y-1 mt-1">
        <p className="text-electric-300 font-semibold">
          Total: {formatCOP(charged)}
          {discount > 0 && (
            <span className="text-amber-400 font-normal ml-1">
              (desc. {formatCOP(discount)})
            </span>
          )}
        </p>
        <p className="text-slate-500">
          Abono 50%: <span className="text-cyber-400">{formatCOP(deposit)}</span>
          {' · '}
          Saldo: <span className="text-slate-400">{formatCOP(balance)}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="sm:col-span-2 p-4 rounded-xl bg-void-900/80 border border-electric-500/20 space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-electric-400">
        Forma de pago — 50% / 50%
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-xs text-slate-500">Tarifa lista</p>
          <p className="font-semibold text-slate-300">{formatCOP(listPrice)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">A cobrar</p>
          <p className="font-bold text-white">{formatCOP(charged)}</p>
          {discount > 0 && (
            <p className="text-xs text-amber-400">Descuento: −{formatCOP(discount)}</p>
          )}
        </div>
        <div>
          <p className="text-xs text-slate-500">Abono antes (50%)</p>
          <p className="font-bold text-cyber-400">{formatCOP(deposit)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Saldo al entregar</p>
          <p className="font-bold text-electric-300">{formatCOP(balance)}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        El cliente debe abonar el 50% antes de iniciar el trabajo. El resto se paga al recoger el
        equipo.
      </p>
    </div>
  );
};

export default PaymentSummary;
