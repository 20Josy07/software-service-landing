import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { DEFAULT_PRICES } from '../constants/defaultPrices';
import { db } from './config';

const PRICING_DOC = doc(db, 'settings', 'pricing');

export const getDefaultPrices = () => ({ ...DEFAULT_PRICES });

export const fetchPricing = async () => {
  const snap = await getDoc(PRICING_DOC);
  if (!snap.exists()) return getDefaultPrices();
  return { ...getDefaultPrices(), ...snap.data().services };
};

export const subscribePricing = (callback) =>
  onSnapshot(
    PRICING_DOC,
    (snap) => {
      if (!snap.exists()) {
        callback(getDefaultPrices());
        return;
      }
      callback({ ...getDefaultPrices(), ...snap.data().services });
    },
    () => callback(getDefaultPrices())
  );

export const savePricing = async (services) => {
  await setDoc(
    PRICING_DOC,
    { services, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const seedPricingIfEmpty = async () => {
  const snap = await getDoc(PRICING_DOC);
  if (!snap.exists()) {
    await savePricing(getDefaultPrices());
  }
};
