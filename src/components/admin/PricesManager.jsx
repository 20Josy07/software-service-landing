import React, { useEffect, useState } from 'react';
import { services as catalog } from '../../data/services';
import { fetchPricing, savePricing, seedPricingIfEmpty } from '../../firebase/pricingService';
import { formatCOP, parseCOPInput } from '../../utils/formatPrice';

const PricesManager = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    seedPricingIfEmpty()
      .then(() => fetchPricing())
      .then(setPrices)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (id, raw) => {
    setPrices((prev) => ({ ...prev, [id]: parseCOPInput(raw) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await savePricing(prices);
      setMessage('Precios guardados. La landing se actualiza al instante.');
    } catch {
      setMessage('Error al guardar. Verifica las reglas de Firestore.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400 text-sm">Cargando precios...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Gestión de precios</h2>
        <p className="text-sm text-slate-400 mt-1">
          Los cambios se reflejan automáticamente en la página pública.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {catalog.map((service) => (
          <div
            key={service.id}
            className="p-4 rounded-xl bg-void-800 border border-electric-500/15"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              {service.subtitle}
            </p>
            <p className="text-sm font-bold text-slate-100 mb-3">{service.title}</p>
            <label className="block text-xs text-slate-400 mb-1">Precio (COP)</label>
            <input
              type="text"
              inputMode="numeric"
              value={prices[service.id]?.toLocaleString('es-CO') ?? ''}
              onChange={(e) => handleChange(service.id, e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-void-900 border border-electric-500/25 text-white text-sm focus:outline-none focus:border-electric-400/60"
            />
            <p className="mt-1.5 text-xs text-electric-400">
              Vista previa: {formatCOP(prices[service.id])}
            </p>
          </div>
        ))}
      </div>

      {message && (
        <p className={`text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-cyber-400'}`}>
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-brand text-void shadow-glow-green hover:shadow-glow-cyan disabled:opacity-50 transition-all"
      >
        {saving ? 'Guardando...' : 'Guardar precios'}
      </button>
    </div>
  );
};

export default PricesManager;
