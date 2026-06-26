import React, { useEffect, useMemo, useState } from 'react';
import { getWhatsAppUrl } from '../constants/contact';
import {
  CUSTOM_MODEL_OPTION,
  deviceBrands,
  getBrandById,
  isOtherBrand,
} from '../data/deviceCatalog';
import { deviceProblems, getProblemById } from '../data/deviceProblems';
import { accentStyles, services } from '../data/services';
import { useServicePrices } from '../hooks/useServicePrices';
import { buildQuoteMessage } from '../utils/buildQuoteMessage';
import ModelSelector from './ModelSelector';
import ServiceIcon from './ServiceIcon';
import Modal from './ui/Modal';
import { WhatsAppIcon } from './WhatsAppButton';

const STEPS = [
  { id: 1, label: 'Marca', short: '1' },
  { id: 2, label: 'Modelo', short: '2' },
  { id: 3, label: 'Servicio', short: '3' },
];

const STEP_TITLES = {
  1: '¿Qué marca es tu equipo?',
  2: '¿Cuál es el modelo?',
  3: '¿Qué necesitas hacer?',
};

const BRAND_STYLES = {
  samsung: 'from-blue-500/25 to-blue-600/10 border-blue-400/35 text-blue-200',
  xiaomi: 'from-orange-500/25 to-orange-600/10 border-orange-400/35 text-orange-200',
  motorola: 'from-sky-500/25 to-sky-600/10 border-sky-400/35 text-sky-200',
  huawei: 'from-red-500/25 to-red-600/10 border-red-400/35 text-red-200',
  oppo: 'from-emerald-500/25 to-emerald-600/10 border-emerald-400/35 text-emerald-200',
  realme: 'from-yellow-500/25 to-yellow-600/10 border-yellow-400/35 text-yellow-200',
  infinix: 'from-green-500/25 to-green-600/10 border-green-400/35 text-green-200',
  tecno: 'from-indigo-500/25 to-indigo-600/10 border-indigo-400/35 text-indigo-200',
  vivo: 'from-cyan-500/25 to-cyan-600/10 border-cyan-400/35 text-cyan-200',
  oneplus: 'from-red-500/25 to-rose-600/10 border-rose-400/35 text-rose-200',
  google: 'from-slate-400/25 to-slate-500/10 border-slate-300/35 text-slate-200',
  otro: 'from-slate-600/25 to-slate-700/10 border-slate-500/35 text-slate-300',
};

const getServiceMeta = (problem) => {
  if (!problem?.serviceId) return null;
  return services.find((s) => s.id === problem.serviceId) ?? null;
};

