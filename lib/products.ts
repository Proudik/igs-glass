import type { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    slug: 'fixed-rooflight-1000x1500',
    sku: 'IGS-FRL-1000-1500',
    name: 'Fixed Rooflight 1000 x 1500mm',
    shortDescription: 'Suitable for external kerb dimensions of 1000 x 1500mm.',
    description: `Fixed rooflight glass unit designed for external kerb dimensions of 1000 x 1500mm.\n\nFor bespoke sizes or alternative glass specifications, please contact the office.`,
    category: 'rooflights',
    subcategory: 'fixed-rooflights',
    images: [
      {
        id: 'img_001a',
        url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Fixed Rooflight 1000 x 1500mm',
        isPrimary: true,
      },
      {
        id: 'img_001b',
        url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Natural light through rooflight',
      },
      {
        id: 'img_001c',
        url: 'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Rooflight installation',
      },
    ],
    variants: [
      {
        id: 'var_001a',
        sku: 'IGS-FRL-1000-1500-STD',
        dimensions: { width: 1000, length: 1500 },
        price: 39500,
        stockLevel: 10,
        leadTimeDays: 14,
        isAvailable: true,
      },
    ],
    specifications: [
      { key: 'Outer', value: '6mm heat soak tested toughened glass' },
      { key: 'Cavity', value: '16mm argon filled cavity with warm edge spacer' },
      { key: 'Inner', value: '9.5mm Low-E heat soak tested toughened PVB laminated glass' },
      { key: 'Bespoke', value: 'For bespoke sizes or alternative glass specifications, please contact the office.' },
    ],
    features: [
      '6mm heat soak tested toughened outer glass',
      '16mm argon filled cavity with warm edge spacer',
      '9.5mm Low-E laminated inner glass',
      'Suitable for 1000 x 1500mm external kerb opening',
    ],
    glassType: ['double-glazed', 'laminated', 'toughened'],
    frameFinish: [],
    certifications: [],
    uValue: undefined,
    isConfigurable: false,
    isFeatured: true,
    tags: ['rooflight', 'fixed', '1000x1500'],
    deliveryInfo: '14 working day lead time. Please contact the office for delivery details.',
    warrantyYears: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod_002',
    slug: 'fixed-rooflight-1500x2000',
    sku: 'IGS-FRL-1500-2000',
    name: 'Fixed Rooflight 1500 x 2000mm',
    shortDescription: 'Large fixed rooflight for daylight-led extensions and premium residential projects.',
    description: `Large fixed rooflight glass unit for architectural daylight, extensions and premium residential projects.\n\nFor bespoke sizes or alternative glass specifications, please contact the office.`,
    category: 'rooflights',
    subcategory: 'fixed-rooflights',
    images: [
      {
        id: 'img_002a',
        url: 'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Fixed Rooflight 1500 x 2000mm',
        isPrimary: true,
      },
      {
        id: 'img_002b',
        url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Large format rooflight',
      },
      {
        id: 'img_002c',
        url: 'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Kitchen extension with rooflight',
      },
    ],
    variants: [
      {
        id: 'var_002a',
        sku: 'IGS-FRL-1500-2000-STD',
        dimensions: { width: 1500, length: 2000 },
        price: 54500,
        stockLevel: 8,
        leadTimeDays: 14,
        isAvailable: true,
      },
    ],
    specifications: [
      { key: 'Outer', value: 'Heat soak tested toughened glass' },
      { key: 'Cavity', value: 'Argon filled cavity with warm edge spacer' },
      { key: 'Inner', value: 'Low-E laminated safety glass specification' },
      { key: 'Bespoke', value: 'For bespoke sizes or alternative glass specifications, please contact the office.' },
    ],
    features: [
      'Heat soak tested toughened outer glass',
      'Argon filled cavity with warm edge spacer',
      'Low-E laminated inner glass',
      'Suitable for 1500 x 2000mm external kerb opening',
    ],
    glassType: ['double-glazed', 'laminated', 'toughened'],
    frameFinish: [],
    certifications: [],
    uValue: undefined,
    isConfigurable: false,
    isFeatured: true,
    tags: ['rooflight', 'fixed', '1500x2000', 'large format'],
    deliveryInfo: '14 working day lead time. Please contact the office for delivery details.',
    warrantyYears: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured);

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pence / 100);
}

export function getPrimaryImage(product: Product): string {
  return product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url ?? '';
}

export function getDefaultVariant(product: Product) {
  return product.variants.find((v) => v.isAvailable) ?? product.variants[0];
}
