import { deviceProblems } from '../data/deviceProblems';
import { OTHER_SERVICE_ID } from '../data/adminServices';
import { services } from '../data/services';

const normalize = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const FIELD_ALIASES = {
  marca: 'brand',
  model: 'model',
  modelo: 'model',
  servicio: 'service',
  'servicio de interes': 'service',
  problema: 'service',
  detalle: 'detail',
  nota: 'note',
  cliente: 'customerName',
  nombre: 'customerName',
  telefono: 'customerPhone',
  teléfono: 'customerPhone',
  whatsapp: 'customerPhone',
  celular: 'customerPhone',
  imei: 'imei',
};

const extractLineFields = (text) => {
  const fields = {};

  text.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([A-Za-zÁÉÍÓÚáéíóúñÑ\s]+?)\s*:\s*(.+)$/);
    if (!match) return;

    const key = normalize(match[1]);
    const alias = FIELD_ALIASES[key];
    if (alias && match[2].trim()) {
      fields[alias] = match[2].trim();
    }
  });

  return fields;
};

const extractInlineFields = (text, fields) => {
  const patterns = [
    ['brand', /marca\s*:\s*([^\n]+)/i],
    ['model', /modelo\s*:\s*([^\n]+)/i],
    ['service', /servicio(?:\s+de\s+inter[eé]s)?\s*:\s*([^\n]+)/i],
    ['service', /problema\s*:\s*([^\n]+)/i],
    ['detail', /detalle\s*:\s*([^\n]+)/i],
    ['note', /nota\s*:\s*([^\n]+)/i],
    ['customerName', /(?:cliente|nombre)\s*:\s*([^\n]+)/i],
    ['customerPhone', /(?:tel[eé]fono|whatsapp|celular)\s*:\s*([^\n]+)/i],
    ['imei', /imei\s*:\s*([^\n]+)/i],
  ];

  patterns.forEach(([key, regex]) => {
    if (fields[key]) return;
    const match = text.match(regex);
    if (match?.[1]?.trim()) fields[key] = match[1].trim();
  });
};

const extractPhone = (text) => {
  const labeled = text.match(/(?:tel[eé]fono|whatsapp|celular)\s*:\s*([\d\s+\-()]+)/i);
  if (labeled) return labeled[1].replace(/\D/g, '').replace(/^57/, '');

  const colombian = text.match(/(?:\+?57\s*)?(3\d{9})\b/);
  if (colombian) return colombian[1];

  return '';
};

export const matchServiceId = (serviceText) => {
  if (!serviceText?.trim()) return { id: null, label: serviceText };

  const normalized = normalize(serviceText);

  for (const s of services) {
    const title = normalize(s.title);
    if (title === normalized || normalized.includes(title) || title.includes(normalized)) {
      return { id: s.id, label: s.title };
    }
  }

  for (const p of deviceProblems) {
    const label = normalize(p.label);
    if (label === normalized || normalized.includes(label) || label.includes(normalized)) {
      return { id: p.serviceId, label: p.label };
    }
  }

  const keywords = [
    ['bypass frp', 'frp'],
    ['frp', 'frp'],
    ['cuenta mi', 'cuenta-mi'],
    ['cuenta google', 'frp'],
    ['flasheo', 'flasheo'],
    ['unbrick', 'flasheo'],
    ['bootloop', 'flasheo'],
    ['root', 'root'],
    ['magisk', 'root'],
    ['rom', 'root'],
    ['migracion', 'migracion'],
    ['migración', 'migracion'],
    ['respaldo', 'migracion'],
    ['repuesto', 'instalacion-piezas'],
    ['instalacion', 'instalacion-piezas'],
    ['instalación', 'instalacion-piezas'],
  ];

  for (const [kw, id] of keywords) {
    if (normalized.includes(kw)) {
      const service = services.find((s) => s.id === id);
      return { id, label: service?.title ?? serviceText };
    }
  }

  return { id: null, label: serviceText };
};

const resolveAdminService = (serviceMatch, rawServiceText) => {
  if (serviceMatch.id) {
    return { serviceId: serviceMatch.id, serviceLabel: serviceMatch.label, customServiceLabel: '' };
  }
  if (rawServiceText?.trim()) {
    return {
      serviceId: OTHER_SERVICE_ID,
      serviceLabel: rawServiceText.trim(),
      customServiceLabel: rawServiceText.trim(),
    };
  }
  return { serviceId: null, serviceLabel: '', customServiceLabel: '' };
};

/**
 * Parsea mensajes de WhatsApp del cliente (formato estructurado o con texto extra).
 */
export const parseClientMessage = (rawText) => {
  const text = rawText?.trim() ?? '';
  if (!text) {
    return { fields: {}, detected: [], missing: ['marca', 'modelo', 'servicio'], serviceId: null };
  }

  const fields = extractLineFields(text);
  extractInlineFields(text, fields);

  if (!fields.customerPhone) {
    const phone = extractPhone(text);
    if (phone) fields.customerPhone = phone;
  }

  const serviceMatch = matchServiceId(fields.service);
  const resolved = resolveAdminService(serviceMatch, fields.service);
  if (resolved.serviceId) {
    fields.serviceId = resolved.serviceId;
    fields.serviceLabel = resolved.serviceLabel;
    fields.customServiceLabel = resolved.customServiceLabel;
  } else if (fields.service) {
    fields.serviceLabel = fields.service;
  }

  const notes = [fields.detail, fields.note].filter(Boolean).join(' · ');

  const detected = [];
  const missing = [];

  if (fields.brand) detected.push('marca');
  else missing.push('marca');

  if (fields.model) detected.push('modelo');
  else missing.push('modelo');

  if (fields.service) detected.push('servicio');
  else missing.push('servicio');

  if (fields.customerName) detected.push('cliente');
  if (fields.customerPhone) detected.push('teléfono');
  if (notes) detected.push('notas');

  return {
    fields: {
      brand: fields.brand ?? '',
      model: fields.model ?? '',
      service: fields.service ?? '',
      serviceId: fields.serviceId ?? null,
      serviceLabel: fields.serviceLabel ?? '',
      customServiceLabel: fields.customServiceLabel ?? '',
      customerName: fields.customerName ?? '',
      customerPhone: fields.customerPhone ?? '',
      imei: fields.imei ?? '',
      notes,
    },
    detected,
    missing,
    serviceId: fields.serviceId ?? null,
  };
};

export const applyParsedToForm = (parsed, currentForm, catalog, prices = null) => {
  const { fields } = parsed;
  const serviceId =
    fields.serviceId ??
    catalog.find((s) => s.id === currentForm.service)?.id ??
    catalog[0]?.id;

  const listPrice =
    serviceId === OTHER_SERVICE_ID ? 0 : (prices?.[serviceId] ?? currentForm.listPrice ?? 0);

  return {
    ...currentForm,
    brand: fields.brand || currentForm.brand,
    model: fields.model || currentForm.model,
    service: serviceId,
    customServiceLabel:
      serviceId === OTHER_SERVICE_ID
        ? fields.customServiceLabel || fields.serviceLabel || currentForm.customServiceLabel
        : '',
    listPrice,
    quotedPrice:
      serviceId === OTHER_SERVICE_ID
        ? currentForm.quotedPrice
        : listPrice > 0
          ? String(listPrice)
          : currentForm.quotedPrice,
    customerName: fields.customerName || currentForm.customerName,
    customerPhone: fields.customerPhone || currentForm.customerPhone,
    imei: fields.imei || currentForm.imei,
    notes: fields.notes || currentForm.notes,
  };
};
