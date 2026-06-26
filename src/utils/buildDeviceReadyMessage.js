import { BRAND_NAME } from '../constants/contact';
import { formatCOP } from './formatPrice';
import { splitPayment } from './paymentUtils';

// Simbolos BMP (compatibles con WhatsApp en URL; evitan emojis de 4 bytes)
const sym = {
  wave: '\u270B', // mano
  check: '\u2705', // check
  phone: '\u260E', // telefono
  wrench: '\u2699', // engranaje
  money: '\u0024', // $
  clock: '\u23F0', // reloj
  sparkles: '\u2728', // brillo
};

export const buildDeviceReadyMessage = (device) => {
  const greeting = device.customerName ? `Hola ${device.customerName},` : 'Hola,';

  const lines = [
    `${sym.wave} ${greeting}`,
    '',
    `${sym.check} Te informamos que tu equipo ${device.brand} ${device.model} ya est\u00e1 listo para recoger. ${sym.phone}`,
    '',
    `${sym.wrench} Servicio: ${device.serviceLabel}`,
  ];

  if (device.quotedPrice) {
    const { balance } = splitPayment(device.quotedPrice);
    lines.push(`${sym.money} Saldo pendiente al entregar: ${formatCOP(balance)}`);
  }

  lines.push(
    '',
    `${sym.clock} Por favor conf\u00edrmanos cu\u00e1ndo podr\u00edas pasar a recogerlo.`,
    '',
    `${sym.sparkles} Gracias, ${BRAND_NAME}.`,
  );

  return lines.join('\n');
};
