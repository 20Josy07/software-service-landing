import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { normalizeCustomerPhone } from '../constants/contact';
import { db } from './config';

const devicesCol = collection(db, 'devices');

export const DEVICE_STATUSES = [
  { id: 'recibido', label: 'Recibido', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
  { id: 'en_proceso', label: 'En proceso', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  { id: 'listo', label: 'Listo', color: 'text-cyber-400 bg-cyber-400/15 border-cyber-400/30' },
  { id: 'entregado', label: 'Entregado', color: 'text-slate-400 bg-slate-500/15 border-slate-500/30' },
];

export const getStatusMeta = (statusId) =>
  DEVICE_STATUSES.find((s) => s.id === statusId) ?? DEVICE_STATUSES[0];

export const subscribeDevices = (callback, onError) => {
  const q = query(devicesCol, orderBy('intakeAt', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        intakeAt: d.data().intakeAt?.toDate?.() ?? new Date(),
        readyNotifiedAt: d.data().readyNotifiedAt?.toDate?.() ?? null,
        deliveredAt: d.data().deliveredAt?.toDate?.() ?? null,
      }));
      callback(items);
    },
    (error) => {
      onError?.(error);
    },
  );
};

export const createDevice = async (data) => {
  const phone = normalizeCustomerPhone(data.customerPhone);
  await addDoc(devicesCol, {
    customerName: data.customerName.trim(),
    customerPhone: phone || data.customerPhone.trim(),
    brand: data.brand.trim(),
    model: data.model.trim(),
    service: data.service,
    serviceLabel: data.serviceLabel,
    status: 'recibido',
    notes: data.notes?.trim() ?? '',
    imei: data.imei?.trim() ?? '',
    quotedPrice: data.quotedPrice ?? null,
    listPrice: data.listPrice ?? null,
    readyNotifiedAt: null,
    intakeAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateDevice = async (id, data) => {
  await updateDoc(doc(db, 'devices', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDevice = async (id) => {
  await deleteDoc(doc(db, 'devices', id));
};
