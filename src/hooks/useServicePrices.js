import { useEffect, useState } from 'react';
import { subscribePricing } from '../firebase/pricingService';
import { formatCOP } from '../utils/formatPrice';
import { services as staticServices } from '../data/services';

export const useServicePrices = () => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribePricing((data) => {
      setPrices(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const servicesWithPrices = staticServices.map((service) => ({
    ...service,
    priceAmount: prices?.[service.id] ?? null,
    price: prices ? formatCOP(prices[service.id]) : service.price,
  }));

  return { prices, services: servicesWithPrices, loading };
};
