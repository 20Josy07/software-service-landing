import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { subscribeDevices } from '../firebase/devicesService';
import { computeAdminStats } from '../utils/adminStats';

const AdminDevicesContext = createContext(null);

export const AdminDevicesProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const unsub = subscribeDevices(
      (items) => {
        setDevices(items);
        setLoading(false);
        setLoadError(null);
      },
      () => {
        setLoading(false);
        setLoadError('No se pudieron cargar los datos del taller.');
      },
    );
    return unsub;
  }, []);

  const stats = useMemo(() => computeAdminStats(devices), [devices]);

  const value = useMemo(
    () => ({ devices, loading, loadError, stats }),
    [devices, loading, loadError, stats],
  );

  return (
    <AdminDevicesContext.Provider value={value}>{children}</AdminDevicesContext.Provider>
  );
};

export const useAdminDevices = () => {
  const ctx = useContext(AdminDevicesContext);
  if (!ctx) throw new Error('useAdminDevices debe usarse dentro de AdminDevicesProvider');
  return ctx;
};
