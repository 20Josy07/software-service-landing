/**
 * Filtra nombres técnicos / codenames del catálogo Google Play
 * y prioriza nombres comerciales que el cliente reconoce.
 */

const LEGACY_OBSCURE =
  /captivate|admire|baffin|mesmerize|vitality|epic\s*4g|stratosphere|continuum|intercept|replenish|transfix|conquer|illusion|gem|indulge|avid|prelude|comment|ch@t|exhibit|character|suede|seek|doubletime|i200|i405|i927|i997/i;

const CODENAME_ONLY = /^[a-z0-9]+$/i;

const stripBrandPrefix = (name, prefixes = []) => {
  let result = name.trim();
  prefixes.forEach((prefix) => {
    const re = new RegExp(`^${prefix}\\s+`, 'i');
    result = result.replace(re, '');
  });
  return result.trim();
};

const brandRules = {
  samsung: {
    prefixes: ['Samsung'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      const q = query.toLowerCase();

      if (LEGACY_OBSCURE.test(lower)) return false;

      const core = stripBrandPrefix(name, ['Samsung']).toLowerCase();

      if (q.length >= 2 && lower.includes(q)) {
        if (lower.includes('galaxy')) return true;
        if (/^[aszmf]\d/i.test(q) || /\d{2}/.test(q)) return true;
        if (core.split(/\s+/).length === 1 && CODENAME_ONLY.test(core)) return false;
        return true;
      }

      return lower.includes('galaxy');
    },
    score: (name, query) => {
      const lower = name.toLowerCase();
      let score = 0;
      if (lower.includes('galaxy')) score += 50;
      if (/galaxy\s+s\d/i.test(lower)) score += 40;
      if (/galaxy\s+a\d/i.test(lower)) score += 35;
      if (/galaxy\s+m\d/i.test(lower)) score += 30;
      if (/galaxy\s+z/i.test(lower)) score += 25;
      if (/5g/i.test(lower)) score += 5;
      if (query && lower.includes(query.toLowerCase())) score += 30;
      const yearMatch = lower.match(/20(1[8-9]|2[0-6])/);
      if (yearMatch) score += parseInt(yearMatch[1], 10) - 10;
      return score;
    },
    normalize: (name) => {
      const n = stripBrandPrefix(name, ['Samsung']);
      return n.toLowerCase().startsWith('galaxy') ? n : `Galaxy ${n}`;
    },
  },
  xiaomi: {
    prefixes: ['Xiaomi', 'Redmi', 'POCO', 'Poco'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      const q = query.toLowerCase();
      const hasLine = /xiaomi|redmi|poco|mi\s+\d|mi\s+note/i.test(lower);
      if (!hasLine) return false;
      if (q.length >= 2) return lower.includes(q);
      return true;
    },
    score: (name, query) => {
      let score = 0;
      const lower = name.toLowerCase();
      if (/redmi\s+note/i.test(lower)) score += 40;
      if (/poco/i.test(lower)) score += 35;
      if (/redmi/i.test(lower)) score += 30;
      if (query && lower.includes(query.toLowerCase())) score += 25;
      return score;
    },
    normalize: (name) => name.trim(),
  },
  motorola: {
    prefixes: ['Motorola', 'Moto'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      const q = query.toLowerCase();
      if (!/moto|motorola|edge|razr|thinkphone/i.test(lower)) return false;
      if (q.length >= 2) return lower.includes(q);
      return true;
    },
    score: (name, query) => {
      const lower = name.toLowerCase();
      let score = /moto\s+g/i.test(lower) ? 35 : 20;
      if (/edge/i.test(lower)) score += 30;
      if (query && lower.includes(query.toLowerCase())) score += 25;
      return score;
    },
    normalize: (name) => name.replace(/^Motorola\s+/i, '').trim(),
  },
  huawei: {
    prefixes: ['Huawei', 'Honor'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      const q = query.toLowerCase();
      if (!/huawei|honor/i.test(lower)) return false;
      if (q.length >= 2) return lower.includes(q);
      return true;
    },
    score: (name, query) => (query && name.toLowerCase().includes(query.toLowerCase()) ? 30 : 10),
    normalize: (name) => name.trim(),
  },
  oppo: {
    prefixes: ['OPPO', 'Oppo'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      if (!/oppo|realme/i.test(lower)) return false;
      return query.length < 2 || lower.includes(query.toLowerCase());
    },
    score: (name, query) => {
      let score = /reno/i.test(name) ? 30 : 15;
      if (query && name.toLowerCase().includes(query.toLowerCase())) score += 25;
      return score;
    },
    normalize: (name) => name.trim(),
  },
  realme: {
    prefixes: ['realme', 'Realme'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      if (!/realme/i.test(lower)) return false;
      return query.length < 2 || lower.includes(query.toLowerCase());
    },
    score: (name, query) => (query && name.toLowerCase().includes(query.toLowerCase()) ? 30 : 10),
    normalize: (name) => name.trim(),
  },
  infinix: {
    prefixes: ['Infinix'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      if (!/infinix/i.test(lower)) return false;
      return query.length < 2 || lower.includes(query.toLowerCase());
    },
    score: (name, query) => (query && name.toLowerCase().includes(query.toLowerCase()) ? 30 : 10),
    normalize: (name) => name.trim(),
  },
  tecno: {
    prefixes: ['Tecno'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      if (!/tecno/i.test(lower)) return false;
      return query.length < 2 || lower.includes(query.toLowerCase());
    },
    score: (name, query) => (query && name.toLowerCase().includes(query.toLowerCase()) ? 30 : 10),
    normalize: (name) => name.trim(),
  },
  vivo: {
    prefixes: ['vivo', 'Vivo', 'iQOO'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      if (!/vivo|iqoo/i.test(lower)) return false;
      return query.length < 2 || lower.includes(query.toLowerCase());
    },
    score: (name, query) => (query && name.toLowerCase().includes(query.toLowerCase()) ? 30 : 10),
    normalize: (name) => name.trim(),
  },
  oneplus: {
    prefixes: ['OnePlus'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      if (!/oneplus|one\s*plus/i.test(lower)) return false;
      return query.length < 2 || lower.includes(query.toLowerCase());
    },
    score: (name, query) => (query && name.toLowerCase().includes(query.toLowerCase()) ? 30 : 10),
    normalize: (name) => name.trim(),
  },
  google: {
    prefixes: ['Google'],
    isConsumer: (name, query) => {
      const lower = name.toLowerCase();
      if (!/pixel/i.test(lower)) return false;
      return query.length < 2 || lower.includes(query.toLowerCase());
    },
    score: (name, query) => {
      let score = /pixel/i.test(name) ? 40 : 0;
      if (query && name.toLowerCase().includes(query.toLowerCase())) score += 25;
      return score;
    },
    normalize: (name) => name.replace(/^Google\s+/i, '').trim(),
  },
};

const defaultRule = {
  prefixes: [],
  isConsumer: (name, query) =>
    query.length < 2 || name.toLowerCase().includes(query.toLowerCase()),
  score: (name, query) =>
    query && name.toLowerCase().includes(query.toLowerCase()) ? 20 : 0,
  normalize: (name) => name.trim(),
};

export const getBrandRules = (brandId) => brandRules[brandId] ?? defaultRule;

export const isDisplayableModel = (brandId, name, query = '') =>
  getBrandRules(brandId).isConsumer(name, query.trim());

export const normalizeModelName = (brandId, name) =>
  getBrandRules(brandId).normalize(name);

export const sortModelsByRelevance = (brandId, names, query = '') => {
  const rules = getBrandRules(brandId);
  const q = query.trim();

  return [...names].sort((a, b) => {
    const scoreDiff = rules.score(b, q) - rules.score(a, q);
    if (scoreDiff !== 0) return scoreDiff;
    return a.localeCompare(b, 'es');
  });
};

export const MIN_SEARCH_LENGTH = 2;
