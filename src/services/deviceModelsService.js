import { getBrandById } from '../data/deviceCatalog';
import {
  isDisplayableModel,
  MIN_SEARCH_LENGTH,
  normalizeModelName,
  sortModelsByRelevance,
} from '../utils/modelFilters';

const DEVICES_CDN_URL =
  'https://cdn.jsdelivr.net/gh/bsthen/device-models@main/devices.json';

const PHONE_SPECS_SEARCH = 'https://api-mobilespecs.azharimm.dev/v2/search';

const CACHE_KEY = 'smp-device-models-v2';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_RESULTS = 60;

let memoryCache = null;
let loadPromise = null;

const readSessionCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeSessionCache = (data) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* quota exceeded */
  }
};

export const loadDeviceDatabase = async () => {
  if (memoryCache) return memoryCache;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const cached = readSessionCache();
    if (cached) {
      memoryCache = cached;
      return cached;
    }

    const response = await fetch(DEVICES_CDN_URL);
    if (!response.ok) throw new Error('No se pudo cargar el catálogo de dispositivos');

    const data = await response.json();
    memoryCache = data;
    writeSessionCache(data);
    return data;
  })();

  try {
    return await loadPromise;
  } finally {
    loadPromise = null;
  }
};

const brandMatches = (deviceBrand, apiBrands) => {
  if (!deviceBrand || !apiBrands?.length) return false;
  const normalized = deviceBrand.toLowerCase();
  return apiBrands.some(
    (b) => normalized === b.toLowerCase() || normalized.includes(b.toLowerCase())
  );
};

export const filterModelsFromDatabase = (database, brandId, searchQuery = '') => {
  const brand = getBrandById(brandId);
  if (!brand?.apiBrands?.length) return { models: [], total: 0 };

  const query = searchQuery.trim();
  if (query.length < MIN_SEARCH_LENGTH) {
    return { models: [], total: 0 };
  }

  const unique = new Map();

  Object.entries(database).forEach(([, device]) => {
    if (!brandMatches(device.brand, brand.apiBrands)) return;

    const rawName = (device.name || '').trim();
    if (!rawName) return;
    if (!isDisplayableModel(brandId, rawName, query)) return;
    if (!rawName.toLowerCase().includes(query.toLowerCase())) return;

    const displayName = normalizeModelName(brandId, rawName);
    const key = displayName.toLowerCase();
    if (!unique.has(key)) unique.set(key, displayName);
  });

  const sorted = sortModelsByRelevance(brandId, Array.from(unique.values()), query);

  return {
    models: sorted.slice(0, MAX_RESULTS),
    total: sorted.length,
  };
};

export const searchModelsRemote = async (brandId, searchQuery) => {
  const query = searchQuery.trim();
  if (query.length < MIN_SEARCH_LENGTH) return [];

  const brand = getBrandById(brandId);
  const brandHint = brand?.apiBrands?.[0] ?? brand?.name ?? '';
  const fullQuery = brandHint ? `${brandHint} ${query}` : query;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `${PHONE_SPECS_SEARCH}?query=${encodeURIComponent(fullQuery)}`,
      { signal: controller.signal }
    );
    if (!response.ok) return [];

    const json = await response.json();
    const phones = json?.data?.phones ?? json?.phones ?? [];

    return phones
      .map((p) => normalizeModelName(brandId, p.phone_name || p.name || ''))
      .filter((name) => name && isDisplayableModel(brandId, name, query))
      .slice(0, 20);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
};

export const mergeModelLists = (primary = [], secondary = [], featured = []) => {
  const seen = new Set();
  const result = [];

  const add = (name) => {
    const trimmed = name?.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push(trimmed);
  };

  featured.forEach(add);
  primary.forEach(add);
  secondary.forEach(add);

  return result;
};
