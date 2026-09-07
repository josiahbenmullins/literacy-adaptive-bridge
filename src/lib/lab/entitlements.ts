import type { SupabaseClient } from '@supabase/supabase-js'

export type LABProductSlug =
  | 'gnt-lab'
  | 'lxx-lab'
  | 'iliad-lab'
  | 'odyssey-lab'

export async function hasProductAccess(
  supabase: SupabaseClient,
  userId: string,
  productSlug: LABProductSlug
): Promise<boolean> {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .single()

  if (productError) {
    throw productError
  }

  const { data: entitlement, error: entitlementError } = await supabase
    .from('entitlements')
    .select('id, expires_at')
    .eq('user_id', userId)
    .eq('product_id', product.id)
    .eq('status', 'active')
    .maybeSingle()

  if (entitlementError) {
    throw entitlementError
  }

  if (!entitlement) {
    return false
  }

  if (!entitlement.expires_at) {
    return true
  }

  return new Date(entitlement.expires_at).getTime() > Date.now()
}
