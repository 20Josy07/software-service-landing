import { splitPayment } from './paymentUtils';

const TZ = 'America/Bogota';

const startOfDay = (date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '01';
  return new Date(`${get('year')}-${get('month')}-${get('day')}T00:00:00-05:00`);
};

const startOfMonth = (date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '01';
  return new Date(`${get('year')}-${get('month')}-01T00:00:00-05:00`);
};

const sumPrices = (items) => items.reduce((acc, d) => acc + (Number(d.quotedPrice) || 0), 0);

const monthLabel = (date = new Date()) =>
  new Intl.DateTimeFormat('es-CO', { timeZone: TZ, month: 'long', year: 'numeric' }).format(date);

export const computeAdminStats = (devices) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const monthStart = startOfMonth(now);

  const active = devices.filter((d) => d.status !== 'entregado');
  const delivered = devices.filter((d) => d.status === 'entregado');

  const deliveredToday = delivered.filter(
    (d) => d.deliveredAt && d.deliveredAt >= todayStart,
  );
  const deliveredMonth = delivered.filter(
    (d) => d.deliveredAt && d.deliveredAt >= monthStart,
  );

  const byStatus = {
    recibido: devices.filter((d) => d.status === 'recibido'),
    en_proceso: devices.filter((d) => d.status === 'en_proceso'),
    listo: devices.filter((d) => d.status === 'listo'),
    entregado: delivered,
  };

  const readyDevices = byStatus.listo;
  const readyNotNotified = readyDevices.filter((d) => !d.readyNotifiedAt);

  let pendingCollection = 0;
  let depositsExpected = 0;

  active.forEach((d) => {
    const price = Number(d.quotedPrice) || 0;
    if (!price) return;
    const { deposit, balance } = splitPayment(price);
    if (d.status === 'listo') pendingCollection += balance;
    if (d.status === 'recibido' || d.status === 'en_proceso') depositsExpected += deposit;
  });

  const recentDeliveries = [...delivered]
    .sort((a, b) => (b.deliveredAt?.getTime() ?? 0) - (a.deliveredAt?.getTime() ?? 0))
    .slice(0, 5);

  const queuePreview = [...active]
    .sort((a, b) => a.intakeAt.getTime() - b.intakeAt.getTime())
    .slice(0, 5);

  return {
    monthLabel: monthLabel(now),
    activeCount: active.length,
    deliveredCount: delivered.length,
    todayRevenue: sumPrices(deliveredToday),
    todayDeliveredCount: deliveredToday.length,
    monthRevenue: sumPrices(deliveredMonth),
    monthDeliveredCount: deliveredMonth.length,
    pendingCollection,
    depositsExpected,
    workshopValue: sumPrices(active),
    readyCount: readyDevices.length,
    readyNotNotifiedCount: readyNotNotified.length,
    readyNotNotified,
    byStatus,
    recentDeliveries,
    queuePreview,
  };
};
