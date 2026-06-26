import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBrandById } from '../data/deviceCatalog';
import {
  filterModelsFromDatabase,
  loadDeviceDatabase,
  mergeModelLists,
  searchModelsRemote,
} from '../services/deviceModelsService';

export const useDeviceModels = (brandId, searchQuery, enabled = true) => {
  const [database, setDatabase] = useState(null);
  const [remoteModels, setRemoteModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [error, setError] = useState(null);

  const brand = getBrandById(brandId);

  useEffect(() => {
    if (!enabled || !brandId || brandId === 'otro') {
      setDatabase(null);
      setError(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    loadDeviceDatabase()
      .then((data) => {
        if (!cancelled) setDatabase(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Error al cargar modelos');
          setDatabase(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [brandId, enabled]);

  useEffect(() => {
    if (!enabled || !brandId || brandId === 'otro') {
      setRemoteModels([]);
      return undefined;
    }

    const query = searchQuery.trim();
    if (query.length < 3) {
      setRemoteModels([]);
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setRemoteLoading(true);
      const results = await searchModelsRemote(brandId, query);
      if (!cancelled) {
        setRemoteModels(results);
        setRemoteLoading(false);
      }
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [brandId, searchQuery, enabled]);

  const { models, total } = useMemo(() => {
    const featured = brand?.featured ?? [];
    if (!database || searchQuery.trim().length < 2) {
      return { models: [], total: featured.length };
    }
    return filterModelsFromDatabase(database, brandId, searchQuery);
  }, [database, brandId, searchQuery, brand?.featured]);

  const displayModels = useMemo(() => {
    const featured = brand?.featured ?? [];
    const query = searchQuery.trim().toLowerCase();
    const hasSearch = query.length >= 2;

    if (!hasSearch) {
      return featured;
    }

    const matchingFeatured = featured.filter((f) => f.toLowerCase().includes(query));
    return mergeModelLists(models, remoteModels, matchingFeatured);
  }, [models, remoteModels, searchQuery, brand?.featured]);

  const reload = useCallback(() => {
    setDatabase(null);
    setError(null);
    loadDeviceDatabase()
      .then(setDatabase)
      .catch((err) => setError(err.message || 'Error al cargar modelos'));
  }, []);

  return {
    models: displayModels,
    total,
    loading: loading || remoteLoading,
    error,
    reload,
    hasDatabase: Boolean(database),
  };
};
