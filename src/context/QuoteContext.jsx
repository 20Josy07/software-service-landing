import React, { createContext, useCallback, useContext, useMemo, useState, lazy, Suspense } from 'react';
import { getProblemByServiceId } from '../data/deviceProblems';

const QuoteModal = lazy(() => import('../components/QuoteModal'));

const QuoteContext = createContext(null);

export const QuoteProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState({ serviceId: null });

  const openQuote = useCallback((options = {}) => {
    const serviceId = options.serviceId ?? null;
    const problem = serviceId ? getProblemByServiceId(serviceId) : null;

    setPreset({
      serviceId,
      problemId: options.problemId ?? problem?.id ?? null,
    });
    setIsOpen(true);
  }, []);

  const closeQuote = useCallback(() => {
    setIsOpen(false);
    setPreset({ serviceId: null });
  }, []);

  const value = useMemo(
    () => ({ openQuote, closeQuote, isOpen }),
    [openQuote, closeQuote, isOpen]
  );

  return (
    <QuoteContext.Provider value={value}>
      {children}
      {isOpen && (
        <Suspense fallback={null}>
          <QuoteModal isOpen={isOpen} onClose={closeQuote} preset={preset} />
        </Suspense>
      )}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote debe usarse dentro de QuoteProvider');
  }
  return context;
};