const QuoteModal = ({ isOpen, onClose, preset }) => {
  const { services: pricedServices } = useServicePrices();

  const [step, setStep] = useState(1);
  const [brandId, setBrandId] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [model, setModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [problemId, setProblemId] = useState('');
  const [problemDetail, setProblemDetail] = useState('');

  const selectedBrand = getBrandById(brandId);
  const selectedProblem = getProblemById(problemId);
  const presetService = preset.serviceId
    ? services.find((s) => s.id === preset.serviceId)
    : null;

  const priceMap = useMemo(
    () => Object.fromEntries(pricedServices.map((s) => [s.id, s.price])),
    [pricedServices],
  );

  const enrichedProblems = useMemo(
    () =>
      deviceProblems.map((problem) => {
        const meta = getServiceMeta(problem);
        return {
          ...problem,
          meta,
          price: meta ? priceMap[meta.id] : null,
          accent: meta?.accent ?? 'blue',
          icon: meta?.icon ?? null,
        };
      }),
    [priceMap],
  );

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setBrandId('');
    setCustomBrand('');
    setModel('');
    setCustomModel('');
    setProblemId(preset.problemId ?? '');
    setProblemDetail('');
  }, [isOpen, preset]);

  const brandName = isOtherBrand(brandId) ? customBrand.trim() : selectedBrand?.name ?? '';
  const modelName =
    model === CUSTOM_MODEL_OPTION || !model ? customModel.trim() : model.trim();

  const canGoStep2 = brandId && (isOtherBrand(brandId) ? customBrand.trim().length >= 2 : true);
  const canGoStep3 = isOtherBrand(brandId)
    ? customModel.trim().length >= 2
    : modelName.length >= 2;
  const canSubmit =
    problemId &&
    (problemId !== 'otro' || problemDetail.trim().length >= 5) &&
    brandName &&
    modelName;

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const handleBrandSelect = (id) => {
    setBrandId(id);
    setCustomBrand('');
    setModel('');
    setCustomModel('');
    if (!isOtherBrand(id)) window.setTimeout(() => setStep(2), 120);
  };

  const handleModelSelect = (value) => {
    setModel(value);
    if (value !== CUSTOM_MODEL_OPTION) setCustomModel('');
  };

  const handleCustomModelChange = (value) => {
    setCustomModel(value);
    setModel(CUSTOM_MODEL_OPTION);
  };

  const handleBack = () => {
    if (step === 1) onClose();
    else setStep((s) => s - 1);
  };

  const handleNext = () => {
    if (step === 1 && canGoStep2) setStep(2);
    else if (step === 2 && canGoStep3) setStep(3);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const message = buildQuoteMessage({
      brandName,
      model: modelName,
      serviceLabel: selectedProblem.label,
      serviceDetail: problemId === 'otro' ? problemDetail : '',
      serviceId: preset.serviceId ?? selectedProblem?.serviceId ?? null,
    });
    window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    onClose();
  };

  const previewMessage = useMemo(() => {
    if (!canSubmit || !selectedProblem) return '';
    return buildQuoteMessage({
      brandName,
      model: modelName,
      serviceLabel: selectedProblem.label,
      serviceDetail: problemId === 'otro' ? problemDetail : '',
      serviceId: preset.serviceId ?? selectedProblem?.serviceId ?? null,
    });
  }, [brandName, modelName, problemId, problemDetail, canSubmit, selectedProblem, preset.serviceId]);

  const goToStep = (target) => {
    if (target < step) setStep(target);
  };

  const progressHeader = (
    <>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-electric-400 via-cyan-400 to-cyber-400 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(34,211,238,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-3">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={s.id > step}
            onClick={() => goToStep(s.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              step === s.id
                ? 'text-electric-300'
                : s.id < step
                  ? 'text-slate-400 hover:text-electric-300 cursor-pointer'
                  : 'text-slate-600 cursor-default'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                step > s.id
                  ? 'bg-cyber-400/20 text-cyber-400 border border-cyber-400/40'
                  : step === s.id
                    ? 'bg-gradient-brand text-void shadow-glow-cyan'
                    : 'bg-white/5 text-slate-500 border border-white/10'
              }`}
            >
              {step > s.id ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s.short
              )}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>
      {(brandName || modelName || presetService) && step > 1 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
          {brandName && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
              {brandName}
            </span>
          )}
          {modelName && step === 3 && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
              {modelName}
            </span>
          )}
          {presetService && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyber-400/10 text-cyber-300 border border-cyber-400/25">
              {presetService.title}
            </span>
          )}
        </div>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      eyebrow="Solicitud de servicio"
      title={STEP_TITLES[step]}
      description={`Paso ${step} de ${STEPS.length} · Te respondemos por WhatsApp`}
      headerExtra={progressHeader}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 transition-colors"
          >
            {step === 1 ? 'Cancelar' : 'Atrás'}
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={(step === 1 && !canGoStep2) || (step === 2 && !canGoStep3)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-brand text-void shadow-glow-green hover:shadow-glow-cyan transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-[0_0_28px_rgba(37,211,102,0.3)] transition-all disabled:opacity-40"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Enviar por WhatsApp
            </button>
          )}
        </div>
      }
    >
      <div key={step} className="quote-step-content">
        {step === 1 && (
          <div>
            <p className="text-sm text-slate-400 mb-4">
              Elige la marca. Si no aparece, selecciona <span className="text-slate-200">Otra marca</span>.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {deviceBrands.map((brand) => {
                const style = BRAND_STYLES[brand.id] ?? BRAND_STYLES.otro;
                const isSelected = brandId === brand.id;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => handleBrandSelect(brand.id)}
                    className={`group relative px-3 py-3.5 rounded-2xl text-left transition-all duration-200 border ${
                      isSelected
                        ? `bg-gradient-to-br ${style} shadow-glow-cyan scale-[1.02]`
                        : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-electric-400/35 hover:bg-white/5'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black mb-2 ${
                        isSelected ? 'bg-white/10' : 'bg-void-900/80 text-electric-400'
                      }`}
                    >
                      {brand.name.charAt(0)}
                    </span>
                    <span className="block text-sm font-bold leading-snug">{brand.name}</span>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyber-400 flex items-center justify-center">
                        <svg className="w-3 h-3 text-void" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {isOtherBrand(brandId) && (
              <div className="mt-4">
                <label htmlFor="custom-brand" className="block text-xs font-semibold text-slate-400 mb-2">
                  Escribe la marca
                </label>
                <input
                  id="custom-brand"
                  type="text"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="Ej: Nokia, Alcatel, ZTE..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-electric-400/50 focus:ring-1 focus:ring-electric-400/20"
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-sm text-slate-400 mb-4">
              Busca tu modelo en el catálogo o escríbelo manualmente.
            </p>
            <ModelSelector
              brandId={brandId}
              brandName={brandName}
              model={model}
              customModel={customModel}
              onSelectModel={handleModelSelect}
              onCustomModelChange={handleCustomModelChange}
            />
            {canGoStep3 && (
              <p className="mt-3 text-xs text-cyber-400 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Modelo: <strong className="font-semibold">{modelName}</strong>
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Precios referenciales. Elige el servicio que necesitas.</p>
            <div className="space-y-2">
              {enrichedProblems.map((problem) => {
                const isSelected = problemId === problem.id;
                const tagStyle = problem.meta
                  ? accentStyles[problem.accent]?.tag
                  : 'text-slate-400 bg-slate-500/10 border-slate-500/20';

                return (
                  <button
                    key={problem.id}
                    type="button"
                    onClick={() => {
                      setProblemId(problem.id);
                      if (problem.id !== 'otro') setProblemDetail('');
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all duration-200 border flex gap-3 ${
                      isSelected
                        ? 'bg-electric-500/15 border-electric-400/40 shadow-glow-cyan'
                        : 'bg-white/[0.03] border-white/10 hover:border-electric-400/25 hover:bg-white/5'
                    }`}
                  >
                    {problem.icon ? (
                      <ServiceIcon name={problem.icon} accent={problem.accent} size="sm" />
                    ) : (
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-bold text-slate-100 leading-snug">{problem.label}</span>
                        {problem.price && (
                          <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full border ${tagStyle}`}>
                            {problem.price}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{problem.description}</p>
                    </div>
                    {isSelected && (
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyber-400 flex items-center justify-center self-center">
                        <svg className="w-3.5 h-3.5 text-void" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {problemId === 'otro' && (
              <textarea
                id="problem-detail"
                value={problemDetail}
                onChange={(e) => setProblemDetail(e.target.value)}
                rows={3}
                placeholder="Cuéntanos qué le pasa al equipo..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-electric-400/50 resize-none"
                autoFocus
              />
            )}

            {canSubmit && previewMessage && (
              <div className="rounded-2xl bg-[#0b141a]/90 border border-[#1f2c34] p-4 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8696a0] mb-3 flex items-center gap-2">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                  Vista previa
                </p>
                <div className="flex justify-end">
                  <div className="max-w-[92%] px-3.5 py-2.5 rounded-2xl rounded-tr-md bg-[#005c4b] text-[#e9edef] text-sm leading-relaxed shadow-lg">
                    <p className="whitespace-pre-wrap">{previewMessage}</p>
                    <p className="text-[10px] text-[#8696a0] text-right mt-1">ahora</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuoteModal;
