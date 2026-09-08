import { createBrowserClient } from '@supabase/ssr'

function getLABCookieOptions() {
  const isBrowser = typeof window !== 'undefined'

  const isLABDomain =
    isBrowser &&
    (
      window.location.hostname === 'literacyadaptivebridge.com' ||
      window.location.hostname.endsWith('.literacyadaptivebridge.com')
    )

  if (isLABDomain) {
    return {
      name: 'lab-auth',
      domain: 'literacyadaptivebridge.com',
      path: '/',
      sameSite: 'lax' as const,
      secure: true,
    }
  }

  return {
    name: 'lab-auth',
    path: '/',
    sameSite: 'lax' as const,
    secure: false,
  }
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: getLABCookieOptions(),
    }
  )
}
