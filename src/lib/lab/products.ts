import type { LABProductSlug } from '@/lib/lab/entitlements'

export type LABProductDefinition = {
  slug: LABProductSlug
  name: string
  code: string
  description: string
  state: 'available' | 'planned'
  productUrl?: string
}

export const LAB_PRODUCTS: LABProductDefinition[] = [
  {
    slug: 'gnt-lab',
    name: 'GNT LAB',
    code: 'GNT',
    description: 'Greek New Testament adaptive reader',
    state: 'available',
    productUrl: 'https://gnt.literacyadaptivebridge.com',
  },
  {
    slug: 'lxx-lab',
    name: 'LXX LAB',
    code: 'LXX',
    description: 'Septuagint adaptive reader',
    state: 'planned',
  },
  {
    slug: 'iliad-lab',
    name: 'Iliad LAB',
    code: 'ΙΛ',
    description: "Homer's Iliad adaptive reader",
    state: 'planned',
  },
  {
    slug: 'odyssey-lab',
    name: 'Odyssey LAB',
    code: 'ΟΔ',
    description: "Homer's Odyssey adaptive reader",
    state: 'planned',
  },
]
