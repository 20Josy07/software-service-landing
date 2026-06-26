import { services } from '../data/services';

export const buildQuoteMessage = ({
  brandName,
  model,
  serviceLabel,
  serviceDetail = '',
  serviceId = null,
}) => {
  const service = serviceId ? services.find((s) => s.id === serviceId) : null;
  const serviceName = service?.title ?? serviceLabel;

  const lines = [
    'Hola, quiero solicitar un servicio de software móvil.',
    '',
    `Marca: ${brandName}`,
    `Modelo: ${model}`,
    `Servicio: ${serviceName}`,
  ];

  if (serviceDetail.trim()) {
    lines.push(`Detalle: ${serviceDetail.trim()}`);
  }

  if (service?.id === 'instalacion-piezas') {
    lines.push('Nota: Yo proporciono la pieza. Solo necesito instalación.');
  }

  lines.push('', 'Quedo atento a su respuesta. Gracias.');

  return lines.join('\n');
};
