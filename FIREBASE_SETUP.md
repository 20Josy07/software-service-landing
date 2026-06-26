# Configuración Firebase — Panel Admin

## 1. Habilitar servicios en Firebase Console

Proyecto: **software-mobile-3435d**

1. **Authentication** → Sign-in method → activar **Correo/Contraseña**
2. **Authentication** → Users → **Add user** (tu correo y contraseña de admin)
3. **Firestore Database** → Crear base de datos (modo producción)
4. **Firestore** → Reglas → pegar el contenido de `firestore.rules` y publicar

## 2. Estructura en Firestore

### `settings/pricing`
```json
{
  "services": {
    "frp": 60000,
    "cuenta-mi": 60000,
    "flasheo": 60000,
    "root": 50000,
    "migracion": 40000,
    "instalacion-piezas": 30000
  },
  "updatedAt": "<timestamp>"
}
```

### `devices/{id}`
```json
{
  "customerName": "Juan Pérez",
  "customerPhone": "3150489702",
  "brand": "Samsung",
  "model": "Galaxy S21 5G",
  "service": "migracion",
  "serviceLabel": "Respaldo y Migración",
  "status": "recibido",
  "notes": "",
  "imei": "",
  "quotedPrice": 40000,
  "listPrice": 40000,
  "readyNotifiedAt": null,
  "deliveredAt": null,
  "intakeAt": "<timestamp>",
  "createdAt": "<timestamp>",
  "updatedAt": "<timestamp>"
}
```

Estados: `recibido` | `en_proceso` | `listo` | `entregado`

## 3. Acceso al panel

- URL: `http://localhost:5173/admin` (desarrollo)
- Producción: `https://tudominio.com/admin`
- Tras login: `/admin/panel`

## 4. Funciones del panel

| Sección | Función |
|---------|---------|
| **Dispositivos** | Registrar equipos, ver cola por orden de ingreso, cambiar estado, eliminar |
| **Precios** | Editar tarifas; la landing actualiza en tiempo real |

## 5. Desplegar reglas (CLI opcional)

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```
