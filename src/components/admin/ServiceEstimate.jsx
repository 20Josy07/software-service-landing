import React, { useMemo } from 'react';
import { BUSINESS_HOURS_SHORT } from '../../constants/contact';
import { estimateServiceAvailability } from '../../utils/estimateServiceAvailability';

const ServiceEstimate = ({ serviceId, queueDevices }) => {
  const estimate = useMemo(
    () => estimateServiceAvailability({ serviceId, queueDevices }),
    [serviceId, queueDevices],
  );

  if (!serviceId) return null;

  return (
    <div className="sm:col-span-2 p-4 rounded-xl bg-cyber-400/5 border border-cyber-400/20 space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-cyber-400">
        Tiempo estimado
      </p>

      <div className="grid gap-2 sm:grid-cols-2 text-sm">
        <div>
          <p className="text-xs text-slate-500">Duración del servicio</p>
          <p className="font-semibold text-slate-200">{estimate.durationLabel}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Disponible aprox.</p>
          <p className="font-semibold text-electric-300">{estimate.availabilityLabel}</p>
        </div>
      </div>

      {estimate.isClosedNow && estimate.startsAtLabel && (
        <p className="text-xs text-amber-400">
          Fuera de horario. El trabajo iniciaría el {estimate.startsAtLabel}.
        </p>
      )}

      {estimate.queueCount > 0 ? (
        <p className="text-xs text-slate-500">
          {estimate.queueCount} equipo{estimate.queueCount === 1 ? '' : 's'} en cola antes
          {estimate.queueLabel ? ` (aprox. ${estimate.queueLabel} de espera)` : ''}.
        </p>
      ) : (
        <p className="text-xs text-slate-500">Sin equipos en cola. Puede iniciarse de inmediato.</p>
      )}

      <p className="text-xs text-slate-600">Horario: {BUSINESS_HOURS_SHORT}</p>
    </div>
  );
};

export default ServiceEstimate;
