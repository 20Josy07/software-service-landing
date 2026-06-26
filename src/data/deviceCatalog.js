export const CUSTOM_MODEL_OPTION = '__custom__';

export const deviceBrands = [
  {
    id: 'samsung',
    name: 'Samsung',
    apiBrands: ['Samsung'],
    featured: [
      'Galaxy A04',
      'Galaxy A14',
      'Galaxy A15',
      'Galaxy A24',
      'Galaxy A25',
      'Galaxy A34',
      'Galaxy A35',
      'Galaxy A54',
      'Galaxy A55',
      'Galaxy S21',
      'Galaxy S22',
      'Galaxy S23',
      'Galaxy S24',
      'Galaxy M14',
      'Galaxy M34',
      'Galaxy Z Flip5',
      'Galaxy Z Fold5',
    ],
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi / Redmi / POCO',
    apiBrands: ['Xiaomi', 'Redmi', 'POCO', 'Poco'],
    featured: ['Redmi Note 13', 'Redmi 13C', 'POCO X6', 'POCO M6', 'Xiaomi 14'],
  },
  {
    id: 'motorola',
    name: 'Motorola',
    apiBrands: ['Motorola'],
    featured: ['Moto G04', 'Moto G24', 'Moto G54', 'Moto G84', 'Moto Edge 40'],
  },
  {
    id: 'huawei',
    name: 'Huawei / Honor',
    apiBrands: ['Huawei', 'Honor'],
    featured: ['Huawei Nova', 'Honor X7', 'Honor 90', 'Huawei P40 Lite'],
  },
  {
    id: 'oppo',
    name: 'OPPO',
    apiBrands: ['OPPO', 'Oppo'],
    featured: ['OPPO A58', 'OPPO A78', 'OPPO Reno 10', 'OPPO A38'],
  },
  {
    id: 'realme',
    name: 'Realme',
    apiBrands: ['Realme', 'realme'],
    featured: ['Realme C53', 'Realme 11', 'Realme 12', 'Realme GT'],
  },
  {
    id: 'infinix',
    name: 'Infinix',
    apiBrands: ['Infinix'],
    featured: ['Infinix Hot 30', 'Infinix Hot 40', 'Infinix Note 30', 'Infinix Smart 8'],
  },
  {
    id: 'tecno',
    name: 'Tecno',
    apiBrands: ['Tecno'],
    featured: ['Tecno Spark 20', 'Tecno Camon 20', 'Tecno Pova 6', 'Tecno Pop 8'],
  },
  {
    id: 'vivo',
    name: 'Vivo',
    apiBrands: ['vivo', 'Vivo'],
    featured: ['vivo Y22', 'vivo Y36', 'vivo V29', 'vivo Y17'],
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    apiBrands: ['OnePlus'],
    featured: ['OnePlus Nord CE 3', 'OnePlus Nord 3', 'OnePlus 12', 'OnePlus Nord N30'],
  },
  {
    id: 'google',
    name: 'Google Pixel',
    apiBrands: ['Google'],
    featured: ['Pixel 7a', 'Pixel 8', 'Pixel 8a', 'Pixel 6a'],
  },
  {
    id: 'otro',
    name: 'Otra marca',
    apiBrands: [],
    featured: [],
  },
];

export const getBrandById = (id) => deviceBrands.find((b) => b.id === id);

export const isOtherBrand = (brandId) => brandId === 'otro';

export const isCustomModelSelection = (model) =>
  model === CUSTOM_MODEL_OPTION || model === '';
