// WhatsApp Colombia (+57 315 048 9702)
export const WHATSAPP_NUMBER = '573150489702';
export const WHATSAPP_MESSAGE =
  'Hola, quiero solicitar un servicio de software móvil.';

import { encodeWhatsAppText } from '../utils/encodeWhatsAppText';

export const getWhatsAppUrl = (message = WHATSAPP_MESSAGE) =>
  `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeWhatsAppText(message)}`;

/** Normaliza teléfono del cliente a formato wa.me (57 + 10 dígitos) */
export const normalizeCustomerPhone = (phone) => {
  const digits = String(phone ?? '').replace(/\D/g, '').replace(/^57/, '');
  return digits.length >= 10 ? `57${digits.slice(-10)}` : '';
};

export const getCustomerWhatsAppUrl = (phone, message) => {
  const normalized = normalizeCustomerPhone(phone);
  if (!normalized) return null;
  if (!message) return `https://api.whatsapp.com/send?phone=${normalized}`;
  return `https://api.whatsapp.com/send?phone=${normalized}&text=${encodeWhatsAppText(message)}`;
};

export const BUSINESS_HOURS = {
  weekdays: 'Lunes a Viernes: 9:00 AM – 7:00 PM',
  saturday: 'Sábados: 10:00 AM – 2:00 PM',
  sunday: 'Domingos: Cerrado',
};

export const BUSINESS_HOURS_SHORT = 'Lun–Vie 9:00–19:00 · Sab 10:00–14:00 · Dom cerrado';

export const BRAND_NAME = 'Software Móvil Pro';
