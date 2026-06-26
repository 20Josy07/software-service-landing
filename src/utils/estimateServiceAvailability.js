import { services } from '../data/services';

const TZ = 'America/Bogota';

const WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const STATUS_QUEUE_WEIGHT = {
  recibido: 1,
  en_proceso: 0.5,
  listo: 0,
};

const pad = (n) => String(n).padStart(2, '0');

const makeBogotaDate = (year, month, day, hour, minute = 0) =>
  new Date(`${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00-05:00`);

export const getBogotaDateParts = (date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    dayOfWeek: WEEKDAY_MAP[parts.find((p) => p.type === 'weekday')?.value] ?? 0,
  };
};

const getScheduleForDay = (dayOfWeek) => {
  if (dayOfWeek === 0) return null;
  if (dayOfWeek === 6) return { open: 10, close: 14 };
  return { open: 9, close: 19 };
};

const nextDayOpen = (from) => {
  const parts = getBogotaDateParts(from);
  let cursor = makeBogotaDate(parts.year, parts.month, parts.day, 12, 0);

  for (let i = 0; i < 8; i += 1) {
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
    const p = getBogotaDateParts(cursor);
    const schedule = getScheduleForDay(p.dayOfWeek);
    if (schedule) return makeBogotaDate(p.year, p.month, p.day, schedule.open, 0);
  }

  return from;
};

const alignToOpenHours = (date) => {
  const parts = getBogotaDateParts(date);
  const schedule = getScheduleForDay(parts.dayOfWeek);

  if (!schedule) return nextDayOpen(date);

  const open = makeBogotaDate(parts.year, parts.month, parts.day, schedule.open, 0);
  const close = makeBogotaDate(parts.year, parts.month, parts.day, schedule.close, 0);

  if (date < open) return open;
  if (date >= close) return nextDayOpen(date);
  return date;
};

export const addWorkingMinutes = (start, minutesToAdd) => {
  if (minutesToAdd <= 0) return alignToOpenHours(start);

  let remaining = minutesToAdd;
  let cursor = alignToOpenHours(start);

  while (remaining > 0) {
    const parts = getBogotaDateParts(cursor);
    const schedule = getScheduleForDay(parts.dayOfWeek);

    if (!schedule) {
      cursor = nextDayOpen(cursor);
      continue;
    }

    const open = makeBogotaDate(parts.year, parts.month, parts.day, schedule.open, 0);
    const close = makeBogotaDate(parts.year, parts.month, parts.day, schedule.close, 0);

    if (cursor < open) cursor = open;
    if (cursor >= close) {
      cursor = nextDayOpen(cursor);
      continue;
    }

    const availableToday = (close.getTime() - cursor.getTime()) / 60000;

    if (remaining <= availableToday) {
      return new Date(cursor.getTime() + remaining * 60000);
    }

    remaining -= availableToday;
    cursor = nextDayOpen(cursor);
  }

  return cursor;
};

export const getServiceDuration = (serviceId) => {
  if (serviceId === 'otro') {
    return { label: '1–2 horas', min: 60, max: 120, avg: 90 };
  }
  const service = services.find((s) => s.id === serviceId);
  const min = service?.durationMin ?? 60;
  const max = service?.durationMax ?? 120;

  return {
    label: service?.duration ?? '1–2 horas',
    min,
    max,
    avg: Math.round((min + max) / 2),
  };
};

export const getQueueWorkloadMinutes = (queueDevices) =>
  queueDevices.reduce((sum, device) => {
    const duration = getServiceDuration(device.service);
    const weight = STATUS_QUEUE_WEIGHT[device.status] ?? 1;
    return sum + duration.avg * weight;
  }, 0);

const dateKey = (date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

const formatTime = (date) =>
  new Intl.DateTimeFormat('es-CO', {
    timeZone: TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

const formatDayLabel = (date, reference = new Date()) => {
  const key = dateKey(date);
  const todayKey = dateKey(reference);
  const tomorrow = new Date(reference.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowKey = dateKey(tomorrow);

  if (key === todayKey) return 'hoy';
  if (key === tomorrowKey) return 'ma\u00f1ana';

  return new Intl.DateTimeFormat('es-CO', {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(date);
};

const formatAvailabilityRange = (from, to, reference = new Date()) => {
  const fromDay = formatDayLabel(from, reference);
  const toDay = formatDayLabel(to, reference);
  const fromTime = formatTime(from);
  const toTime = formatTime(to);

  if (fromDay === toDay) return `${fromDay} ${fromTime} – ${toTime}`;
  return `${fromDay} ${fromTime} – ${toDay} ${toTime}`;
};

const formatQueueMinutes = (minutes) => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (mins === 0) return `${hours} h`;
  return `${hours} h ${mins} min`;
};

export const estimateServiceAvailability = ({
  serviceId,
  queueDevices = [],
  fromDate = new Date(),
}) => {
  const duration = getServiceDuration(serviceId);
  const queueMinutes = getQueueWorkloadMinutes(queueDevices);
  const queueCount = queueDevices.length;
  const start = alignToOpenHours(fromDate);
  const isClosedNow = start.getTime() > fromDate.getTime() + 60_000;

  const readyFrom = addWorkingMinutes(start, queueMinutes + duration.min);
  const readyTo = addWorkingMinutes(start, queueMinutes + duration.max);

  return {
    durationLabel: duration.label,
    queueCount,
    queueMinutes,
    queueLabel: queueCount === 0 ? null : formatQueueMinutes(queueMinutes),
    readyFrom,
    readyTo,
    availabilityLabel: formatAvailabilityRange(readyFrom, readyTo, fromDate),
    isClosedNow,
    startsAt: start,
    startsAtLabel: isClosedNow
      ? `${formatDayLabel(start, fromDate)} ${formatTime(start)}`
      : null,
  };
};
