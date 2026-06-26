export const services = [
  {
    id: 'frp',
    icon: 'frp',
    title: 'Bypass FRP',
    subtitle: 'Cuentas Google',
    description:
      'Eliminación de bloqueo FRP en parches antiguos y recientes. Evaluamos modelo y versión de Android antes de iniciar.',
    price: '$60.000',
    duration: '30–90 min',
    durationMin: 30,
    durationMax: 90,
    accent: 'blue',
    whatsappMessage:
      'Hola, necesito cotizar Bypass FRP. Mi equipo es: [marca/modelo], Android [versión].',
  },
  {
    id: 'cuenta-mi',
    icon: 'cuenta-mi',
    title: 'Desbloqueo Cuenta Mi',
    subtitle: 'Xiaomi / Redmi / POCO',
    description:
      'Bypass temporal o definitivo vía servidor. Solo equipos con procedencia verificada y sin reporte en base CRC.',
    price: '$60.000',
    duration: '1–3 horas',
    durationMin: 60,
    durationMax: 180,
    accent: 'orange',
    whatsappMessage:
      'Hola, necesito desbloquear Cuenta Mi. Mi Xiaomi es: [modelo], IMEI verificado.',
  },
  {
    id: 'flasheo',
    icon: 'flasheo',
    title: 'Flasheo y Unbrick',
    subtitle: 'Recuperación de sistema',
    description:
      'Revivimos bootloop, muerte de software o fallos post-actualización. Firmware oficial o custom según el caso.',
    price: '$60.000',
    duration: '45–120 min',
    durationMin: 45,
    durationMax: 120,
    accent: 'green',
    whatsappMessage:
      'Hola, mi teléfono está en bootloop/muerto. Modelo: [marca/modelo]. Necesito flasheo/unbrick.',
  },
  {
    id: 'root',
    icon: 'root',
    title: 'Root y Modificaciones',
    subtitle: 'Magisk · ROMs · Bootloader',
    description:
      'Bootloader, Magisk para root oculto y ROMs personalizadas. Para usuarios avanzados que buscan control total.',
    price: '$50.000',
    duration: '1–2 horas',
    durationMin: 60,
    durationMax: 120,
    accent: 'purple',
    whatsappMessage:
      'Hola, quiero root/modificar mi equipo. Modelo: [marca/modelo], objetivo: [Magisk/ROM/etc].',
  },
  {
    id: 'migracion',
    icon: 'migracion',
    title: 'Respaldo y Migración',
    subtitle: 'Transferencia profunda',
    description:
      'WhatsApp con historial, contactos, fotos, apps y configuraciones. Minimizamos pérdida de datos al cambiar de equipo.',
    price: '$40.000',
    duration: '30–60 min',
    durationMin: 30,
    durationMax: 60,
    accent: 'cyan',
    whatsappMessage:
      'Hola, necesito migrar datos de [equipo viejo] a [equipo nuevo]. ¿Qué incluye el respaldo?',
  },
  {
    id: 'instalacion-piezas',
    icon: 'instalacion',
    title: 'Instalación de Repuestos',
    subtitle: 'Mano de obra · Pieza del cliente',
    description:
      'Instalamos pantallas, baterías, conectores de carga, cámaras y más. Tú proporcionas la pieza — no vendemos ni gestionamos repuestos.',
    price: '$30.000',
    duration: '30–90 min',
    durationMin: 30,
    durationMax: 90,
    accent: 'amber',
    note: 'Solo mano de obra. La pieza la trae el cliente.',
    whatsappMessage:
      'Hola, necesito instalar un repuesto que ya tengo. Modelo: [marca/modelo]. Pieza: [pantalla/batería/etc].',
  },
];

export const accentStyles = {
  blue: {
    border: 'hover:border-blue-500/40',
    glow: 'group-hover:shadow-blue-500/10',
    tag: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  orange: {
    border: 'hover:border-orange-500/40',
    glow: 'group-hover:shadow-orange-500/10',
    tag: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  },
  green: {
    border: 'hover:border-green-500/40',
    glow: 'group-hover:shadow-green-500/10',
    tag: 'text-green-400 bg-green-500/10 border-green-500/20',
  },
  purple: {
    border: 'hover:border-purple-500/40',
    glow: 'group-hover:shadow-purple-500/10',
    tag: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  cyan: {
    border: 'hover:border-cyan-500/40',
    glow: 'group-hover:shadow-cyan-500/10',
    tag: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  amber: {
    border: 'hover:border-amber-500/40',
    glow: 'group-hover:shadow-amber-500/10',
    tag: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
};
