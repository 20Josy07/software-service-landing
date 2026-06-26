import React, { useState } from 'react';
import { CUSTOM_MODEL_OPTION, isOtherBrand } from '../data/deviceCatalog';
import { useDeviceModels } from '../hooks/useDeviceModels';

const ModelSelector = ({
  brandId,
  brandName,
  model,
  customModel,
  onSelectModel,
  onCustomModelChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showManual, setShowManual] = useState(false);

  const { models, total, loading, error, reload, hasDatabase } = useDeviceModels(
    brandId,
    searchQuery,
    !isOtherBrand(brandId)
  );

  const trimmedSearch = searchQuery.trim();

  const handleSelect = (name) => {
    onSelectModel(name);
    setShowManual(false);
  };

  const handleUseSearchAsModel = () => {
    if (trimmedSearch.length < 2) return;
    onSelectModel(trimmedSearch);
    onCustomModelChange('');
    setShowManual(false);
  };

  if (isOtherBrand(brandId)) {
    return (
      <div>
        <label htmlFor="custom-model-only" className="block text-xs font-semibold text-slate-400 mb-2">
          Modelo del dispositivo
        </label>
        <input
          id="custom-model-only"
          type="text"
          value={customModel}
          onChange={(e) => {
            onCustomModelChange(e.target.value);
            onSelectModel(CUSTOM_MODEL_OPTION);
          }}
          placeholder="Ej: Nokia G22, ZTE Blade V40..."
          className="w-full px-4 py-3 rounded-xl bg-void-800 border border-electric-500/25 text-white placeholder-slate-500 focus:outline-none focus:border-electric-400/60 focus:ring-1 focus:ring-electric-400/30"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar... Ej: Galaxy A54, S23, Redmi Note 13"
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-void-800 border border-electric-500/25 text-white placeholder-slate-500 focus:outline-none focus:border-electric-400/60 focus:ring-1 focus:ring-electric-400/30"
          autoFocus
          autoComplete="off"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            aria-label="Limpiar búsqueda"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Estado de carga / error */}
      {loading && (
        <div className="flex items-center gap-2 text-xs text-electric-400">
          <span className="w-4 h-4 border-2 border-electric-400/30 border-t-electric-400 rounded-full animate-spin" />
          Consultando catálogo de dispositivos...
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200">
          <p>{error}. Puedes escribir tu modelo manualmente abajo.</p>
          <button type="button" onClick={reload} className="mt-2 font-semibold underline underline-offset-2">
            Reintentar
          </button>
        </div>
      )}

      {hasDatabase && !loading && (
        <p className="text-xs text-slate-500">
          {trimmedSearch.length < 2
            ? 'Modelos populares — escribe al menos 2 letras para buscar en el catálogo completo'
            : total > models.length
              ? `Mostrando ${models.length} de ${total} — afina la búsqueda si no ves tu modelo`
              : models.length > 0
                ? `${total} resultado${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`
                : 'Sin coincidencias — prueba con "Galaxy A54" o escribe tu modelo manualmente'}
        </p>
      )}

      {/* Resultados */}
      {!showManual && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[36vh] overflow-y-auto pr-1">
          {models.length > 0 ? (
            models.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all border ${
                  model === name
                    ? 'bg-electric-500/20 border-electric-400/60 text-electric-200'
                    : 'bg-void-800/60 border-electric-500/15 text-slate-300 hover:border-electric-400/40'
                }`}
              >
                {name}
              </button>
            ))
          ) : (
            !loading &&
            trimmedSearch.length >= 2 && (
              <div className="sm:col-span-2 py-6 text-center text-sm text-slate-500">
                Sin coincidencias. Prueba &quot;Galaxy A54&quot; o escribe tu modelo abajo.
              </div>
            )
          )}
        </div>
      )}

      {/* Usar texto de búsqueda */}
      {trimmedSearch.length >= 2 && !models.some((m) => m.toLowerCase() === trimmedSearch.toLowerCase()) && (
        <button
          type="button"
          onClick={handleUseSearchAsModel}
          className={`w-full px-4 py-3 rounded-xl text-sm font-semibold text-left border transition-all ${
            model === trimmedSearch
              ? 'bg-electric-500/20 border-electric-400/60 text-electric-200'
              : 'bg-void-800/40 border-dashed border-electric-500/30 text-electric-300 hover:border-electric-400/50'
          }`}
        >
          Usar &quot;{trimmedSearch}&quot; como modelo
        </button>
      )}

      {/* Entrada manual */}
      <div className="pt-3 border-t border-electric-500/15">
        {!showManual ? (
          <button
            type="button"
            onClick={() => {
              setShowManual(true);
              onSelectModel(CUSTOM_MODEL_OPTION);
            }}
            className="text-sm font-semibold text-slate-400 hover:text-electric-300 transition-colors"
          >
            No encuentro mi modelo — escribir manualmente
          </button>
        ) : (
          <div>
            <label htmlFor="custom-model" className="block text-xs font-semibold text-slate-400 mb-2">
              Escribe el modelo exacto
            </label>
            <input
              id="custom-model"
              type="text"
              value={customModel}
              onChange={(e) => {
                onCustomModelChange(e.target.value);
                onSelectModel(CUSTOM_MODEL_OPTION);
              }}
              placeholder="Ej: Galaxy A73 5G, Redmi Note 12 Pro..."
              className="w-full px-4 py-3 rounded-xl bg-void-800 border border-electric-500/25 text-white placeholder-slate-500 focus:outline-none focus:border-electric-400/60 focus:ring-1 focus:ring-electric-400/30"
            />
            <button
              type="button"
              onClick={() => {
                setShowManual(false);
                onCustomModelChange('');
              }}
              className="mt-2 text-xs text-slate-500 hover:text-slate-300"
            >
              Volver al buscador
            </button>
          </div>
        )}
      </div>

      {/* Modelo seleccionado */}
      {(model && model !== CUSTOM_MODEL_OPTION) || (showManual && customModel.trim()) ? (
        <div className="p-3 rounded-xl bg-electric-500/10 border border-electric-400/30">
          <p className="text-xs text-slate-500 mb-0.5">Seleccionado</p>
          <p className="text-sm font-semibold text-electric-200">
            {brandName}{' '}
            {model !== CUSTOM_MODEL_OPTION ? model : customModel.trim()}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ModelSelector;
