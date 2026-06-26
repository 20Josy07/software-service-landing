# Software Móvil Pro — Landing Page

Landing page profesional para servicios técnicos especializados en software Android.

## Stack

- React 18 + Vite
- Tailwind CSS 3 (Mobile-First, Dark Mode)

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Configuración

Edita `src/constants/contact.js` para actualizar:

- Número de WhatsApp (`WHATSAPP_NUMBER`)
- Mensaje predeterminado del chat
- Horarios de atención
- Nombre de la marca

## Estructura de componentes

```
src/
├── components/
│   ├── HeroSection.jsx      # Hero con CTA principal
│   ├── ServicesSection.jsx  # Grid de servicios con precios
│   ├── PoliciesSection.jsx  # Políticas de transparencia
│   ├── Footer.jsx           # Contacto y horarios
│   └── WhatsAppButton.jsx   # Botón reutilizable de WhatsApp
├── constants/
│   └── contact.js           # Datos de contacto centralizados
└── App.jsx                  # Composición principal
```

## Build para producción

```bash
npm run build
npm run preview
```
