export const deviceProblems = [
  {
    id: 'frp',
    label: 'Bloqueo FRP / Cuenta Google',
    description: 'Pide cuenta Google tras reset o actualización',
    serviceId: 'frp',
  },
  {
    id: 'cuenta-mi',
    label: 'Cuenta Mi bloqueada',
    description: 'Xiaomi, Redmi o POCO pide verificación Mi',
    serviceId: 'cuenta-mi',
  },
  {
    id: 'bootloop',
    label: 'Bootloop / No enciende',
    description: 'Reinicio en bucle, logo congelado o muerte de software',
    serviceId: 'flasheo',
  },
  {
    id: 'flasheo',
    label: 'Flasheo / Actualizar firmware',
    description: 'Reinstalar sistema, downgrade o recuperar software',
    serviceId: 'flasheo',
  },
  {
    id: 'root',
    label: 'Root, Magisk o ROM',
    description: 'Desbloqueo de bootloader, root o ROM personalizada',
    serviceId: 'root',
  },
  {
    id: 'migracion',
    label: 'Respaldo y migración de datos',
    description: 'Pasar WhatsApp, fotos y archivos a otro equipo',
    serviceId: 'migracion',
  },
  {
    id: 'instalacion-piezas',
    label: 'Instalar repuesto (pieza del cliente)',
    description: 'Pantalla, batería, pin de carga u otra pieza que tú ya tengas',
    serviceId: 'instalacion-piezas',
  },
  {
    id: 'otro',
    label: 'Otro servicio',
    description: 'Describe tu caso en el siguiente paso',
    serviceId: null,
  },
];

export const getProblemById = (id) => deviceProblems.find((p) => p.id === id);

export const getProblemByServiceId = (serviceId) =>
  deviceProblems.find((p) => p.id === serviceId) ??
  deviceProblems.find((p) => p.serviceId === serviceId);
