import type { SupabaseClient } from '@supabase/supabase-js'

export const LAB_PRODUCT_SLUGS = [
  'gnt-lab',
  'lxx-lab',
  'iliad-lab',
  'odyssey-lab',
] as const

export type LABProductSlug =
  (typeof LAB_PRODUCT_SLUGS)[number]

export type LABProductAccess = {
  hasAccess: boolean
  source: string | null
}

export type LABProductAccessMap = Record<
  LABProductSlug,
  LABProductAccess
>

export function createEmptyProductAccessMap(): LABProductAccessMap {
  return Object.fromEntries(
    LAB_PRODUCT_SLUGS.map((slug) => [
      slug,
      {
        hasAccess: false,
        source: null,
      },
    ])
  ) as LABProductAccessMap
}

export async function getProductAccess(
  supabase: SupabaseClient,
  userId: string,
  productSlug: LABProductSlug
): Promise<LABProductAccess> {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .maybeSingle()

  if (productError) {
    throw productError
  }

  if (!product) {
    return {
      hasAccess: false,
      source: null,
    }
  }

  const { data: entitlement, error: entitlementError } = await supabase
    .from('entitlements')
    .select('id, expires_at, source, source_reference')
    .eq('user_id', userId)
    .eq('product_id', product.id)
    .eq('status', 'active')
    .maybeSingle()

  if (entitlementError) {
    throw entitlementError
  }

  if (!entitlement) {
    return {
      hasAccess: false,
      source: null,
    }
  }

  if (
    entitlement.expires_at &&
    new Date(entitlement.expires_at).getTime() <= Date.now()
  ) {
    return {
      hasAccess: false,
      source: entitlement.source ?? null,
    }
  }

  const normalizedSource =
    entitlement.source === 'admin' &&
    entitlement.source_reference?.startsWith('executive:')
      ? 'executive'
      : entitlement.source ?? null

  return {
    hasAccess: true,
    source: normalizedSource,
  }
}

export async function getAllProductAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<LABProductAccessMap> {
  const accessEntries = await Promise.all(
    LAB_PRODUCT_SLUGS.map(async (slug) => [
      slug,
      await getProductAccess(supabase, userId, slug),
    ] as const)
  )

  return Object.fromEntries(
    accessEntries
  ) as LABProductAccessMap
}

export async function hasProductAccess(
  supabase: SupabaseClient,
  userId: string,
  productSlug: LABProductSlug
): Promise<boolean> {
  const access = await getProductAccess(
    supabase,
    userId,
    productSlug
  )

  return access.hasAccess
}
