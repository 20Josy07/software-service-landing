import { services } from './services';

export const OTHER_SERVICE_ID = 'otro';

export const isOtherService = (serviceId) => serviceId === OTHER_SERVICE_ID;

/** Opciones del selector en panel admin (catálogo + otro servicio) */
export const adminServiceOptions = [
  ...services,
  {
    id: OTHER_SERVICE_ID,
    title: 'Otro servicio',
    duration: '1–2 horas',
    durationMin: 60,
    durationMax: 120,
  },
];

export const getAdminServiceOption = (serviceId) =>
  adminServiceOptions.find((s) => s.id === serviceId);
