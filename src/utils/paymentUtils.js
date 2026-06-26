import { parseCOPInput } from './formatPrice';

/** Divide el total en abono 50% inicial y saldo al entregar */
export const splitPayment = (total) => {
  const amount = Number(total) || 0;
  const deposit = Math.round(amount / 2);
  const balance = amount - deposit;
  return { deposit, balance, total: amount };
};

export const getPriceForService = (prices, serviceId) => {
  if (!prices || !serviceId || serviceId === 'otro') return 0;
  return Number(prices[serviceId]) || 0;
};

export const applyServicePrice = (form, serviceId, prices) => {
  if (serviceId === 'otro') {
    return {
      ...form,
      service: serviceId,
      listPrice: 0,
      quotedPrice: form.quotedPrice || '',
      customServiceLabel: form.customServiceLabel ?? '',
    };
  }
  const listPrice = getPriceForService(prices, serviceId);
  return {
    ...form,
    service: serviceId,
    listPrice,
    quotedPrice: listPrice > 0 ? String(listPrice) : '',
    customServiceLabel: '',
  };
};

export const getDiscount = (listPrice, chargedPrice) => {
  const list = Number(listPrice) || 0;
  const charged = parseCOPInput(chargedPrice);
  if (list <= 0 || charged >= list) return 0;
  return list - charged;
};

export const parseChargedPrice = (quotedPrice) => {
  const value = parseCOPInput(quotedPrice);
  return value > 0 ? value : null;
};
